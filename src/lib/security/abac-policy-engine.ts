import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/database.types";

export interface PolicyContext {
  user: {
    id: string;
    role: string;
    investmentTier?: string;
    totalInvestment?: number;
  };
  resource: {
    type: string;
    action: string;
  };
  environment: {
    time?: Date;
    ipAddress?: string;
    deviceTrusted?: boolean;
  };
}

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
  requiresDeviceBinding?: boolean;
  requiresDualApproval?: boolean;
}

type SecurityPolicyRow = {
  policy_name: string;
  condition: unknown;
};

export const abacPolicyEngine = {
  async evaluate(context: PolicyContext): Promise<PolicyDecision> {
    const { data: policies } = await supabase.from("security_policies").select("*").eq("is_active", true);

    if (!policies || policies.length === 0) return { allowed: true };

    for (const p of policies) {
      const decision = await this.evaluatePolicy(p as unknown as SecurityPolicyRow, context);
      if (!decision.allowed) return decision;
    }

    return { allowed: true };
  },

  async evaluatePolicy(policy: SecurityPolicyRow, context: PolicyContext): Promise<PolicyDecision> {
    const conditions = (policy.condition || {}) as Record<string, unknown>;

    if (policy.policy_name === "HIGH_VALUE_DEVICE_BINDING") {
      const total = context.user.totalInvestment ?? 0;
      if (total >= 50000000 && !context.environment.deviceTrusted) {
        return {
          allowed: false,
          reason: "Trusted device required for accounts ≥₹5 Cr. Please register your device.",
          requiresDeviceBinding: true,
        };
      }
    }

    if (policy.policy_name === "TRANSACTION_TIME_WINDOW") {
      const now = context.environment.time || new Date();
      const hour = now.getHours();
      const startHour = typeof conditions.start_hour === "number" ? conditions.start_hour : 9;
      const endHour = typeof conditions.end_hour === "number" ? conditions.end_hour : 18;

      if (context.resource.action === "TRANSFER" || context.resource.action === "WITHDRAW") {
        if (hour < startHour || hour >= endHour) {
          return {
            allowed: false,
            reason: `Financial transactions are only allowed between ${startHour}:00 and ${endHour}:00.`,
          };
        }
      }
    }

    if (policy.policy_name === "DUAL_APPROVAL_REQUIRED") {
      if (context.resource.action === "WITHDRAW" || context.resource.action === "TRANSFER") {
        return { allowed: true, requiresDualApproval: true };
      }
    }

    return { allowed: true };
  },

  async getUserInvestmentTier(userId: string): Promise<{ tier: string; amount: number }> {
    const { data } = await supabase
      .from("user_attributes")
      .select("investment_tier, investment_amount")
      .eq("user_id", userId)
      .maybeSingle();

    const tier = (data as { investment_tier?: string } | null)?.investment_tier || "NONE";
    const amountRaw = (data as { investment_amount?: unknown } | null)?.investment_amount;

    return { tier, amount: Number(amountRaw || 0) };
  },

  async requiresDeviceBinding(userId: string): Promise<boolean> {
    const { amount } = await this.getUserInvestmentTier(userId);
    return amount >= 50000000;
  },

  async logPolicyDecision(
    userId: string,
    policyName: string,
    decision: PolicyDecision,
    context: PolicyContext
  ): Promise<void> {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : null;

    const meta: Record<string, unknown> = {
      policyName,
      decision: {
        allowed: decision.allowed,
        reason: decision.reason ?? null,
        requiresDeviceBinding: decision.requiresDeviceBinding ?? null,
        requiresDualApproval: decision.requiresDualApproval ?? null,
      },
      context: {
        user: context.user,
        resource: context.resource,
        environment: {
          time: context.environment.time ? context.environment.time.toISOString() : null,
          ipAddress: context.environment.ipAddress ?? null,
          deviceTrusted: context.environment.deviceTrusted ?? null,
        },
      },
    };

    await supabase.from("audit_logs").insert({
      user_id: userId,
      action: "POLICY_EVALUATION",
      entity: "ABAC",
      rbac_decision: decision.allowed ? "ALLOWED" : "DENIED",
      rbac_reason: decision.reason ? decision.reason.slice(0, 100) : null,
      rbac_metadata: meta as unknown as Json,
      ip_address: context.environment.ipAddress || null,
      user_agent: ua,
    });
  },
};
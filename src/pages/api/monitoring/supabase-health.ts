import type { NextApiRequest, NextApiResponse } from "next";

type CheckResult = { ok: boolean; status: number | null; error?: string };

type HealthResponse =
  | {
      ok: true;
      supabaseHost: string;
      checks: {
        authHealth: CheckResult;
        restHealth: CheckResult;
      };
      dns?: { ok: boolean; address?: string; family?: number; error?: string };
      now: string;
    }
  | {
      ok: false;
      error: string;
      missingEnv?: string[];
      supabaseHost?: string;
      checks?: {
        authHealth: CheckResult;
        restHealth: CheckResult;
      };
      dns?: { ok: boolean; address?: string; family?: number; error?: string };
      now: string;
    };

function redactHost(url: string): string {
  try {
    const u = new URL(url);
    return u.host;
  } catch {
    return "invalid-url";
  }
}

function normalizeSupabaseUrl(input: string | undefined): string {
  const trimmed = String(input || "").trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  if (trimmed.startsWith("http://")) return trimmed.replace("http://", "https://");
  return trimmed;
}

async function safeFetchStatus(url: string, headers?: Record<string, string>): Promise<CheckResult> {
  try {
    const res = await fetch(url, { method: "GET", headers, redirect: "follow" });
    return { ok: res.ok, status: res.status, error: undefined };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: null, error: msg || "fetch failed" };
  }
}

async function safeDnsLookup(host: string) {
  try {
    const dns = await import("node:dns/promises");
    const r = await dns.lookup(host);
    return { ok: true, address: r.address, family: r.family, error: undefined as string | undefined };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg || "dns lookup failed" };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed", now: new Date().toISOString() });
    return;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const missingEnv: string[] = [];
  if (!rawUrl) missingEnv.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) missingEnv.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const normalizedUrl = normalizeSupabaseUrl(rawUrl);
  const supabaseHost = normalizedUrl ? redactHost(normalizedUrl) : undefined;

  if (missingEnv.length) {
    res.status(500).json({
      ok: false,
      error: "Missing required environment variables in this deployment.",
      missingEnv,
      supabaseHost,
      now: new Date().toISOString(),
    });
    return;
  }

  const authHealthUrl = `${normalizedUrl}/auth/v1/health`;
  const restUrl = `${normalizedUrl}/rest/v1/`;

  const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };

  const dns = supabaseHost && supabaseHost !== "invalid-url" ? await safeDnsLookup(supabaseHost) : undefined;

  const [authHealth, restHealth] = await Promise.all([
    safeFetchStatus(authHealthUrl, headers),
    safeFetchStatus(restUrl, headers),
  ]);

  const ok = authHealth.ok || restHealth.ok;
  const now = new Date().toISOString();

  if (ok) {
    res.status(200).json({
      ok: true,
      supabaseHost: redactHost(normalizedUrl),
      checks: {
        authHealth,
        restHealth,
      },
      dns,
      now,
    });
    return;
  }

  res.status(502).json({
    ok: false,
    error: "Supabase health checks failed.",
    supabaseHost: redactHost(normalizedUrl),
    checks: {
      authHealth,
      restHealth,
    },
    dns,
    now,
  });
}
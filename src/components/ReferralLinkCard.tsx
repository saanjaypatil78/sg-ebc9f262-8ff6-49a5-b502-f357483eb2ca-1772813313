import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { referralService } from "@/services/referralService";
import { commissionService } from "@/services/commissionService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, Copy, Calculator, Share2 } from "lucide-react";

interface ReferralLinkCardProps {
  userId: string;
}

function toNumber(input: string): number {
  const cleaned = String(input || "").replace(/[^\d.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function ReferralLinkCard({ userId }: ReferralLinkCardProps) {
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [previewAmount, setPreviewAmount] = useState("100000");

  const [rank, setRank] = useState<string>("BASE");
  const [levelRates, setLevelRates] = useState<number[] | null>(null);

  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data: profileRow } = await supabase
          .from("user_profiles")
          .select("referral_code")
          .eq("user_id", userId)
          .maybeSingle();

        if (!cancelled) {
          const code = String(profileRow?.referral_code || "").trim();
          setReferralCode(code || userId);
        }
      } catch {
        if (!cancelled) setReferralCode(userId);
      }

      try {
        const { data: bv } = await supabase
          .from("user_business_volume")
          .select("current_rank")
          .eq("user_id", userId)
          .maybeSingle();

        if (!cancelled && bv?.current_rank) {
          setRank(String(bv.current_rank).toUpperCase());
        }
      } catch {}
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    let cancelled = false;

    const loadRates = async () => {
      const rates = await commissionService.getCommissionRatesForRank(rank);
      if (!cancelled) setLevelRates(rates);
    };

    loadRates();
    return () => {
      cancelled = true;
    };
  }, [rank]);

  const referralLink = useMemo(() => referralService.getReferralLink(referralCode || userId), [referralCode, userId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join the platform",
          text: "Register with my referral link to get started.",
          url: referralLink,
        });
      } catch {}
    } else {
      copyToClipboard();
    }
  };

  const preview = useMemo(() => {
    const amount = toNumber(previewAmount);
    return commissionService.calculateCommissionPreview({
      baseAmount: amount,
      levelRates: levelRates ?? undefined,
      adminChargeRate: commissionService.adminChargeRate,
    });
  }, [previewAmount, levelRates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-cyan-400" />
          Your Referral Link
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="bg-slate-800 border-slate-700" />
          <Button onClick={copyToClipboard} variant="outline" size="icon" className="shrink-0" aria-label="Copy referral link">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={copyToClipboard} variant="outline" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button onClick={shareLink} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg space-y-1">
          <p className="text-sm text-slate-300">
            <strong className="text-cyan-400">Referral Code:</strong> {referralCode || userId}
          </p>
          <p className="text-sm text-slate-300">
            <strong className="text-cyan-400">Current Rank:</strong> {rank}
          </p>
          <p className="text-xs text-slate-400">
            Preview rounds at each step: gross → admin fee ({(preview.adminChargeRate * 100).toFixed(0)}%) → net.
          </p>
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-cyan-400" />
            <div className="text-sm font-semibold text-slate-200">Commission Preview (6 Levels)</div>
          </div>

          <Input
            value={previewAmount}
            onChange={(e) => setPreviewAmount(e.target.value)}
            inputMode="numeric"
            placeholder="Enter downline investment amount (e.g., 100000)"
            className="bg-slate-900/50 border-slate-700 text-white"
          />

          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="grid grid-cols-5 gap-2 px-3 py-2 text-xs text-slate-400 bg-slate-900/40">
              <div>Level</div>
              <div>Rate</div>
              <div className="text-right">Gross</div>
              <div className="text-right">Admin</div>
              <div className="text-right">Net</div>
            </div>

            {preview.lines.map((l) => (
              <div key={l.level} className="grid grid-cols-5 gap-2 px-3 py-2 text-sm border-t border-white/5">
                <div className="text-slate-200">{l.level}</div>
                <div className="text-slate-300">{l.ratePercent.toFixed(2)}%</div>
                <div className="text-right text-slate-200">{commissionService.formatCurrency(l.grossCommission)}</div>
                <div className="text-right text-slate-300">{commissionService.formatCurrency(l.adminCharge)}</div>
                <div className="text-right text-emerald-300">{commissionService.formatCurrency(l.netCommission)}</div>
              </div>
            ))}

            <div className="grid grid-cols-5 gap-2 px-3 py-2 text-sm border-t border-white/10 bg-slate-900/30">
              <div className="col-span-2 text-slate-300 font-semibold">Totals</div>
              <div className="text-right text-slate-200 font-semibold">
                {commissionService.formatCurrency(preview.totals.grossCommission)}
              </div>
              <div className="text-right text-slate-300 font-semibold">
                {commissionService.formatCurrency(preview.totals.adminCharge)}
              </div>
              <div className="text-right text-emerald-300 font-semibold">
                {commissionService.formatCurrency(preview.totals.netCommission)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
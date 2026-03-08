import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Award, Target, Timer, TrendingUp } from "lucide-react";
import { rankProgressionService, InvestorRank } from "@/services/rankProgressionService";

interface RankProgressCardProps {
  userId: string;
  variant?: "compact" | "full";
}

export function RankProgressCard({ userId, variant = "full" }: RankProgressCardProps) {
  const [rankInfo, setRankInfo] = useState<InvestorRank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await rankProgressionService.getInvestorRank(userId);
        if (!cancelled) setRankInfo(data);
      } catch (error) {
        console.error("Failed to load rank info:", error);
        if (!cancelled) setRankInfo(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const rankBadge = useMemo(() => {
    return rankProgressionService.getRankBadge(rankInfo?.currentRank || "BASE");
  }, [rankInfo?.currentRank]);

  if (loading || !rankInfo) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${rankBadge.gradient}`}>
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Rank Dashboard</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${rankBadge.color} text-white`}>{rankBadge.label}</Badge>
                {rankInfo.previousRank && rankInfo.previousRank !== rankInfo.currentRank && (
                  <span className="text-xs text-slate-400">from {rankInfo.previousRank}</span>
                )}
              </div>
            </div>
          </div>

          {variant === "full" && (
            <div className="text-right">
              <div className="text-xs text-slate-400">Lifetime Team Business</div>
              <div className="text-sm font-semibold text-slate-200">
                {rankProgressionService.formatCurrency(rankInfo.lifetimeTeamBusiness)}
              </div>
            </div>
          )}
        </div>

        <div className="relative space-y-4">
          <div className="p-4 rounded-lg border border-white/10 bg-slate-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-slate-200">Last 3 consecutive months</span>
              </div>
              <div className="text-sm font-bold text-white">
                {rankProgressionService.formatCurrency(rankInfo.qualifyingBusinessVolume3m)}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Rank is evaluated on your team’s confirmed business volume in the last 3 consecutive months.
              If it drops below your current rank target, you will downgrade automatically.
            </p>
          </div>

          {rankInfo.nextRank ? (
            <div className="p-4 rounded-lg border border-white/10 bg-slate-900/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-slate-300">Progress to {rankInfo.nextRank}</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">{rankInfo.progressToNext.toFixed(2)}%</span>
              </div>

              <Progress value={rankInfo.progressToNext} className="h-3 mb-2" />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Now: {rankProgressionService.formatCurrency(rankInfo.qualifyingBusinessVolume3m)}</span>
                <span>
                  Target:{" "}
                  {rankInfo.nextRankTarget != null
                    ? rankProgressionService.formatCurrency(rankInfo.nextRankTarget)
                    : "Max"}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-300" />
                <span className="text-sm font-semibold text-purple-200">Maximum Rank Achieved</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
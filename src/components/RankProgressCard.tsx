import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, Award, Target, Zap } from "lucide-react";
import { rankProgressionService, InvestorRank } from "@/services/rankProgressionService";

interface RankProgressCardProps {
  userId: string;
}

export function RankProgressCard({ userId }: RankProgressCardProps) {
  const [rankInfo, setRankInfo] = useState<InvestorRank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankInfo();
  }, [userId]);

  const loadRankInfo = async () => {
    try {
      const data = await rankProgressionService.getInvestorRank(userId);
      setRankInfo(data);
    } catch (error) {
      console.error("Failed to load rank info:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const rankBadge = rankProgressionService.getRankBadge(rankInfo.currentRank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-6 overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${rankBadge.gradient}`}>
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Current Rank</h3>
              <Badge className={`${rankBadge.color} text-white mt-1`}>
                {rankBadge.label}
              </Badge>
            </div>
          </div>
          {rankInfo.previousRank && (
            <div className="text-right">
              <div className="text-xs text-slate-400">Upgraded from</div>
              <div className="text-sm font-semibold text-slate-300">
                {rankInfo.previousRank}
              </div>
            </div>
          )}
        </div>

        {/* Business Volume */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Total Business Volume</span>
            </div>
            <span className="text-lg font-bold text-white">
              {rankProgressionService.formatCurrency(rankInfo.totalBusinessVolume)}
            </span>
          </div>
        </div>

        {/* Progress to Next Rank */}
        {rankInfo.nextRank && (
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-slate-300">
                  Progress to {rankInfo.nextRank}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-300">
                {rankInfo.progressToNext.toFixed(1)}%
              </span>
            </div>
            <Progress value={rankInfo.progressToNext} className="h-3 mb-2" />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Current: {rankProgressionService.formatCurrency(rankInfo.totalBusinessVolume)}
              </span>
              <span>
                Target: {rankInfo.nextRankTarget ? rankProgressionService.formatCurrency(rankInfo.nextRankTarget) : "Max"}
              </span>
            </div>
          </div>
        )}

        {/* Achievement Message */}
        {rankInfo.currentRank === "AMBASSADOR" && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">
                🎉 Maximum Rank Achieved!
              </span>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
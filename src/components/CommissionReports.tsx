import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, Users, Award, DollarSign, Zap, ArrowRight } from "lucide-react";
import { commissionService, WealthDistribution } from "@/services/commissionService";
import { rankProgressionService } from "@/services/rankProgressionService";

interface CommissionReportsProps {
  userId: string;
  primaryInvestment: number;
}

export function CommissionReports({ userId, primaryInvestment }: CommissionReportsProps) {
  const [distribution, setDistribution] = useState<WealthDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissionData();
  }, [userId, primaryInvestment]);

  const loadCommissionData = async () => {
    try {
      // Mock referral data - in production, fetch from database
      const mockReferrals = [
        { userId: 'ref1', investment: 500000, level: 1 },
        { userId: 'ref2', investment: 1000000, level: 1 },
        { userId: 'ref3', investment: 2000000, level: 2 },
        { userId: 'ref4', investment: 500000, level: 2 },
        { userId: 'ref5', investment: 500000, level: 3 },
      ];

      const calc = await commissionService.calculateWealthDistribution(
        userId,
        primaryInvestment,
        mockReferrals
      );

      setDistribution(calc);
    } catch (error) {
      console.error('Failed to load commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !distribution) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  const breakdown = commissionService.getCommissionBreakdown(distribution);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-green-900/20 via-slate-900/40 to-emerald-900/20 backdrop-blur-xl border border-white/10 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10 animate-pulse" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Monthly Wealth Distribution</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal ROI */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Personal ROI (15%)</div>
                <div className="text-3xl font-bold text-green-400">
                  {commissionService.formatCurrency(distribution.investorProfit)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  From ₹{(primaryInvestment / 100000).toFixed(2)}L investment
                </div>
              </div>

              {/* Referral Commission */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Referral Commissions</div>
                <div className="text-3xl font-bold text-cyan-400">
                  {commissionService.formatCurrency(distribution.totalCommissionPaid)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {distribution.referralCommissions.length} referrals
                </div>
              </div>

              {/* Net Payout */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                <div className="text-sm text-orange-300 mb-1">Net Monthly Payout</div>
                <div className="text-3xl font-bold text-orange-400">
                  {commissionService.formatCurrency(distribution.netPayout)}
                </div>
                <div className="text-xs text-orange-300/70 mt-1">
                  After 10% admin charges
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-bold text-white">Payout Breakdown</h4>
          </div>

          <div className="space-y-4">
            {breakdown.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.amount >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    {item.percentage && (
                      <div className="text-xs text-slate-400">
                        {item.percentage > 0 ? '+' : ''}{item.percentage}%
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-lg font-bold ${item.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.amount >= 0 ? '+' : ''}{commissionService.formatCurrency(Math.abs(item.amount))}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Referral Commission Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-purple-400" />
            <h4 className="text-lg font-bold text-white">Referral Commission Details</h4>
          </div>

          <div className="space-y-3">
            {distribution.referralCommissions.map((comm, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30"
              >
                <div className="flex items-center gap-3">
                  <Badge className={`${rankProgressionService.getRankBadge(comm.rank).color}`}>
                    Level {comm.level}
                  </Badge>
                  <div className="text-sm text-slate-300">
                    {comm.commissionRate * 100}% of {commissionService.formatCurrency(comm.baseAmount)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-cyan-400">
                  +{commissionService.formatCurrency(comm.commissionAmount)}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
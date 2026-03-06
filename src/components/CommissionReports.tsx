import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Trophy, TrendingUp, Award } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function CommissionReports() {
  // Mock data for commission reports
  // In production, this would be fetched via commissionService
  // Mock data for display based on your "Public Ledger" requirement

  const totalCommissionsDistributed = 50000000; // ₹5 Crore
  const activeEarners = 247;
  const avgCommissionPerUser = 202429;

  const topEarners = [
    { id: 1, name: "Rajesh Kumar", rank: "Diamond", earnings: 2500000, commissions: 1850000 },
    { id: 2, name: "Priya Sharma", rank: "Platinum", earnings: 1800000, commissions: 1350000 },
    { id: 3, name: "Amit Patel", rank: "Gold", earnings: 1500000, commissions: 1125000 },
    { id: 4, name: "Sneha Reddy", rank: "Gold", earnings: 1200000, commissions: 900000 },
    { id: 5, name: "Vikram Singh", rank: "Silver", earnings: 950000, commissions: 712500 },
  ];

  const recentCommissions = [
    { id: 1, user: "Arjun Mehta", amount: 45000, type: "Direct Referral", date: "2026-03-06" },
    { id: 2, user: "Kavita Joshi", amount: 32000, type: "Team Leader Bonus", date: "2026-03-06" },
    { id: 3, user: "Rohit Verma", amount: 28000, type: "Direct Referral", date: "2026-03-05" },
    { id: 4, user: "Neha Gupta", amount: 55000, type: "Rank Bonus", date: "2026-03-05" },
    { id: 5, user: "Sanjay Desai", amount: 38000, type: "Direct Referral", date: "2026-03-04" },
  ];

  const getRankBadge = (rank: string) => {
    const colors: Record<string, string> = {
      "Diamond": "bg-purple-500/10 text-purple-400 border-purple-500/30",
      "Platinum": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      "Gold": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      "Silver": "bg-gray-500/10 text-gray-400 border-gray-500/30",
      "Bronze": "bg-orange-500/10 text-orange-400 border-orange-500/30",
    };

    return (
      <Badge variant="outline" className={colors[rank] || "bg-gray-500/10 text-gray-400"}>
        {rank}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-purple-900/20 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Total Distributed</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {formatCurrency(totalCommissionsDistributed)}
                </h3>
              </div>
              <DollarSign className="w-10 h-10 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/20 via-slate-900/40 to-cyan-900/20 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Active Earners</p>
                <h3 className="text-3xl font-bold text-white mt-1">{activeEarners}</h3>
              </div>
              <Trophy className="w-10 h-10 text-cyan-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 via-slate-900/40 to-green-900/20 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Avg Per User</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {formatCurrency(avgCommissionPerUser)}
                </h3>
              </div>
              <TrendingUp className="w-10 h-10 text-green-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Earners Leaderboard */}
      <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Top Earners Leaderboard
          </CardTitle>
          <CardDescription>Highest commission earners this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEarners.map((earner, index) => (
              <div 
                key={earner.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{earner.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRankBadge(earner.rank)}
                      <span className="text-xs text-slate-400">
                        Total: {formatCurrency(earner.earnings)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">
                    {formatCurrency(earner.commissions)}
                  </p>
                  <p className="text-xs text-slate-400">Commission Earned</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Commission Activity */}
      <Card className="bg-gradient-to-br from-slate-900/40 via-cyan-900/20 to-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Recent Commission Activity
          </CardTitle>
          <CardDescription>Latest commission transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCommissions.map((commission) => (
              <div 
                key={commission.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-800/30 to-transparent border-l-2 border-green-500/50 hover:bg-slate-800/50 transition-all"
              >
                <div>
                  <p className="font-medium text-white">{commission.user}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                      {commission.type}
                    </Badge>
                    <span className="text-xs text-slate-400">{commission.date}</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-400">
                  +{formatCurrency(commission.amount)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
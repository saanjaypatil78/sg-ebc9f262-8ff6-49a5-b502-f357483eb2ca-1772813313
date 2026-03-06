import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Trophy, TrendingUp, Users, Award } from "lucide-react";

export function CommissionReports() {
  // In a real app, these would be fetched via commissionService
  // Mock data for display based on your "Public Ledger" requirement
  const topEarners = [
    { name: "Sanjay Patil", rank: "Diamond", earned: 5400000, color: "text-blue-400" },
    { name: "Rajesh Kumar", rank: "Platinum", earned: 2800000, color: "text-purple-400" },
    { name: "Anita Desai", rank: "Gold", earned: 1200000, color: "text-yellow-400" },
  ];

  const recentCommissions = [
    { user: "Vikram S.", type: "Direct Referral", amount: 45000, date: "2 mins ago" },
    { user: "Priya M.", type: "Team Leader Bonus", amount: 12500, date: "15 mins ago" },
    { user: "Rahul K.", type: "Rank Bonus", amount: 5000, date: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Distributed */}
        <Card className="bg-card/50 border-white/10 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Commission Distributed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{formatCurrency(14500000)}</div>
            <p className="text-sm text-muted-foreground">Total payouts to affiliates</p>
            <div className="mt-4 h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[65%]" />
            </div>
            <p className="text-xs text-right mt-1 text-green-400">65% of monthly cap</p>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-card/50 border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Earners Leaderboard
            </CardTitle>
            <CardDescription>Highest performing partners this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEarners.map((earner, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold bg-white/5 ${i===0 ? 'text-yellow-500' : 'text-white'}`}>
                      #{i+1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{earner.name}</p>
                      <p className={`text-xs font-semibold ${earner.color}`}>{earner.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCurrency(earner.earned)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Feed */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Live Commission Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
            
            <div className="space-y-6">
              {recentCommissions.map((comm, i) => (
                <div key={i} className="relative pl-10 flex items-center justify-between">
                  {/* Dot */}
                  <div className="absolute left-[11px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-black" />
                  
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">{comm.user}</span> earned commission
                    </p>
                    <p className="text-xs text-muted-foreground">{comm.type} • {comm.date}</p>
                  </div>
                  <div className="text-sm font-bold text-green-400">
                    +{formatCurrency(comm.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
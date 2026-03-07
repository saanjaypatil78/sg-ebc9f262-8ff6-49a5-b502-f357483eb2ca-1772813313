import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NetworkTreeVisualization } from "@/components/NetworkTreeVisualization";
import { ReferralLinkCard } from "@/components/ReferralLinkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { referralService, NetworkStats, CommissionRecord } from "@/services/referralService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Award, Users } from "lucide-react";

export default function InvestorNetwork() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user ID - replace with real auth
  const userId = "mock-investor-id";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [statsData, commissionsData] = await Promise.all([
      referralService.getNetworkStats(userId),
      referralService.getCommissionHistory(userId),
    ]);
    setStats(statsData);
    setCommissions(commissionsData);
    setLoading(false);
  };

  const commissionBreakdown = referralService.calculateCommissionBreakdown(100000);

  return (
    <DashboardLayout role="investor">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Network & Commissions
          </h1>
          <p className="text-slate-400 mt-2">
            Track your 6-level referral network and earnings
          </p>
        </div>

        {/* Network Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Network</p>
                    <p className="text-2xl font-bold">{stats.totalNetworkSize}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Network Investment</p>
                    <p className="text-2xl font-bold">
                      ₹{stats.totalNetworkInvestment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Commissions</p>
                    <p className="text-2xl font-bold">
                      ₹{stats.totalCommissionsEarned.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Award className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Current Rank</p>
                    <p className="text-2xl font-bold">{stats.rank}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Referral Link */}
        <ReferralLinkCard userId={userId} />

        {/* Tabs */}
        <Tabs defaultValue="network" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="network">Network Tree</TabsTrigger>
            <TabsTrigger value="commissions">Commission History</TabsTrigger>
            <TabsTrigger value="breakdown">Commission Rates</TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="mt-6">
            <NetworkTreeVisualization userId={userId} />
          </TabsContent>

          <TabsContent value="commissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
              </CardHeader>
              <CardContent>
                {commissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No commissions earned yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {commissions.map((commission) => (
                      <div
                        key={commission.id}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div>
                          <p className="font-medium">Level {commission.commissionLevel}</p>
                          <p className="text-sm text-slate-400">
                            From: {commission.fromUserName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(commission.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            +₹{commission.netCommission.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">
                            Status: <span className="text-cyan-400">{commission.status}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>6-Level Commission Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <p className="text-sm text-slate-300">
                      Example: On ₹1,00,000 investment from your downline
                    </p>
                  </div>

                  <div className="space-y-2">
                    {commissionBreakdown.map((item) => (
                      <div
                        key={item.level}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div>
                          <p className="font-medium">Level {item.level}</p>
                          <p className="text-sm text-slate-400">
                            {item.rate}% commission rate
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-cyan-400">
                            ₹{item.netCommission.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            (After 10% admin fee)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Commission (All 6 Levels)</span>
                      <span className="text-xl font-bold text-purple-400">
                        ₹{commissionBreakdown
                          .reduce((sum, item) => sum + item.netCommission, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
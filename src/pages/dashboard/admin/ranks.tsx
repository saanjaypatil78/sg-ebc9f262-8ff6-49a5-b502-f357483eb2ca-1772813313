import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Search, TrendingUp, Award, Users, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { rankProgressionService } from "@/services/rankProgressionService";

interface InvestorRank {
  userId: string;
  fullName: string;
  email: string;
  currentRank: string;
  totalBusinessVolume: number;
  rankAchievedAt: string;
  previousRank: string | null;
}

export default function AdminRanksPage() {
  const [investors, setInvestors] = useState<InvestorRank[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<InvestorRank[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadInvestors();
  }, []);

  useEffect(() => {
    filterInvestors();
  }, [searchTerm, investors]);

  const loadInvestors = async () => {
    try {
      const { data, error } = await supabase
        .from("investor_ranks")
        .select(`
          user_id,
          current_rank,
          total_business_volume,
          rank_achieved_at,
          previous_rank,
          profiles!inner(full_name, email)
        `)
        .order("total_business_volume", { ascending: false });

      if (error) throw error;

      const mapped = data.map((item: any) => ({
        userId: item.user_id,
        fullName: item.profiles.full_name,
        email: item.profiles.email,
        currentRank: item.current_rank,
        totalBusinessVolume: item.total_business_volume,
        rankAchievedAt: item.rank_achieved_at,
        previousRank: item.previous_rank,
      }));

      setInvestors(mapped);
      setFilteredInvestors(mapped);
    } catch (error) {
      console.error("Failed to load investors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterInvestors = () => {
    if (!searchTerm) {
      setFilteredInvestors(investors);
      return;
    }

    const filtered = investors.filter(
      (inv) =>
        inv.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.currentRank.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredInvestors(filtered);
  };

  const processAutoUpgrades = async () => {
    setProcessing(true);
    try {
      let upgradeCount = 0;

      for (const investor of investors) {
        const upgraded = await rankProgressionService.checkAndUpgradeRank(investor.userId);
        if (upgraded) upgradeCount++;
      }

      if (upgradeCount > 0) {
        alert(`✅ ${upgradeCount} investor(s) upgraded!`);
        await loadInvestors();
      } else {
        alert("No investors eligible for upgrade at this time.");
      }
    } catch (error) {
      console.error("Auto-upgrade failed:", error);
      alert("Failed to process auto-upgrades");
    } finally {
      setProcessing(false);
    }
  };

  const getRankStats = () => {
    const stats = investors.reduce((acc, inv) => {
      acc[inv.currentRank] = (acc[inv.currentRank] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([rank, count]) => ({
      rank,
      count,
      percentage: ((count / investors.length) * 100).toFixed(1),
    }));
  };

  if (loading) {
    return (
      <>
        <SEO title="Rank Management - Admin" />
        <DashboardLayout role="admin">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <SEO title="Rank Management - Admin" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Rank Management</h2>
              <p className="text-slate-400">Monitor and manage investor ranks</p>
            </div>
            <Button
              onClick={processAutoUpgrades}
              disabled={processing}
              className="bg-gradient-to-r from-orange-500 to-amber-500"
            >
              {processing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Process Auto-Upgrades
                </>
              )}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 border-cyan-700/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/20">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Total Investors</div>
                  <div className="text-2xl font-bold text-white">{investors.length}</div>
                </div>
              </div>
            </Card>

            {getRankStats().slice(0, 3).map((stat, index) => {
              const badge = rankProgressionService.getRankBadge(stat.rank);
              return (
                <Card
                  key={stat.rank}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${badge.gradient}`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">{badge.label}</div>
                      <div className="text-2xl font-bold text-white">
                        {stat.count} ({stat.percentage}%)
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, email, or rank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700"
            />
          </div>

          {/* Investors Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Investor</TableHead>
                    <TableHead className="text-slate-300">Current Rank</TableHead>
                    <TableHead className="text-slate-300">Business Volume</TableHead>
                    <TableHead className="text-slate-300">Previous Rank</TableHead>
                    <TableHead className="text-slate-300">Achieved On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestors.map((investor, index) => {
                    const badge = rankProgressionService.getRankBadge(investor.currentRank);
                    return (
                      <motion.tr
                        key={investor.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-slate-700 hover:bg-slate-700/30"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{investor.fullName}</div>
                            <div className="text-sm text-slate-400">{investor.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${badge.color} text-white`}>{badge.label}</Badge>
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          {rankProgressionService.formatCurrency(investor.totalBusinessVolume)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {investor.previousRank || "-"}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(investor.rankAchievedAt).toLocaleDateString()}
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { investmentService } from "@/services/investmentService";
import { commissionService } from "@/services/commissionService";
import { formatCurrency } from "@/lib/utils";
import { 
  TrendingUp, Wallet, Calendar, Award, 
  ArrowUpRight, DollarSign, Users, Target,
  Download, ExternalLink, Clock
} from "lucide-react";
import { getNextPayoutDate } from "@/lib/calendar/payout-exclusions";
import dynamic from "next/dynamic";

// Lazy load heavy components
const DashboardWidgets = dynamic(() => import("@/components/DashboardWidgets").then(mod => ({ default: mod.DashboardWidgets })), { ssr: false });
const CommissionReports = dynamic(() => import("@/components/CommissionReports").then(mod => ({ default: mod.CommissionReports })), { ssr: false });

export default function InvestorDashboard() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [investments, setInvestments] = useState<any[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [nextPayoutDate, setNextPayoutDate] = useState("");
  const [currentRank, setCurrentRank] = useState("Grey");
  const [commissionData, setCommissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load investment data
      const agreementData = await (investmentService as any).getAgreement(user!.id);
      if (agreementData) {
        setInvestments([agreementData]);
        setTotalInvested(agreementData.principal_amount || 0);
        
        // Calculate earnings from payout history
        const payouts = await investmentService.getPayoutHistory(user!.id);
        const earnings = payouts.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        setTotalEarnings(earnings);
      }

      // Load next payout date
      const nextDate = getNextPayoutDate(new Date());
      setNextPayoutDate(nextDate.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }));

      // Load commission data
      const commData = await commissionService.getCommissionSummary(user!.id);
      setCommissionData(commData);
      setCurrentRank((commData as any)?.rank || (commData as any)?.ranking?.current_rank || "Grey");
      
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Invested",
      value: formatCurrency(totalInvested),
      change: "+15% monthly",
      icon: Wallet,
      color: "text-purple-400",
      bgGlow: "from-purple-500/20"
    },
    {
      label: "Total Earnings",
      value: formatCurrency(totalEarnings),
      change: `${investments.length} contracts`,
      icon: TrendingUp,
      color: "text-cyan-400",
      bgGlow: "from-cyan-500/20"
    },
    {
      label: "Current Rank",
      value: currentRank,
      change: "Next: Bronze",
      icon: Award,
      color: "text-yellow-400",
      bgGlow: "from-yellow-500/20"
    },
    {
      label: "Next Payout",
      value: nextPayoutDate.split(',')[0] || "Loading...",
      change: nextPayoutDate.split(',').slice(1).join(',') || "",
      icon: Calendar,
      color: "text-green-400",
      bgGlow: "from-green-500/20"
    }
  ];

  if (loading) {
    return (
      <>
        <SEO title="Investment Portfolio | Brave Ecom" />
        <DashboardLayout role="investor">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400">Loading your portfolio...</p>
            </div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <SEO title="Investment Portfolio | Brave Ecom" />
      <DashboardLayout role="investor">
        <motion.div 
          ref={containerRef}
          style={{ opacity, scale }}
          className="space-y-8 relative"
        >
          {/* Ambient background effects */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <motion.div 
              style={{ y: y1 }}
              className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" 
            />
            <motion.div 
              style={{ y: y2 }}
              className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px]" 
            />
          </div>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                  Investment Portfolio
                </h1>
                <p className="text-slate-400">Monitor your investments and track earnings in real-time</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GlassmorphicCard glow className="p-6 border-white/10 hover:border-white/20 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGlow} to-transparent border border-white/10`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-green-400 transition-colors" />
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.change}</p>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Investments */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="w-5 h-5 text-purple-400" />
                    Active Investments
                  </CardTitle>
                  <CardDescription>Your current investment contracts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {investments.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">No active investments yet</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white">
                        Start Investing
                      </Button>
                    </div>
                  ) : (
                    investments.map((inv, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                      >
                        <GlassmorphicCard className="p-6 border-white/10 hover:border-purple-500/30 transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-slate-400 mb-1">Investment #{idx + 1}</p>
                              <p className="text-2xl font-bold text-white">
                                {formatCurrency(inv.principal_amount || 0)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-400 mb-1">Status</p>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                                Active
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Monthly Return</p>
                              <p className="text-sm font-semibold text-cyan-400">15%</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Duration</p>
                              <p className="text-sm font-semibold text-white">28 Months</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Started</p>
                              <p className="text-sm font-semibold text-white">
                                {new Date(inv.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </GlassmorphicCard>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Commission Reports */}
              <CommissionReports />
            </motion.div>

            {/* Sidebar Widgets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-500 text-white">
                    <DollarSign className="w-4 h-4" />
                    New Investment
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 border-white/10 hover:border-white/20 text-white">
                    <Users className="w-4 h-4" />
                    Refer Friends
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 border-white/10 hover:border-white/20 text-white">
                    <ExternalLink className="w-4 h-4" />
                    View Payouts
                  </Button>
                </CardContent>
              </Card>

              {/* Payout Calendar */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Next Payout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-3xl font-bold text-white mb-2">
                      {nextPayoutDate.split(',')[0] || "Loading..."}
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      {nextPayoutDate.split(',').slice(1).join(',') || ""}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-xs text-cyan-400 font-semibold">Scheduled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rank Progress */}
              <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Rank Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Current Rank</span>
                        <span className="text-sm font-semibold text-yellow-400">{currentRank}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-xs text-slate-500 mb-2">Next Rank: Bronze</p>
                      <p className="text-xs text-slate-400">Build ₹1 Cr commission to upgrade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  );
}
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { investmentService, InvestmentAgreement, MonthlyPayout } from "@/services/investmentService";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Calendar, DollarSign, PieChart, ArrowUpRight, History, Download, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalInvested: 0,
    totalReceived: 0,
    monthlyReturn: 0,
    activeAgreements: 0,
    roi: 0
  });
  const [agreements, setAgreements] = useState<InvestmentAgreement[]>([]);
  const [payouts, setPayouts] = useState<MonthlyPayout[]>([]);
  const [nextPayoutDate, setNextPayoutDate] = useState("");

  useEffect(() => {
    async function loadInvestorData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const summary = await investmentService.getPortfolioSummary(user.id);
        const active = await investmentService.getInvestorAgreements(user.id);
        const history = await investmentService.getPayoutHistory(user.id);
        
        setSummary(summary);
        setAgreements(active);
        setPayouts(history);
        setNextPayoutDate(investmentService.calculateNextPayoutDate());
      } catch (error) {
        console.error("Failed to load investor data", error);
      }
    }
    if (user) {
      loadInvestorData();
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <SEO title="Investor Portfolio | Brave Ecom" />
      <DashboardLayout role="investor">
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section with Glassmorphic Background */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-cyan-900/20 backdrop-blur-xl border border-white/10 p-8"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 animate-pulse" />
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span className="text-sm font-semibold text-yellow-400">Premium Investor</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Investment Portfolio
                </h1>
                <p className="text-slate-400 mt-2">Track your agreements, returns, and payout schedule in real-time.</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-xl"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <Button 
                  onClick={() => window.location.href='/invest'} 
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-purple-500/30"
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  New Investment
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid with Glassmorphic Cards */}
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {[
              {
                title: "Total Invested",
                value: formatCurrency(summary.totalInvested),
                subtitle: `Across ${summary.activeAgreements} active agreements`,
                icon: DollarSign,
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-cyan-400",
                glow: "shadow-cyan-500/20"
              },
              {
                title: "Total Received",
                value: formatCurrency(summary.totalReceived),
                subtitle: `Lifetime earnings (ROI: ${summary.roi.toFixed(1)}%)`,
                icon: TrendingUp,
                gradient: "from-green-500/20 to-emerald-500/20",
                iconColor: "text-green-400",
                glow: "shadow-green-500/20"
              },
              {
                title: "Monthly Payout",
                value: formatCurrency(summary.monthlyReturn),
                subtitle: `Next payout: ${nextPayoutDate}`,
                icon: Calendar,
                gradient: "from-orange-500/20 to-amber-500/20",
                iconColor: "text-orange-400",
                glow: "shadow-orange-500/20"
              },
              {
                title: "Agreement Value",
                value: "₹43,00,000",
                subtitle: "Per standard contract unit",
                icon: PieChart,
                gradient: "from-purple-500/20 to-pink-500/20",
                iconColor: "text-purple-400",
                glow: "shadow-purple-500/20"
              }
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} backdrop-blur-xl border-white/10 ${stat.glow} shadow-2xl hover:scale-105 transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <p className="text-xs text-slate-400">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Active Agreements & Recent Payouts - Glassmorphic Split Layout */}
          <motion.div 
            className="grid gap-6 md:grid-cols-7"
            variants={containerVariants}
          >
            {/* Active Agreements */}
            <motion.div className="md:col-span-4" variants={itemVariants}>
              <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
                <CardHeader className="relative">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Active Agreements
                  </CardTitle>
                  <CardDescription>Your current active investment contracts</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {agreements.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <PieChart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No active agreements found.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 bg-white/5 border-white/10 hover:bg-white/10"
                          onClick={() => window.location.href='/invest'}
                        >
                          Start Investing
                        </Button>
                      </div>
                    ) : (
                      agreements.map((agreement, index) => (
                        <motion.div 
                          key={agreement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/5 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                        >
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-white flex items-center gap-2">
                              Agreement #{agreement.agreement_number}
                              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                                Active
                              </span>
                            </p>
                            <p className="text-xs text-slate-400">
                              Matures: {new Date(agreement.maturity_date).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">{formatCurrency(agreement.agreement_value)}</p>
                            <p className="text-xs text-green-400 font-semibold">15% Monthly</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Payouts */}
            <motion.div className="md:col-span-3" variants={itemVariants}>
              <Card className="bg-gradient-to-br from-slate-900/40 via-cyan-900/20 to-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5" />
                <CardHeader className="relative">
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-cyan-400" />
                    Recent Payouts
                  </CardTitle>
                  <CardDescription>Latest monthly returns credited</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {payouts.slice(0, 6).length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-sm">No payouts received yet.</p>
                        <p className="text-xs mt-2">First payout in {nextPayoutDate}</p>
                      </div>
                    ) : (
                      payouts.slice(0, 6).map((payout, index) => (
                        <motion.div 
                          key={payout.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-800/30 to-transparent border-l-2 border-green-500/50 hover:bg-slate-800/50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                              <History className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {new Date(payout.payout_month).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                              </p>
                              <p className="text-xs text-slate-400 capitalize">{payout.status}</p>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-green-400">
                            +{formatCurrency(payout.payout_amount)}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </DashboardLayout>
    </>
  );
}
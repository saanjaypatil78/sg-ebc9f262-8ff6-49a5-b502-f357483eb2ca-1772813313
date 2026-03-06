"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { GlassmorphicCard } from "./GlassmorphicCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";
import { MOCK_INVESTORS, INVESTOR_STATS, type InvestorData, type PayoutRecord } from "@/lib/mock-data/investors";
import { formatCurrency } from "@/lib/utils";

export function PublicLedger() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorData | null>(null);
  const itemsPerPage = 10;
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);
  
  // Auto-scroll through pages
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % Math.ceil(MOCK_INVESTORS.length / itemsPerPage));
    }, 5000); // Change page every 5 seconds
    
    return () => clearInterval(interval);
  }, [isInView]);
  
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentInvestors = MOCK_INVESTORS.slice(startIdx, endIdx);
  const totalPages = Math.ceil(MOCK_INVESTORS.length / itemsPerPage);
  
  // Rank colors
  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      "Grey": "text-slate-400 bg-slate-500/20 border-slate-500/30",
      "Bronze": "text-orange-400 bg-orange-500/20 border-orange-500/30",
      "Silver": "text-slate-300 bg-slate-400/20 border-slate-400/30",
      "Gold": "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
      "Platinum": "text-cyan-300 bg-cyan-500/20 border-cyan-500/30",
      "Diamond": "text-purple-300 bg-purple-500/20 border-purple-500/30",
      "Ambassador": "text-pink-300 bg-pink-500/20 border-pink-500/30",
    };
    return colors[rank] || colors["Grey"];
  };
  
  return (
    <section 
      ref={containerRef}
      id="transparency" 
      className="py-24 px-4 relative overflow-hidden"
    >
      {/* Background Effects */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute bottom-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-yellow-600/8 blur-[100px]" />
      </motion.div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
            100% Transparent Operations
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Public <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Investment Ledger</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every investment and payout publicly verifiable. Real UTR numbers, real transparency.
          </p>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Active Investors", value: INVESTOR_STATS.totalInvestors.toLocaleString(), icon: Users, color: "text-purple-400" },
            { label: "Total Investment", value: formatCurrency(INVESTOR_STATS.totalInvestment), icon: DollarSign, color: "text-green-400" },
            { label: "Total Payouts", value: formatCurrency(INVESTOR_STATS.totalPayouts), icon: TrendingUp, color: "text-cyan-400" },
            { label: "Success Rate", value: "100%", icon: Award, color: "text-yellow-400" },
          ].map((stat, idx) => (
            <GlassmorphicCard key={idx} className="p-6 text-center border-white/10" glow>
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </GlassmorphicCard>
          ))}
        </motion.div>
        
        {/* Investor Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <GlassmorphicCard className="p-6 border-white/10">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 pb-4 border-b border-white/5 text-sm text-slate-400 font-semibold">
              <div className="col-span-2">Investor</div>
              <div>Investment</div>
              <div>Total Payouts</div>
              <div>Rank</div>
              <div className="text-right">Actions</div>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-2 mt-4">
              {currentInvestors.map((investor, idx) => (
                <motion.div
                  key={investor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="grid grid-cols-6 gap-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg px-2 cursor-pointer"
                  onClick={() => setSelectedInvestor(investor)}
                >
                  <div className="col-span-2">
                    <div className="font-semibold text-white text-sm">{investor.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {investor.city}, {investor.state}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-white font-semibold">{formatCurrency(investor.investment_amount)}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(investor.investment_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-green-400 font-semibold">{formatCurrency(investor.total_payouts)}</div>
                    <div className="text-xs text-slate-500">{investor.payout_history.length} payouts</div>
                  </div>
                  <div>
                    <Badge className={`${getRankColor(investor.rank)} text-xs`}>
                      {investor.rank}
                    </Badge>
                  </div>
                  <div className="flex justify-end items-center">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                      onClick={() => setSelectedInvestor(investor)}
                    >
                      View
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <div className="text-sm text-slate-400">
                Page {currentPage + 1} of {totalPages} • Showing {startIdx + 1}-{Math.min(endIdx, MOCK_INVESTORS.length)} of {MOCK_INVESTORS.length} investors
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 hover:border-white/20"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 hover:border-white/20"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>
        
        {/* Investor Detail Modal */}
        {selectedInvestor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInvestor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <GlassmorphicCard className="p-8 border-white/20" glow>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedInvestor.name}</h3>
                    <p className="text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedInvestor.city}, {selectedInvestor.state}
                    </p>
                  </div>
                  <Badge className={`${getRankColor(selectedInvestor.rank)}`}>
                    {selectedInvestor.rank}
                  </Badge>
                </div>
                
                {/* Investment Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Investment</div>
                    <div className="text-xl font-bold text-white">{formatCurrency(selectedInvestor.investment_amount)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Total Payouts</div>
                    <div className="text-xl font-bold text-green-400">{formatCurrency(selectedInvestor.total_payouts)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Investment Date</div>
                    <div className="text-xl font-bold text-white">
                      {new Date(selectedInvestor.investment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                {/* Payout History */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Payout History ({selectedInvestor.payout_history.length} transactions)
                  </h4>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedInvestor.payout_history.map((payout, idx) => (
                      <div 
                        key={payout.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-white">{payout.month}</div>
                          <div className="text-green-400 font-bold">{formatCurrency(payout.amount)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs mb-1">UTR Number</div>
                            <div className="font-mono text-slate-300 text-xs">{payout.utr}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">TXN ID</div>
                            <div className="font-mono text-slate-300 text-xs">{payout.txn_id}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-xs text-slate-500">{payout.date}</div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            {payout.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setSelectedInvestor(null)}
                    className="bg-orange-600 hover:bg-orange-500 text-white"
                  >
                    Close
                  </Button>
                </div>
              </GlassmorphicCard>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
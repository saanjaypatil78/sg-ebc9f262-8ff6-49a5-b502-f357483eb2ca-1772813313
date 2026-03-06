"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, TrendingUp, Users, DollarSign, Award, X } from "lucide-react";
import { COMPREHENSIVE_LEDGER_DATA, LEDGER_STATS } from "@/lib/mock-data/comprehensive-ledger";

export function PublicLedger() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const investors = COMPREHENSIVE_LEDGER_DATA.slice(0, 30); // Show first 30 investors

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      GREY: "bg-gray-500",
      BRONZE: "bg-amber-700",
      SILVER: "bg-gray-400",
      GOLD: "bg-yellow-500",
      PLATINUM: "bg-cyan-400",
      DIAMOND: "bg-blue-400",
      AMBASSADOR: "bg-purple-500",
    };
    return colors[rank] || "bg-gray-500";
  };

  return (
    <section className="relative z-[100] py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Public Investment Ledger
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Complete transparency of all investments and payouts from January 2024 to March 2026
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900 border-2 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Investors</p>
                  <p className="text-3xl font-bold text-cyan-400">{LEDGER_STATS.totalInvestors}</p>
                </div>
                <Users className="w-12 h-12 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-2 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Investment</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ₹{(LEDGER_STATS.totalInvestment / 10000000).toFixed(2)} Cr
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-2 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Payouts Distributed</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{(LEDGER_STATS.totalPayoutsDistributed / 10000000).toFixed(2)} Cr
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-2 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Average ROI</p>
                  <p className="text-3xl font-bold text-purple-400">{LEDGER_STATS.averageROI}%</p>
                </div>
                <Award className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investor Grid - NO PAGINATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map((investor) => (
            <motion.div
              key={investor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900 border-2 border-slate-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/30 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{investor.name}</h3>
                      <p className="text-sm text-slate-400">{investor.investorId}</p>
                    </div>
                    <Badge className={`${getRankColor(investor.rank)} text-white`}>
                      {investor.rank}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-300">
                      <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                      {investor.city}, {investor.state}
                    </div>

                    <div className="flex items-center text-sm text-slate-300">
                      <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                      Invested: {new Date(investor.investmentDate).toLocaleDateString()}
                    </div>

                    <div className="pt-3 border-t border-slate-700">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-400">Investment:</span>
                        <span className="text-sm font-bold text-white">
                          ₹{investor.investmentAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-400">Total Payouts:</span>
                        <span className="text-sm font-bold text-green-400">
                          ₹{investor.totalPayouts.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">ROI:</span>
                        <span className="text-sm font-bold text-purple-400">
                          {((investor.totalPayouts / investor.investmentAmount) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedInvestor(investor)}
                      className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      View Payout History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-slate-400 mt-8">
          Showing 30 of {LEDGER_STATS.totalInvestors} investors
        </p>
      </div>

      {/* Payout History Modal */}
      {selectedInvestor && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-cyan-500"
          >
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-white">{selectedInvestor.name} - Payout History</h3>
              <Button
                onClick={() => setSelectedInvestor(null)}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400 mb-1">Investment Amount</p>
                    <p className="text-xl font-bold text-white">
                      ₹{selectedInvestor.investmentAmount.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400 mb-1">Total Payouts</p>
                    <p className="text-xl font-bold text-green-400">
                      ₹{selectedInvestor.totalPayouts.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400 mb-1">Investment Date</p>
                    <p className="text-xl font-bold text-white">
                      {new Date(selectedInvestor.investmentDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {selectedInvestor.payoutHistory.map((payout: any) => (
                  <Card key={payout.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{payout.month}</p>
                          <p className="text-sm text-slate-400">{payout.date}</p>
                          <p className="text-xs text-slate-500 mt-1">UTR: {payout.utr}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            ₹{payout.amount.toLocaleString()}
                          </p>
                          <Badge
                            className={
                              payout.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }
                          >
                            {payout.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
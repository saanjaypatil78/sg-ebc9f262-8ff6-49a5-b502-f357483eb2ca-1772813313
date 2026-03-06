"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  IndianRupee,
  Users,
  Award,
  BarChart3,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  COMPREHENSIVE_LEDGER_DATA,
  LEDGER_STATS,
  PAYOUT_TIMELINE,
  type LedgerInvestor,
} from "@/lib/mock-data/comprehensive-ledger";

export function PublicLedger() {
  const [investors, setInvestors] = useState<LedgerInvestor[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<LedgerInvestor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestor, setSelectedInvestor] = useState<LedgerInvestor | null>(null);
  const [rankFilter, setRankFilter] = useState<string>("ALL");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("ALL");
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 12;

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load data on mount
  useEffect(() => {
    setInvestors(COMPREHENSIVE_LEDGER_DATA);
    setFilteredInvestors(COMPREHENSIVE_LEDGER_DATA);
  }, []);

  // Auto-scroll to section if URL has #transparency hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#transparency") {
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Filter investors based on search and filters
  useEffect(() => {
    let filtered = investors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (inv) =>
          inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.investorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rank filter
    if (rankFilter !== "ALL") {
      filtered = filtered.filter((inv) => inv.rank === rankFilter);
    }

    // User type filter
    if (userTypeFilter !== "ALL") {
      filtered = filtered.filter((inv) => inv.userType === userTypeFilter);
    }

    setFilteredInvestors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, rankFilter, userTypeFilter, investors]);

  // Pagination
  const totalPages = Math.ceil(filteredInvestors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvestors = filteredInvestors.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

  const getUserTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      investor: "Investor",
      vendor: "Vendor",
      referral_partner: "Referral Partner",
    };
    return labels[type] || type;
  };

  if (!isMounted) {
    return (
      <section className="py-20 px-4 bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-cyan-500 animate-pulse">Loading Live Ledger Data...</div>
      </section>
    );
  }

  return (
    <section
      id="transparency"
      ref={sectionRef}
      className="relative z-10 py-20 px-4 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Public Investment Ledger
          </h2>
          <p className="text-xl text-slate-400">
            Complete transparency: January 2024 - March 1, 2026
          </p>
          <p className="text-lg text-slate-500 mt-2">
            {LEDGER_STATS.totalInvestors.toLocaleString()} investors • {formatCurrency(LEDGER_STATS.totalInvestment)} invested • {formatCurrency(LEDGER_STATS.totalPayoutsDistributed)} paid out
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Total Investors</p>
                  <p className="text-2xl font-bold text-white">{LEDGER_STATS.totalInvestors.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">Total Investment</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(LEDGER_STATS.totalInvestment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">Payouts Distributed</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(LEDGER_STATS.totalPayoutsDistributed)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-400">Average ROI</p>
                  <p className="text-2xl font-bold text-white">{LEDGER_STATS.averageROI}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={rankFilter === "ALL" ? "default" : "outline"}
              onClick={() => setRankFilter("ALL")}
              className="rounded-full"
            >
              All Ranks
            </Button>
            {Object.keys(LEDGER_STATS.rankDistribution).map((rank) => (
              <Button
                key={rank}
                variant={rankFilter === rank ? "default" : "outline"}
                onClick={() => setRankFilter(rank)}
                className="rounded-full"
              >
                {rank} ({LEDGER_STATS.rankDistribution[rank as keyof typeof LEDGER_STATS.rankDistribution]})
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={userTypeFilter === "ALL" ? "default" : "outline"}
              onClick={() => setUserTypeFilter("ALL")}
              className="rounded-full"
            >
              All Types
            </Button>
            <Button
              variant={userTypeFilter === "investor" ? "default" : "outline"}
              onClick={() => setUserTypeFilter("investor")}
              className="rounded-full"
            >
              Investors ({LEDGER_STATS.totalInvestorsOnly})
            </Button>
            <Button
              variant={userTypeFilter === "vendor" ? "default" : "outline"}
              onClick={() => setUserTypeFilter("vendor")}
              className="rounded-full"
            >
              Vendors ({LEDGER_STATS.totalVendors})
            </Button>
            <Button
              variant={userTypeFilter === "referral_partner" ? "default" : "outline"}
              onClick={() => setUserTypeFilter("referral_partner")}
              className="rounded-full"
            >
              Referral Partners ({LEDGER_STATS.totalReferralPartners})
            </Button>
          </div>
        </motion.div>

        {/* Investor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentInvestors.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400">
              No investors found matching your criteria.
            </div>
          ) : (
            currentInvestors.map((investor, idx) => (
              <motion.div
                key={investor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * (idx % 12) }}
              >
                <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {investor.name}
                        </h3>
                        <p className="text-sm text-slate-400">{investor.investorId}</p>
                      </div>
                      <Badge className={`${getRankColor(investor.rank)} text-white`}>
                        {investor.rank}
                      </Badge>
                    </div>

                    {/* Type Badge */}
                    <Badge variant="outline" className="mb-3">
                      {getUserTypeLabel(investor.userType)}
                    </Badge>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      {investor.location}
                    </div>

                    {/* Investment Amount */}
                    <div className="mb-3">
                      <p className="text-sm text-slate-400 mb-1">Investment</p>
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(investor.investmentAmount)}
                      </p>
                    </div>

                    {/* Payouts */}
                    <div className="mb-3">
                      <p className="text-sm text-slate-400 mb-1">Total Payouts</p>
                      <p className="text-lg font-semibold text-green-400">
                        {formatCurrency(investor.totalPayouts)}
                      </p>
                    </div>

                    {/* Additional metrics */}
                    {investor.userType === "vendor" && investor.totalSales && (
                      <div className="mb-3">
                        <p className="text-sm text-slate-400 mb-1">Total Sales</p>
                        <p className="text-lg font-semibold text-blue-400">
                          {formatCurrency(investor.totalSales)}
                        </p>
                      </div>
                    )}

                    {investor.userType === "referral_partner" && investor.downlineCount && (
                      <div className="mb-3">
                        <p className="text-sm text-slate-400 mb-1">Downline</p>
                        <p className="text-lg font-semibold text-purple-400">
                          {investor.downlineCount} members
                        </p>
                      </div>
                    )}

                    {/* ROI */}
                    <div className="mb-4">
                      <p className="text-sm text-slate-400 mb-1">ROI</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <p className="text-lg font-semibold text-cyan-400">
                          {((investor.totalPayouts / investor.investmentAmount) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    {/* Investment Date */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(investor.investmentDate)}
                    </div>

                    {/* Details Button */}
                    <Button
                      onClick={() => setSelectedInvestor(investor)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                      View Payout History
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              // Show first 3, last 3, and current page with neighbors
              const showPage =
                page <= 3 ||
                page > totalPages - 3 ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                if (page === 4 || page === totalPages - 3) {
                  return <span key={page} className="text-slate-500">...</span>;
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Investor Detail Modal */}
      {selectedInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-800"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {selectedInvestor.name}
                </h3>
                <p className="text-slate-400">{selectedInvestor.investorId}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedInvestor(null)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400 mb-1">Investment</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(selectedInvestor.investmentAmount)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400 mb-1">Total Payouts</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(selectedInvestor.totalPayouts)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400 mb-1">Joined</p>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(selectedInvestor.investmentDate)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payout History */}
              <div>
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Complete Payout History ({selectedInvestor.payoutHistory.length} transactions)
                </h4>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedInvestor.payoutHistory.map((payout) => (
                    <Card key={payout.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={payout.status === "completed" ? "default" : "outline"}>
                                {payout.status === "completed" ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </>
                                )}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {payout.type.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mb-1">{payout.month}</p>
                            <p className="text-xs text-slate-500">
                              {formatDate(payout.date)} • UTR: {payout.utr}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-green-400">
                            {formatCurrency(payout.amount)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
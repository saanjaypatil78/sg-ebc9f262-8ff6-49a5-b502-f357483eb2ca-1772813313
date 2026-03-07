import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, TrendingUp, DollarSign, Award, MapPin, Calendar, 
  Eye, Search, Filter, Download 
} from "lucide-react";
import { comprehensiveLedger, ledgerStats } from "@/lib/mock-data/comprehensive-ledger";

export function PublicLedger() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRank, setSelectedRank] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter logic
  const filteredInvestors = comprehensiveLedger.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = !selectedRank || investor.rank === selectedRank;
    return matchesSearch && matchesRank;
  });

  const totalPages = Math.ceil(filteredInvestors.length / itemsPerPage);
  const paginatedInvestors = filteredInvestors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'GOLD': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50';
      case 'SILVER': return 'bg-slate-400/10 text-slate-400 border-slate-400/50';
      case 'BRONZE': return 'bg-orange-500/10 text-orange-500 border-orange-500/50';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/50';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 px-4">
      {/* Header with Parallax */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Public Investment Ledger
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Complete transparency of all investments and payouts from January 2024 to March 2026
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
              <div className="text-4xl font-bold text-white">{ledgerStats.totalInvestors}</div>
              <div className="text-sm text-slate-400 mt-1">Total Investors</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <div className="text-4xl font-bold text-white">{formatCurrency(ledgerStats.totalInvestment)}</div>
              <div className="text-sm text-slate-400 mt-1">Total Investment</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <div className="text-4xl font-bold text-white">{formatCurrency(ledgerStats.totalPayouts)}</div>
              <div className="text-sm text-slate-400 mt-1">Payouts Distributed</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
              <div className="text-4xl font-bold text-white">{ledgerStats.averageROI.toFixed(2)}%</div>
              <div className="text-sm text-slate-400 mt-1">Average ROI</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search by name, ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2">
          {['BRONZE', 'SILVER', 'GOLD', 'GREY'].map(rank => (
            <Button
              key={rank}
              variant={selectedRank === rank ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRank(selectedRank === rank ? null : rank)}
              className={selectedRank === rank ? '' : 'border-white/20 hover:bg-white/5'}
            >
              {rank}
            </Button>
          ))}
        </div>
      </div>

      {/* Investor Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {paginatedInvestors.map((investor, index) => (
          <motion.div
            key={investor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {investor.name}
                    </h3>
                    <p className="text-sm text-slate-400">{investor.id}</p>
                  </div>
                  <Badge className={`${getRankColor(investor.rank)} border`}>
                    {investor.rank}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {investor.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    Invested: {investor.investedDate}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Investment:</span>
                    <span className="text-sm font-semibold text-white">{formatCurrency(investor.investment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Total Payouts:</span>
                    <span className="text-sm font-semibold text-green-400">{formatCurrency(investor.totalPayouts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">ROI:</span>
                    <span className="text-sm font-semibold text-purple-400">{investor.roi.toFixed(2)}%</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Payout History
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="border-white/20 hover:bg-white/5"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="border-white/20 hover:bg-white/5"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
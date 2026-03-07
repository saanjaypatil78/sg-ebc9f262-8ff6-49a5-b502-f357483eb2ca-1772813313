import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  investorNetworkService, 
  InvestorNetworkMember,
  PayoutHistoryRecord 
} from "@/services/investorNetworkService";
import { 
  Users, 
  Search, 
  Eye, 
  TrendingUp, 
  Award,
  MapPin,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function InvestorNetworkPage() {
  const [members, setMembers] = useState<InvestorNetworkMember[]>([]);
  const [currentUser, setCurrentUser] = useState<InvestorNetworkMember | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorNetworkMember | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    try {
      setLoading(true);
      const [networkData, profile] = await Promise.all([
        investorNetworkService.getNetworkMembers(),
        investorNetworkService.getCurrentInvestorProfile(),
      ]);
      setMembers(networkData);
      setCurrentUser(profile);
    } catch (error) {
      console.error('Error loading network:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayoutHistory = async (investor: InvestorNetworkMember) => {
    setSelectedInvestor(investor);
    setHistoryLoading(true);
    try {
      const history = await investorNetworkService.getPayoutHistory(investor.user_id);
      setPayoutHistory(history);
    } catch (error) {
      console.error('Error loading payout history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isCurrentUser = (member: InvestorNetworkMember) => {
    return currentUser?.id === member.id;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investor Network</h1>
          <p className="text-slate-400">
            {currentUser?.is_team_leader
              ? "View all investors in your referral network"
              : `View Level ${currentUser?.investor_level} investor network`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Members</div>
                <div className="text-2xl font-bold text-white">{members.length}</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Investment</div>
                <div className="text-2xl font-bold text-white">
                  {investorNetworkService.formatCurrency(
                    members.reduce((sum, m) => sum + m.investment_amount, 0),
                    'INR'
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Payouts</div>
                <div className="text-2xl font-bold text-white">
                  {investorNetworkService.formatCurrency(
                    members.reduce((sum, m) => sum + m.total_payout, 0),
                    'INR'
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Your Level</div>
                <div className="text-2xl font-bold text-white">
                  {currentUser?.is_team_leader ? 'Team Leader' : `Level ${currentUser?.investor_level}`}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 text-white"
            />
          </div>
        </Card>

        {/* Network Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/30">
                  <TableHead className="text-slate-300">Investor</TableHead>
                  <TableHead className="text-slate-300">Level</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Investment</TableHead>
                  <TableHead className="text-slate-300">Total Payout</TableHead>
                  <TableHead className="text-slate-300">ROI</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, index) => {
                  const roi = ((member.total_payout / member.investment_amount) * 100).toFixed(2);
                  const badge = investorNetworkService.getLevelBadge(member.investor_level);
                  const highlighted = isCurrentUser(member);

                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-slate-700 hover:bg-slate-700/30 ${
                        highlighted ? 'bg-orange-500/10 border-l-4 border-l-orange-500' : ''
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            highlighted ? 'bg-orange-500' : 'bg-cyan-500'
                          }`}>
                            {member.full_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white flex items-center gap-2">
                              {member.full_name}
                              {highlighted && (
                                <Badge className="bg-orange-500 text-white text-xs">You</Badge>
                              )}
                              {member.is_team_leader && (
                                <Badge className="bg-purple-500 text-white text-xs">Team Leader</Badge>
                              )}
                            </div>
                            <div className="text-sm text-slate-400">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${badge.color} text-white`}>
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {member.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {investorNetworkService.formatCurrency(member.investment_amount, member.currency)}
                      </TableCell>
                      <TableCell className="text-green-400 font-medium">
                        {investorNetworkService.formatCurrency(member.total_payout, member.currency)}
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${parseFloat(roi) >= 200 ? 'text-green-400' : 'text-orange-400'}`}>
                          {roi}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPayoutHistory(member)}
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Payout History
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Payout History Modal */}
      <Dialog open={!!selectedInvestor} onOpenChange={() => setSelectedInvestor(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Payout History - {selectedInvestor?.full_name}
            </DialogTitle>
          </DialogHeader>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-slate-900/50 border-slate-700 p-4">
                  <div className="text-sm text-slate-400 mb-1">Total Investment</div>
                  <div className="text-xl font-bold text-white">
                    {selectedInvestor && investorNetworkService.formatCurrency(
                      selectedInvestor.investment_amount,
                      selectedInvestor.currency
                    )}
                  </div>
                </Card>
                <Card className="bg-slate-900/50 border-slate-700 p-4">
                  <div className="text-sm text-slate-400 mb-1">Total Payouts</div>
                  <div className="text-xl font-bold text-green-400">
                    {selectedInvestor && investorNetworkService.formatCurrency(
                      selectedInvestor.total_payout,
                      selectedInvestor.currency
                    )}
                  </div>
                </Card>
                <Card className="bg-slate-900/50 border-slate-700 p-4">
                  <div className="text-sm text-slate-400 mb-1">Total Months</div>
                  <div className="text-xl font-bold text-cyan-400">
                    {payoutHistory.length}
                  </div>
                </Card>
              </div>

              {/* Payout History Table */}
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-slate-800 z-10">
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Month</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Amount</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoutHistory.map((payout, index) => (
                      <TableRow key={payout.id} className="border-slate-700">
                        <TableCell className="text-white font-medium">
                          {payout.month_year}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(payout.payout_date).toLocaleDateString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-400 font-medium">
                          {investorNetworkService.formatCurrency(payout.payout_amount, payout.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${
                            payout.status === 'completed' ? 'bg-green-500' : 
                            payout.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                          } text-white`}>
                            {payout.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { emailNotifications } from "@/lib/email/notifications";

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: string;
  createdAt: string;
  adminApprovedBy: string | null;
  superadminApprovedBy: string | null;
  paymentReference: string | null;
  rejectionReason: string | null;
}

export default function AdminWithdrawalsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<WithdrawalRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, requests]);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select(`
          *,
          profiles!withdrawal_requests_user_id_fkey(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        userName: item.profiles.full_name,
        userEmail: item.profiles.email,
        amount: item.amount,
        status: item.status,
        createdAt: item.created_at,
        adminApprovedBy: item.admin_approved_by,
        superadminApprovedBy: item.superadmin_approved_by,
        paymentReference: item.payment_reference,
        rejectionReason: item.rejection_reason,
      }));

      setRequests(mapped);
      setFilteredRequests(mapped);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (!searchTerm) {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter(
      (req) =>
        req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRequests(filtered);
  };

  const approveRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const newStatus = isSuperAdmin ? "PAYMENT_PROCESSING" : "ADMIN_APPROVED";
      const updateData = isSuperAdmin
        ? {
            status: newStatus,
            superadmin_approved_by: user.id,
            superadmin_approved_at: new Date().toISOString(),
          }
        : {
            status: newStatus,
            admin_approved_by: user.id,
            admin_approved_at: new Date().toISOString(),
          };

      const { error } = await supabase
        .from("withdrawal_requests")
        .update(updateData)
        .eq("id", requestId);

      if (error) throw error;

      // Send notification
      const request = requests.find((r) => r.id === requestId);
      if (request) {
        await emailNotifications.sendWithdrawalNotification({
          userEmail: request.userEmail,
          userName: request.userName,
          amount: request.amount,
          status: newStatus as any,
        });
      }

      alert("✅ Request approved!");
      await loadRequests();
    } catch (error) {
      console.error("Failed to approve request:", error);
      alert("Failed to approve request");
    }
  };

  const rejectRequest = async () => {
    if (!selectedRequest || !rejectionReason) return;

    try {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: "REJECTED",
          rejection_reason: rejectionReason,
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      await emailNotifications.sendWithdrawalNotification({
        userEmail: selectedRequest.userEmail,
        userName: selectedRequest.userName,
        amount: selectedRequest.amount,
        status: "REJECTED",
        rejectionReason,
      });

      alert("Request rejected");
      setShowRejectDialog(false);
      setRejectionReason("");
      await loadRequests();
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Failed to reject request");
    }
  };

  const completePayment = async () => {
    if (!selectedRequest || !paymentRef) return;

    try {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: "COMPLETED",
          payment_reference: paymentRef,
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      await emailNotifications.sendWithdrawalNotification({
        userEmail: selectedRequest.userEmail,
        userName: selectedRequest.userName,
        amount: selectedRequest.amount,
        status: "COMPLETED",
        referenceNumber: paymentRef,
      });

      alert("✅ Payment completed!");
      setShowPaymentDialog(false);
      setPaymentRef("");
      await loadRequests();
    } catch (error) {
      console.error("Failed to complete payment:", error);
      alert("Failed to complete payment");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: any }> = {
      PENDING: { color: "bg-yellow-500", label: "Pending", icon: Clock },
      ADMIN_APPROVED: { color: "bg-cyan-500", label: "Admin Approved", icon: CheckCircle },
      PAYMENT_PROCESSING: { color: "bg-blue-500", label: "Processing", icon: DollarSign },
      COMPLETED: { color: "bg-green-500", label: "Completed", icon: CheckCircle },
      REJECTED: { color: "bg-red-500", label: "Rejected", icon: XCircle },
    };
    return badges[status] || badges.PENDING;
  };

  const getStats = () => {
    return {
      pending: requests.filter((r) => r.status === "PENDING").length,
      adminApproved: requests.filter((r) => r.status === "ADMIN_APPROVED").length,
      processing: requests.filter((r) => r.status === "PAYMENT_PROCESSING").length,
      completed: requests.filter((r) => r.status === "COMPLETED").length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <>
        <SEO title="Withdrawal Management - Admin" />
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
      <SEO title="Withdrawal Management - Admin" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Management</h2>
            <p className="text-slate-400">Review and process withdrawal requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-700/50 p-6">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-sm text-slate-400">Pending</div>
                  <div className="text-2xl font-bold text-white">{stats.pending}</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 border-cyan-700/50 p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-cyan-400" />
                <div>
                  <div className="text-sm text-slate-400">Admin Approved</div>
                  <div className="text-2xl font-bold text-white">{stats.adminApproved}</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700/50 p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-sm text-slate-400">Processing</div>
                  <div className="text-2xl font-bold text-white">{stats.processing}</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/50 p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-sm text-slate-400">Completed</div>
                  <div className="text-2xl font-bold text-white">{stats.completed}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, email, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700"
            />
          </div>

          {/* Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">User</TableHead>
                    <TableHead className="text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Requested On</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request, index) => {
                    const statusBadge = getStatusBadge(request.status);
                    const Icon = statusBadge.icon;

                    return (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-slate-700 hover:bg-slate-700/30"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{request.userName}</div>
                            <div className="text-sm text-slate-400">{request.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          ₹{request.amount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusBadge.color} text-white flex items-center gap-1 w-fit`}>
                            <Icon className="w-4 h-4" />
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {request.status === "PENDING" && !isSuperAdmin && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => approveRequest(request.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {request.status === "ADMIN_APPROVED" && isSuperAdmin && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => approveRequest(request.id)}
                                  className="bg-cyan-500 hover:bg-cyan-600"
                                >
                                  Process Payment
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {request.status === "PAYMENT_PROCESSING" && isSuperAdmin && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowPaymentDialog(true);
                                }}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Complete Payment
                              </Button>
                            )}

                            {request.status === "COMPLETED" && request.paymentReference && (
                              <div className="text-sm text-slate-400">
                                Ref: {request.paymentReference}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Reject Withdrawal Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
              <div className="flex gap-2">
                <Button onClick={rejectRequest} variant="destructive" className="flex-1">
                  Confirm Rejection
                </Button>
                <Button onClick={() => setShowRejectDialog(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Completion Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Complete Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter payment reference number..."
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
              <div className="flex gap-2">
                <Button onClick={completePayment} className="bg-green-500 hover:bg-green-600 flex-1">
                  Confirm Payment
                </Button>
                <Button onClick={() => setShowPaymentDialog(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
}
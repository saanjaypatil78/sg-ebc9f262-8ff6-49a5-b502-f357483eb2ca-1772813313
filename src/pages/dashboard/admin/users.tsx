import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Search, Shield, CheckCircle2, XCircle, Eye, Download, Sparkles } from "lucide-react";
import { ExportTools } from "@/components/ExportTools";
import { motion } from "framer-motion";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  kyc_status: string;
  onboarding_completed: boolean;
  created_at: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  aadhaar_number: string | null;
  pan_number: string | null;
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  investment_amount: number | null;
  franchise_location: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKYC = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ kyc_status: "approved" })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error("Error approving KYC:", error);
    }
  };

  const handleRejectKYC = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ kyc_status: "rejected" })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
    };

    const colors: Record<string, string> = {
      pending: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
      approved: "text-green-400 border-green-400/30 bg-green-400/10",
      rejected: "text-red-400 border-red-400/30 bg-red-400/10",
    };

    return (
      <Badge variant={variants[status] || "outline"} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      investor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      franchise_partner: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      admin: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      super_admin: "bg-red-500/10 text-red-400 border-red-500/30",
      vendor: "bg-green-500/10 text-green-400 border-green-500/30",
      client: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    };

    return (
      <Badge variant="outline" className={colors[role] || "bg-gray-500/10 text-gray-400"}>
        {role.replace("_", " ")}
      </Badge>
    );
  };

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
      opacity: 1
    }
  };

  return (
    <>
      <SEO title="User Management - Brave Ecom Admin" />
      <DashboardLayout role="admin">
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Glassmorphic Header */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-orange-900/20 backdrop-blur-xl border border-white/10 p-8"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-orange-500/10 animate-pulse" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
                  <span className="text-sm font-semibold text-orange-400">Admin Control Panel</span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-orange-200 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-slate-400 mt-2">
                  Manage all registered users, KYC approvals, and onboarding status
                </p>
              </div>
              <ExportTools 
                data={filteredUsers} 
                filename="users_report"
                headers={['email', 'first_name', 'last_name', 'role', 'kyc_status', 'onboarding_completed']}
              />
            </div>
          </motion.div>

          {/* Glassmorphic Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {[
              {
                label: "Total Users",
                value: users.length,
                icon: Users,
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-cyan-400"
              },
              {
                label: "Pending KYC",
                value: users.filter(u => u.kyc_status === "pending").length,
                icon: Shield,
                gradient: "from-yellow-500/20 to-orange-500/20",
                iconColor: "text-yellow-400"
              },
              {
                label: "Approved",
                value: users.filter(u => u.kyc_status === "approved").length,
                icon: CheckCircle2,
                gradient: "from-green-500/20 to-emerald-500/20",
                iconColor: "text-green-400"
              },
              {
                label: "Rejected",
                value: users.filter(u => u.kyc_status === "rejected").length,
                icon: XCircle,
                gradient: "from-red-500/20 to-pink-500/20",
                iconColor: "text-red-400"
              }
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} backdrop-blur-xl border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-300">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                      </div>
                      <stat.icon className={`w-10 h-10 ${stat.iconColor} opacity-60`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Glassmorphic Users Table */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
              <CardHeader className="relative">
                <CardTitle className="text-white">All Users</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search by email, name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-slate-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
                    Loading users...
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <Table>
                      <TableHeader className="bg-slate-800/50">
                        <TableRow className="border-white/10 hover:bg-slate-800/70">
                          <TableHead className="text-slate-300">Name</TableHead>
                          <TableHead className="text-slate-300">Email</TableHead>
                          <TableHead className="text-slate-300">Role</TableHead>
                          <TableHead className="text-slate-300">KYC Status</TableHead>
                          <TableHead className="text-slate-300">Onboarding</TableHead>
                          <TableHead className="text-slate-300">Joined</TableHead>
                          <TableHead className="text-right text-slate-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-white/5 hover:bg-slate-800/30 transition-colors"
                          >
                            <TableCell className="font-medium text-white">
                              {user.first_name} {user.last_name}
                            </TableCell>
                            <TableCell className="text-slate-300">{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{getStatusBadge(user.kyc_status)}</TableCell>
                            <TableCell>
                              {user.onboarding_completed ? (
                                <Badge className="bg-green-500/10 text-green-400 border-green-400/30">
                                  Complete
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                                  Incomplete
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDetailDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {user.kyc_status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleApproveKYC(user.id)}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRejectKYC(user.id)}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* User Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">User Details</DialogTitle>
              <DialogDescription className="text-slate-400">
                Complete information for {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Full Name</p>
                      <p className="font-medium text-white">{selectedUser.first_name} {selectedUser.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Email</p>
                      <p className="font-medium text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Phone</p>
                      <p className="font-medium text-white">{selectedUser.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Role</p>
                      <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {selectedUser.address && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm text-slate-400">Street Address</p>
                        <p className="font-medium text-white">{selectedUser.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">City</p>
                        <p className="font-medium text-white">{selectedUser.city || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">State</p>
                        <p className="font-medium text-white">{selectedUser.state || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Pincode</p>
                        <p className="font-medium text-white">{selectedUser.pincode || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* KYC Documents */}
                {(selectedUser.aadhaar_number || selectedUser.pan_number) && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">KYC Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Aadhaar Number</p>
                        <p className="font-medium font-mono text-white">{selectedUser.aadhaar_number || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">PAN Number</p>
                        <p className="font-medium font-mono text-white">{selectedUser.pan_number || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">KYC Status</p>
                        <div className="mt-1">{getStatusBadge(selectedUser.kyc_status)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Details */}
                {selectedUser.bank_name && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Bank Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Bank Name</p>
                        <p className="font-medium text-white">{selectedUser.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Account Number</p>
                        <p className="font-medium font-mono text-white">{selectedUser.account_number || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">IFSC Code</p>
                        <p className="font-medium font-mono text-white">{selectedUser.ifsc_code || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Investment Details */}
                {selectedUser.investment_amount && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Investment Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Investment Amount</p>
                        <p className="font-medium text-lg text-green-400">₹{selectedUser.investment_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Status */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Account Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Onboarding Status</p>
                      <div className="mt-1">
                        {selectedUser.onboarding_completed ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-400/30">
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Joined Date</p>
                      <p className="font-medium text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
}
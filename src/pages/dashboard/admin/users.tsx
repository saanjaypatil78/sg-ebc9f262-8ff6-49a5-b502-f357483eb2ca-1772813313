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
import { Users, Search, Shield, CheckCircle2, XCircle, Eye } from "lucide-react";

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
  // Additional fields for detail view
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
      fetchUsers(); // Refresh list
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
      fetchUsers(); // Refresh list
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
      pending: "text-yellow-600",
      approved: "text-green-600",
      rejected: "text-red-600",
    };

    return (
      <Badge variant={variants[status] || "outline"} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      investor: "bg-blue-500/10 text-blue-600",
      franchise_partner: "bg-purple-500/10 text-purple-600",
      admin: "bg-orange-500/10 text-orange-600",
      super_admin: "bg-red-500/10 text-red-600",
      vendor: "bg-green-500/10 text-green-600",
      client: "bg-cyan-500/10 text-cyan-600",
    };

    return (
      <Badge variant="outline" className={colors[role] || "bg-gray-500/10 text-gray-600"}>
        {role.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <>
      <SEO title="User Management - Brave Ecom Admin" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage all registered users, KYC approvals, and onboarding status
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
                  </div>
                  <Users className="w-8 h-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending KYC</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {users.filter(u => u.kyc_status === "pending").length}
                    </h3>
                  </div>
                  <Shield className="w-8 h-8 text-yellow-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {users.filter(u => u.kyc_status === "approved").length}
                    </h3>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {users.filter(u => u.kyc_status === "rejected").length}
                    </h3>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email, name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading users...
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>Onboarding</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.kyc_status)}</TableCell>
                          <TableCell>
                            {user.onboarding_completed ? (
                              <Badge variant="default" className="bg-green-500/10 text-green-600">
                                Complete
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600">
                                Incomplete
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
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
                                    variant="default"
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {selectedUser.address && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Street Address</p>
                        <p className="font-medium">{selectedUser.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">City</p>
                        <p className="font-medium">{selectedUser.city || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">State</p>
                        <p className="font-medium">{selectedUser.state || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pincode</p>
                        <p className="font-medium">{selectedUser.pincode || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* KYC Documents */}
                {(selectedUser.aadhaar_number || selectedUser.pan_number) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">KYC Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Aadhaar Number</p>
                        <p className="font-medium font-mono">{selectedUser.aadhaar_number || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">PAN Number</p>
                        <p className="font-medium font-mono">{selectedUser.pan_number || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">KYC Status</p>
                        <div className="mt-1">{getStatusBadge(selectedUser.kyc_status)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Details */}
                {selectedUser.bank_name && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Bank Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Bank Name</p>
                        <p className="font-medium">{selectedUser.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-medium font-mono">{selectedUser.account_number || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">IFSC Code</p>
                        <p className="font-medium font-mono">{selectedUser.ifsc_code || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Investment Details */}
                {selectedUser.investment_amount && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Investment Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Investment Amount</p>
                        <p className="font-medium text-lg">₹{selectedUser.investment_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Franchise Details */}
                {selectedUser.franchise_location && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Franchise Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{selectedUser.franchise_location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Account Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Onboarding Status</p>
                      <div className="mt-1">
                        {selectedUser.onboarding_completed ? (
                          <Badge variant="default" className="bg-green-500/10 text-green-600">
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600">
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Joined Date</p>
                      <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
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
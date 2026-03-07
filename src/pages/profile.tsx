import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/orderService";
import { getInvestorById } from "@/services/investorService";
import { 
  User, 
  Package, 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Download,
  Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [earnings, setEarnings] = useState({
    totalCommission: 0,
    pendingCommission: 0,
    withdrawableBalance: 0,
    totalWithdrawn: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load orders
      const ordersData = await orderService.getClientOrders(user?.id || "");
      setOrders(ordersData || []);

      // Load earnings
      const earningsData = await getInvestorById(user?.id || "");
      setEarnings({
        totalCommission: earningsData?.total_payouts || 0,
        pendingCommission: 0,
        withdrawableBalance: earningsData?.total_payouts || 0,
        totalWithdrawn: 0,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Processing", variant: "secondary" },
      confirmed: { label: "Confirmed", variant: "default" },
      shipped: { label: "Shipped", variant: "default" },
      delivered: { label: "Delivered", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
      returned: { label: "Returned", variant: "outline" },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="My Profile - Brave Ecom Mall" description="View your orders, earnings, and account details" />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Profile Header */}
          <Card className="mb-8 border-cyan-200 dark:border-cyan-900/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24 border-4 border-cyan-500/20">
                  <AvatarImage src={(user as any)?.user_metadata?.avatar_url || (user as any)?.avatar_url} />
                  <AvatarFallback className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-2xl font-bold">
                    {((user as any)?.user_metadata?.full_name || (user as any)?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {(user as any)?.user_metadata?.full_name || (user as any)?.full_name || "Guest User"}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{user?.email}</p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-cyan-500" />
                      <span className="font-medium">{orders.length} Orders</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-cyan-500" />
                      <span className="font-medium">Member since {new Date((user as any)?.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Orders and Earnings */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                My Orders
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Earnings
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-slate-500 mb-6">Start shopping to see your orders here</p>
                    <Button onClick={() => router.push("/shop")}>
                      Browse Products
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="hover:border-cyan-500/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">Order #{order.order_id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                              <p>
                                <Clock className="w-4 h-4 inline mr-2" />
                                Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                              </p>
                              <p>
                                <Package className="w-4 h-4 inline mr-2" />
                                {order.order_items?.length || 0} item(s)
                              </p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                  ₹{parseFloat(order.total_amount || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 md:w-48">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => router.push(`/dashboard/client/orders`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {order.status === "delivered" && (
                              <Button 
                                variant="outline" 
                                className="w-full"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Invoice
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-cyan-200 dark:border-cyan-900/50">
                  <CardHeader className="pb-3">
                    <CardDescription>Total Earnings</CardDescription>
                    <CardTitle className="text-3xl text-cyan-600">
                      ₹{earnings.totalCommission.toLocaleString("en-IN")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-emerald-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Lifetime earnings
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Pending</CardDescription>
                    <CardTitle className="text-3xl text-amber-600">
                      ₹{earnings.pendingCommission.toLocaleString("en-IN")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Processing
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200 dark:border-emerald-900/50">
                  <CardHeader className="pb-3">
                    <CardDescription>Available Balance</CardDescription>
                    <CardTitle className="text-3xl text-emerald-600">
                      ₹{earnings.withdrawableBalance.toLocaleString("en-IN")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Withdraw
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Withdrawn</CardDescription>
                    <CardTitle className="text-3xl">
                      ₹{earnings.totalWithdrawn.toLocaleString("en-IN")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-slate-500">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>How Earnings Work</CardTitle>
                  <CardDescription>Understand your commission structure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Referral Commissions</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Earn up to 23% commission on purchases made by your network (6 levels deep)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <Wallet className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Shop with Earnings</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Use your available balance to get discounts on products at checkout
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Vendor Returns</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        As a vendor, earn 25% monthly returns on active investments
                      </p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => router.push("/invest")}>
                    Learn More About Investment Plans
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
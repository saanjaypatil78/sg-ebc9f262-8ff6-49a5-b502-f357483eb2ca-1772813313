import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { Search, Package, Truck, CheckCircle, XCircle, RotateCcw } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function ClientOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const data = await orderService.getClientOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "processing":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.products?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <>
      <SEO title="My Orders - Brave Ecom Mall" />
      <DashboardLayout role="client">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Orders
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Track and manage your orders
              </p>
            </div>
            <Link href="/shop">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Order Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                      {orderStats.total}
                    </p>
                  </div>
                  <Package className="w-12 h-12 text-slate-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      {orderStats.pending}
                    </p>
                  </div>
                  <Package className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Shipped</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {orderStats.shipped}
                    </p>
                  </div>
                  <Truck className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Delivered</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {orderStats.delivered}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-slate-600 dark:text-slate-400">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No orders found</p>
                  <Link href="/shop">
                    <Button className="mt-4 bg-cyan-500 hover:bg-cyan-600">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0">
                              {order.products?.image_url ? (
                                <img
                                  src={order.products.image_url}
                                  alt={order.products.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package className="w-6 h-6 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {order.products?.name || "Product"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {order.vendors?.business_name || "Vendor"}
                          </p>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{parseFloat(order.total_amount).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {new Date(order.created_at).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                  Order ID: {order.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Tracking Number
                                  </p>
                                  <p className="font-mono font-medium">
                                    {order.tracking_number || "Not available"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Courier
                                  </p>
                                  <p className="font-medium">
                                    {order.courier_name || "Not assigned"}
                                  </p>
                                </div>
                                {order.qr_code && (
                                  <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                      QR Code
                                    </p>
                                    <img
                                      src={order.qr_code}
                                      alt="Order QR"
                                      className="w-32 h-32"
                                    />
                                  </div>
                                )}
                                {order.status === "delivered" && (
                                  <Link href={`/dashboard/client/returns?order=${order.id}`}>
                                    <Button variant="outline" className="w-full">
                                      <RotateCcw className="w-4 h-4 mr-2" />
                                      Request Return
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
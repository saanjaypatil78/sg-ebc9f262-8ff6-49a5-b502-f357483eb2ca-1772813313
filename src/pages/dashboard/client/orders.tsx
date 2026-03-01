import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Eye, Download, RotateCcw, Truck } from "lucide-react";
import { useState } from "react";
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

const orders = [
  {
    id: "ORD-001",
    product: "Wireless Headphones",
    vendor: "TechSupplies Co",
    amount: "$89.99",
    status: "Delivered",
    date: "2026-02-28",
    tracking: "TRK789456123",
    qrCode: "QR-WH-001-789",
    expectedDelivery: "2026-03-02",
    actualDelivery: "2026-03-01"
  },
  {
    id: "ORD-002",
    product: "Smart Watch",
    vendor: "QuickShip Ltd",
    amount: "$199.99",
    status: "In Transit",
    date: "2026-02-27",
    tracking: "TRK456789012",
    qrCode: "QR-SW-002-456",
    expectedDelivery: "2026-03-03",
    actualDelivery: null
  },
  {
    id: "ORD-003",
    product: "Phone Case",
    vendor: "Premium Goods",
    amount: "$24.99",
    status: "Processing",
    date: "2026-02-26",
    tracking: "Pending",
    qrCode: "QR-PC-003-123",
    expectedDelivery: "2026-03-04",
    actualDelivery: null
  },
  {
    id: "ORD-004",
    product: "USB-C Cable",
    vendor: "FastTrack Inc",
    amount: "$12.99",
    status: "Delivered",
    date: "2026-02-25",
    tracking: "TRK123456789",
    qrCode: "QR-UC-004-321",
    expectedDelivery: "2026-02-28",
    actualDelivery: "2026-02-27"
  },
  {
    id: "ORD-005",
    product: "Laptop Stand",
    vendor: "TechSupplies Co",
    amount: "$45.99",
    status: "Delivered",
    date: "2026-02-24",
    tracking: "TRK987654321",
    qrCode: "QR-LS-005-987",
    expectedDelivery: "2026-02-27",
    actualDelivery: "2026-02-28"
  }
];

export default function ClientOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "In Transit":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "Processing":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <>
      <SEO title="My Orders - DropSync" />
      <DashboardLayout role="client">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Orders</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Track and manage your purchases
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by order ID or product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>QR Code</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {order.vendor}
                      </TableCell>
                      <TableCell className="font-medium">{order.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {order.qrCode}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                  Complete information for {order.id}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Product
                                      </p>
                                      <p className="font-medium">{selectedOrder.product}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Vendor
                                      </p>
                                      <p className="font-medium">{selectedOrder.vendor}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Order Date
                                      </p>
                                      <p className="font-medium">{selectedOrder.date}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Status
                                      </p>
                                      <Badge className={getStatusColor(selectedOrder.status)}>
                                        {selectedOrder.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Tracking Number
                                      </p>
                                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        {selectedOrder.tracking}
                                      </code>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        QR Code
                                      </p>
                                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        {selectedOrder.qrCode}
                                      </code>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Expected Delivery
                                      </p>
                                      <p className="font-medium">
                                        {selectedOrder.expectedDelivery}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Actual Delivery
                                      </p>
                                      <p className="font-medium">
                                        {selectedOrder.actualDelivery || "In Progress"}
                                      </p>
                                    </div>
                                  </div>
                                  {selectedOrder.status === "Delivered" && (
                                    <div className="flex gap-2 pt-4 border-t">
                                      <Button variant="outline" className="flex-1">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Request Return
                                      </Button>
                                      <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                                        Download Invoice
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          {order.status === "In Transit" && (
                            <Button variant="ghost" size="icon">
                              <Truck className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
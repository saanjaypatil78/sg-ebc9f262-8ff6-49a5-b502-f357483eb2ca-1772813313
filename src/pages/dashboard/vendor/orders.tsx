import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QrCode, Search, Upload, CheckCircle, Clock, Package } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vendorOrders = [
  {
    id: "ORD-201",
    product: "Wireless Mouse",
    customer: "John Doe",
    amount: "$29.99",
    status: "Pending",
    priority: "High",
    deadline: "2026-03-02",
    qrGenerated: false
  },
  {
    id: "ORD-202",
    product: "Keyboard",
    customer: "Sarah Miller",
    amount: "$79.99",
    status: "Processing",
    priority: "Medium",
    deadline: "2026-03-03",
    qrGenerated: true
  },
  {
    id: "ORD-203",
    product: "Monitor Stand",
    customer: "Mike Roberts",
    amount: "$45.99",
    status: "Shipped",
    priority: "Low",
    deadline: "2026-03-04",
    qrGenerated: true
  },
  {
    id: "ORD-204",
    product: "Webcam",
    customer: "Lisa Anderson",
    amount: "$89.99",
    status: "Pending",
    priority: "High",
    deadline: "2026-03-02",
    qrGenerated: false
  }
];

export default function VendorOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof vendorOrders[0] | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");

  const filteredOrders = vendorOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shipped":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "Processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "Pending":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-orange-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  };

  const handleGenerateQR = (orderId: string) => {
    alert(`QR Code generated for ${orderId}\n\nQR-${orderId}-${Date.now()}`);
  };

  const handleUploadTracking = () => {
    if (trackingNumber && courierName) {
      alert(`Tracking uploaded:\nCourier: ${courierName}\nTracking: ${trackingNumber}`);
      setTrackingNumber("");
      setCourierName("");
    }
  };

  return (
    <>
      <SEO title="Order Management - DropSync Vendor" />
      <DashboardLayout role="vendor">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Order Fulfillment
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Process orders and manage shipments
              </p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending Orders</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      {vendorOrders.filter((o) => o.status === "Pending").length}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Processing</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {vendorOrders.filter((o) => o.status === "Processing").length}
                    </p>
                  </div>
                  <Package className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Shipped Today</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {vendorOrders.filter((o) => o.status === "Shipped").length}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div
                          className={`w-3 h-3 rounded-full ${getPriorityColor(
                            order.priority
                          )}`}
                          title={order.priority}
                        ></div>
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {order.customer}
                      </TableCell>
                      <TableCell>{order.deadline}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!order.qrGenerated && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateQR(order.id)}
                            >
                              <QrCode className="w-4 h-4 mr-1" />
                              Generate QR
                            </Button>
                          )}
                          {order.qrGenerated && order.status !== "Shipped" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="bg-cyan-500 hover:bg-cyan-600"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Upload className="w-4 h-4 mr-1" />
                                  Upload Tracking
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Upload Tracking Details</DialogTitle>
                                  <DialogDescription>
                                    Enter shipment tracking information for {order.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Courier/Logistics Partner</Label>
                                    <Select
                                      value={courierName}
                                      onValueChange={setCourierName}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select courier" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="BlueDart">BlueDart</SelectItem>
                                        <SelectItem value="Delhivery">Delhivery</SelectItem>
                                        <SelectItem value="FedEx">FedEx</SelectItem>
                                        <SelectItem value="DHL">DHL</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Tracking Number</Label>
                                    <Input
                                      placeholder="Enter tracking number"
                                      value={trackingNumber}
                                      onChange={(e) => setTrackingNumber(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={handleUploadTracking}
                                    className="bg-cyan-500 hover:bg-cyan-600"
                                  >
                                    Submit Tracking
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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
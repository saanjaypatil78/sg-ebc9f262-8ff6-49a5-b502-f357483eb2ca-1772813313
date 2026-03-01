import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Search, Upload, AlertCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

const returns = [
  {
    id: "RET-001",
    orderId: "ORD-001",
    product: "Wireless Headphones",
    reason: "Defective product",
    status: "Approved",
    requestDate: "2026-02-28",
    replacementStatus: "Shipped",
    replacementTracking: "TRK-REP-789"
  },
  {
    id: "RET-002",
    orderId: "ORD-005",
    product: "Laptop Stand",
    reason: "Wrong item received",
    status: "Processing",
    requestDate: "2026-02-27",
    replacementStatus: "Pending",
    replacementTracking: null
  },
  {
    id: "RET-003",
    orderId: "ORD-003",
    product: "Phone Case",
    reason: "Product damaged in transit",
    status: "Pending Review",
    requestDate: "2026-02-26",
    replacementStatus: "Not Started",
    replacementTracking: null
  }
];

export default function ClientReturns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [returnReason, setReturnReason] = useState("");

  const filteredReturns = returns.filter(
    (ret) =>
      ret.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "Processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "Pending Review":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const handleSubmitReturn = () => {
    if (selectedOrder && returnReason) {
      alert(`Return request submitted for ${selectedOrder}\nReason: ${returnReason}`);
      setSelectedOrder("");
      setReturnReason("");
    }
  };

  return (
    <>
      <SEO title="Returns & Replacements - DropSync" />
      <DashboardLayout role="client">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Returns & Replacements
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Request returns and track replacements
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Return Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Return Request</DialogTitle>
                  <DialogDescription>
                    Fill out the form to request a return
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Order ID</Label>
                    <Input
                      placeholder="Enter order ID (e.g., ORD-001)"
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reason for Return</Label>
                    <Textarea
                      placeholder="Describe the issue with your order"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Images (Optional)</Label>
                    <Input type="file" accept="image/*" multiple />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSubmitReturn}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Return Policy Notice */}
          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-400">
                    Return Policy
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                    • Free replacement for defective/wrong items (no additional charges)
                    <br />
                    • Returns approved within 24-48 hours
                    <br />
                    • Replacements shipped within 2-3 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by return ID or order ID..."
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
                    <TableHead>Return ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Replacement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReturns.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell className="font-medium">{ret.id}</TableCell>
                      <TableCell>{ret.orderId}</TableCell>
                      <TableCell>{ret.product}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {ret.reason}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ret.status)}>
                          {ret.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ret.replacementTracking ? (
                          <div className="space-y-1">
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              {ret.replacementStatus}
                            </Badge>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Track: {ret.replacementTracking}
                            </p>
                          </div>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                            {ret.replacementStatus}
                          </Badge>
                        )}
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
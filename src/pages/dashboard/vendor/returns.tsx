import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, AlertTriangle, CheckCircle, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const vendorReturns = [
  {
    id: "RET-V-001",
    orderId: "ORD-201",
    product: "Wireless Mouse",
    customer: "John Doe",
    reason: "Defective - Not charging",
    status: "Pending Replacement",
    returnDate: "2026-02-28",
    deadline: "2026-03-02"
  },
  {
    id: "RET-V-002",
    orderId: "ORD-198",
    product: "Keyboard",
    customer: "Sarah Miller",
    reason: "Wrong item - Ordered US layout, received UK",
    status: "Replacement Shipped",
    returnDate: "2026-02-26",
    deadline: "2026-02-29"
  }
];

const returnStats = {
  monthlyReturns: 8,
  totalOrders: 128,
  returnRate: 6.25,
  limit: 10,
  replacementsPending: 2,
  replacementsCompleted: 6
};

export default function VendorReturns() {
  const returnRateStatus = returnStats.returnRate <= returnStats.limit ? "good" : "warning";

  return (
    <>
      <SEO title="Returns Management - DropSync Vendor" />
      <DashboardLayout role="vendor">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Returns & Replacements
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage product returns and fulfill replacements
            </p>
          </div>

          {/* Return Rate Monitoring */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={`border-l-4 ${returnRateStatus === "good" ? "border-l-green-500" : "border-l-red-500"}`}>
              <CardHeader>
                <CardTitle>Monthly Return Rate</CardTitle>
                <CardDescription>Maximum allowed: {returnStats.limit}%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {returnStats.returnRate}%
                    </span>
                    {returnRateStatus === "good" ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                  <Progress value={returnStats.returnRate * 10} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      {returnStats.monthlyReturns} returns / {returnStats.totalOrders} orders
                    </span>
                    <span className={returnRateStatus === "good" ? "text-green-600" : "text-red-600"}>
                      {returnRateStatus === "good" ? "Within Limit" : "Exceeds Limit"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Replacement Status</CardTitle>
                <CardDescription>Free replacements (no commission)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">
                      {returnStats.replacementsPending}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {returnStats.replacementsCompleted}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-400">
                    Return Policy Reminder
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                    • Replacements are mandatory and must be shipped within 2 business days
                    <br />
                    • No commission is charged on replacement products
                    <br />
                    • Return rate exceeding 10% may result in penalties or account suspension
                    <br />
                    • All replacements must include QR codes and proper packaging
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Returns */}
          <Card>
            <CardHeader>
              <CardTitle>Active Return Requests</CardTitle>
              <CardDescription>Returns requiring action</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorReturns.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell className="font-medium">{ret.id}</TableCell>
                      <TableCell>{ret.orderId}</TableCell>
                      <TableCell>{ret.product}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {ret.customer}
                      </TableCell>
                      <TableCell className="text-sm">{ret.reason}</TableCell>
                      <TableCell className="text-sm">{ret.deadline}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ret.status === "Replacement Shipped"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                          }
                        >
                          {ret.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ret.status === "Pending Replacement" && (
                          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Process
                          </Button>
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
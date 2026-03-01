import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, TrendingUp, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const settlements = [
  {
    vendorId: "VEN-001",
    vendorName: "Premium Goods",
    period: "Feb 2026",
    grossSales: 24500,
    commission: 3675,
    returns: 1029,
    replacements: 450,
    penalties: 0,
    netPayout: 19346,
    status: "Processed",
    processDate: "2026-03-01"
  },
  {
    vendorId: "VEN-002",
    vendorName: "TechSupplies Co",
    period: "Feb 2026",
    grossSales: 15600,
    commission: 2340,
    returns: 1326,
    replacements: 780,
    penalties: 125,
    netPayout: 11029,
    status: "Pending",
    processDate: null
  },
  {
    vendorId: "VEN-003",
    vendorName: "FastTrack Inc",
    period: "Feb 2026",
    grossSales: 19800,
    commission: 2970,
    returns: 1544,
    replacements: 620,
    penalties: 0,
    netPayout: 14666,
    status: "Pending",
    processDate: null
  }
];

export default function AdminSettlements() {
  return (
    <>
      <SEO title="Financial Settlements - DropSync Admin" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Vendor Settlements
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Process payments and manage vendor payouts
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                Process Pending
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Payouts</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                      ${settlements.reduce((acc, s) => acc + s.netPayout, 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Commission</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      ${settlements.reduce((acc, s) => acc + s.commission, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Penalties</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      ${settlements.reduce((acc, s) => acc + s.penalties, 0).toLocaleString()}
                    </p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                      {settlements.filter((s) => s.status === "Pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settlement Formula */}
          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-400">
                Settlement Calculation Formula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm text-blue-800 dark:text-blue-300">
                <p className="mb-2">
                  <strong>Net Payout</strong> = Gross Sales - Platform Commission - Return Deductions - Penalties
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-4">
                  Notes:
                  <br />
                  • Commission: 15% of gross sales (configurable per vendor)
                  <br />
                  • Replacements: No commission charged on replacement products
                  <br />
                  • Penalties: Applied for SLA breaches (on-time delivery &lt;90%, return rate &gt;10%)
                  <br />
                  • Returns: Cost of returned items deducted from gross sales
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settlements Table */}
          <Card>
            <CardHeader>
              <CardTitle>Settlement Records</CardTitle>
              <CardDescription>Monthly vendor payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Gross Sales</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Returns</TableHead>
                    <TableHead>Replacements</TableHead>
                    <TableHead>Penalties</TableHead>
                    <TableHead>Net Payout</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement) => (
                    <TableRow key={settlement.vendorId}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {settlement.vendorName}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {settlement.vendorId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{settlement.period}</TableCell>
                      <TableCell className="font-medium">
                        ${settlement.grossSales.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -${settlement.commission.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        -${settlement.returns.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-blue-600">
                        ${settlement.replacements.toLocaleString()}
                        <br />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          (No commission)
                        </span>
                      </TableCell>
                      <TableCell className="text-red-600">
                        {settlement.penalties > 0 ? `-$${settlement.penalties}` : "$0"}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        ${settlement.netPayout.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            settlement.status === "Processed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                          }
                        >
                          {settlement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Invoice
                        </Button>
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
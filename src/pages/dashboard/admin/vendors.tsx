import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Ban, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const vendors = [
  {
    id: "VEN-001",
    name: "Premium Goods",
    email: "contact@premiumgoods.com",
    status: "Active",
    onboardDate: "2026-01-15",
    orders: 245,
    onTimeRate: 96,
    returnRate: 4.2,
    score: 94,
    slaCompliant: true
  },
  {
    id: "VEN-002",
    name: "TechSupplies Co",
    email: "support@techsupplies.com",
    status: "Warning",
    onboardDate: "2026-01-20",
    orders: 156,
    onTimeRate: 87,
    returnRate: 8.5,
    score: 78,
    slaCompliant: false
  },
  {
    id: "VEN-003",
    name: "FastTrack Inc",
    email: "hello@fasttrack.com",
    status: "Active",
    onboardDate: "2026-02-01",
    orders: 198,
    onTimeRate: 93,
    returnRate: 7.8,
    score: 88,
    slaCompliant: true
  },
  {
    id: "VEN-004",
    name: "QuickShip Ltd",
    email: "info@quickship.com",
    status: "Suspended",
    onboardDate: "2025-12-10",
    orders: 89,
    onTimeRate: 82,
    returnRate: 12.3,
    score: 65,
    slaCompliant: false
  }
];

export default function AdminVendors() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "Warning":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      case "Suspended":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <>
      <SEO title="Vendor Management - DropSync Admin" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Vendor Management
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Monitor and manage all platform vendors
              </p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              Approve Pending
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active Vendors</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {vendors.filter((v) => v.status === "Active").length}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Warnings</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      {vendors.filter((v) => v.status === "Warning").length}
                    </p>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Suspended</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      {vendors.filter((v) => v.status === "Suspended").length}
                    </p>
                  </div>
                  <Ban className="w-12 h-12 text-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Avg Score</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                      {Math.round(vendors.reduce((acc, v) => acc + v.score, 0) / vendors.length)}
                    </p>
                  </div>
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
                    placeholder="Search vendors..."
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
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>On-Time %</TableHead>
                    <TableHead>Return %</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {vendor.name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {vendor.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.orders}</TableCell>
                      <TableCell>
                        <span
                          className={
                            vendor.onTimeRate >= 90
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {vendor.onTimeRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            vendor.returnRate <= 10
                              ? "text-blue-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {vendor.returnRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${getScoreColor(vendor.score)}`}>
                          {vendor.score}
                        </span>
                      </TableCell>
                      <TableCell>
                        {vendor.slaCompliant ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vendor.status)}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
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
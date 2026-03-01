import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, TrendingUp, AlertTriangle, DollarSign, CheckCircle } from "lucide-react";

const vendorAlerts = [
  { vendor: "TechSupplies Co", issue: "SLA below 90%", severity: "High", metric: "87% on-time" },
  { vendor: "QuickShip Ltd", issue: "Return rate exceeded", severity: "Medium", metric: "11.2% returns" },
  { vendor: "FastTrack Inc", issue: "Missing QR codes", severity: "Low", metric: "3 orders" }
];

const stats = [
  { label: "Active Vendors", value: "48", icon: Users, color: "text-blue-600", change: "+5 this month" },
  { label: "Total Orders", value: "1,284", icon: Package, color: "text-green-600", change: "+12% vs last month" },
  { label: "Platform GMV", value: "$124.5K", icon: DollarSign, color: "text-purple-600", change: "+18% growth" },
  { label: "Avg. On-Time Rate", value: "92.4%", icon: TrendingUp, color: "text-cyan-600", change: "Above target" }
];

const topVendors = [
  { name: "Premium Goods", orders: 245, onTime: "96%", returns: "4.2%", status: "Excellent" },
  { name: "FastTrack Inc", orders: 198, onTime: "93%", returns: "7.8%", status: "Good" },
  { name: "TechSupplies Co", orders: 156, onTime: "87%", returns: "8.5%", status: "Warning" }
];

export default function AdminDashboard() {
  return (
    <>
      <SEO title="Admin Dashboard - DropSync" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Overview</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor vendors and enforce SLA compliance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </CardTitle>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alerts */}
          <Card className="border-orange-200 dark:border-orange-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-orange-900 dark:text-orange-400">Vendor Alerts</CardTitle>
              </div>
              <CardDescription>Issues requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vendorAlerts.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{alert.vendor}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{alert.issue} • {alert.metric}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.severity === "High" ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                        alert.severity === "Medium" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}>
                        {alert.severity}
                      </span>
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Vendors */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Leaderboard</CardTitle>
              <CardDescription>Top performing vendors this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVendors.map((vendor, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{vendor.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{vendor.orders} orders completed</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">On-Time</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.onTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Returns</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.returns}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vendor.status === "Excellent" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                      vendor.status === "Good" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                      "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                    }`}>
                      {vendor.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
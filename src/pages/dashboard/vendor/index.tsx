import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, AlertCircle, CheckCircle, QrCode, Upload, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

const pendingOrders = [
  { id: "ORD-105", product: "Wireless Mouse", customer: "John D.", deadline: "2026-03-02", priority: "High" },
  { id: "ORD-106", product: "Keyboard", customer: "Sarah M.", deadline: "2026-03-02", priority: "Medium" },
  { id: "ORD-107", product: "Monitor Stand", customer: "Mike R.", deadline: "2026-03-03", priority: "Low" }
];

const stats = [
  { label: "Pending Orders", value: "12", icon: Package, color: "text-orange-600", change: "+3 today" },
  { label: "On-Time Delivery", value: "94%", icon: TrendingUp, color: "text-green-600", change: "Above target" },
  { label: "Return Rate", value: "6.2%", icon: CheckCircle, color: "text-blue-600", change: "Within limit" },
  { label: "QR Compliance", value: "100%", icon: QrCode, color: "text-purple-600", change: "Perfect" }
];

export default function VendorDashboard() {
  const router = useRouter();
  return (
    <>
      <SEO title="Vendor Dashboard - DropSync" />
      <DashboardLayout role="vendor">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Vendor Portal</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Manage orders and track performance</p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Reports
            </Button>
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

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SLA Compliance</CardTitle>
                <CardDescription>90% minimum required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">On-Time Delivery</span>
                    <span className="text-sm font-bold text-green-600">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Packaging Quality</span>
                    <span className="text-sm font-bold text-blue-600">97%</span>
                  </div>
                  <Progress value={97} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">QR Compliance</span>
                    <span className="text-sm font-bold text-purple-600">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Management</CardTitle>
                <CardDescription>10% maximum allowed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Return Rate</span>
                    <span className="text-2xl font-bold text-blue-600">6.2%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Within acceptable range</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Pending Replacements</span>
                      <span className="font-medium text-slate-900 dark:text-white">3 items</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Fulfillment</CardTitle>
                  <CardDescription>Orders requiring immediate action</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        order.priority === "High" ? "bg-red-500" :
                        order.priority === "Medium" ? "bg-orange-500" : "bg-green-500"
                      }`}></div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{order.id}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{order.product} • {order.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Due by</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{order.deadline}</p>
                      </div>
                      <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                        <QrCode className="w-4 h-4 mr-2" />
                        Print QR
                      </Button>
                    </div>
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
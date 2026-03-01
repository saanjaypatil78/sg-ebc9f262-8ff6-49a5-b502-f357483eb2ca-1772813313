import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Clock, RefreshCw, Eye } from "lucide-react";
import Link from "next/link";

const recentOrders = [
  { id: "ORD-001", product: "Wireless Headphones", status: "Delivered", date: "2026-02-28", amount: "$89.99" },
  { id: "ORD-002", product: "Smart Watch", status: "In Transit", date: "2026-02-27", amount: "$199.99" },
  { id: "ORD-003", product: "Phone Case", status: "Processing", date: "2026-02-26", amount: "$24.99" },
  { id: "ORD-004", product: "USB-C Cable", status: "Delivered", date: "2026-02-25", amount: "$12.99" }
];

const stats = [
  { label: "Total Orders", value: "24", icon: Package, color: "text-blue-600" },
  { label: "In Transit", value: "3", icon: Clock, color: "text-orange-600" },
  { label: "Delivered", value: "20", icon: TrendingUp, color: "text-green-600" },
  { label: "Returns", value: "1", icon: RefreshCw, color: "text-red-600" }
];

export default function ClientDashboard() {
  return (
    <>
      <SEO title="Client Dashboard - DropSync" />
      <DashboardLayout role="client">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back!</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Track your orders and manage returns</p>
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
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchases and their status</CardDescription>
                </div>
                <Link href="/dashboard/client/orders">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{order.product}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{order.id} • {order.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-white">{order.amount}</p>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          order.status === "Delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                          order.status === "In Transit" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                          "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
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
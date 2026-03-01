import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, DollarSign, Users, RotateCcw } from "lucide-react";

const platformMetrics = {
  totalOrders: 1247,
  orderGrowth: 12.5,
  totalRevenue: 156780,
  revenueGrowth: 8.3,
  activeVendors: 24,
  vendorGrowth: 15.2,
  avgReturnRate: 7.2,
  returnTrend: -2.1
};

const categoryPerformance = [
  { name: "Electronics", orders: 456, revenue: 68450, returns: 6.8 },
  { name: "Apparel", orders: 342, revenue: 38920, returns: 9.2 },
  { name: "Home & Living", orders: 289, revenue: 32150, returns: 5.4 },
  { name: "Books & Media", orders: 160, revenue: 17260, returns: 3.1 }
];

const topVendors = [
  { name: "Premium Goods", orders: 245, revenue: 45600, onTime: 96, score: 94 },
  { name: "FastTrack Inc", orders: 198, revenue: 38900, onTime: 93, score: 88 },
  { name: "TechSupplies Co", orders: 156, revenue: 28450, onTime: 87, score: 78 }
];

export default function AdminAnalytics() {
  return (
    <>
      <SEO title="Platform Analytics - DropSync Admin" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Platform Analytics
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive business intelligence and performance insights
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                  <Package className="w-8 h-8 text-blue-600 opacity-20" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {platformMetrics.totalOrders.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    +{platformMetrics.orderGrowth}%
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
                  <DollarSign className="w-8 h-8 text-green-600 opacity-20" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  ${platformMetrics.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    +{platformMetrics.revenueGrowth}%
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Vendors</p>
                  <Users className="w-8 h-8 text-purple-600 opacity-20" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {platformMetrics.activeVendors}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    +{platformMetrics.vendorGrowth}%
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Return Rate</p>
                  <RotateCcw className="w-8 h-8 text-orange-600 opacity-20" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {platformMetrics.avgReturnRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {platformMetrics.returnTrend}%
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">improvement</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Sales breakdown by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformance.map((category, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {category.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {category.orders} orders
                      </p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Revenue</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          ${category.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Return Rate</p>
                        <p
                          className={`text-lg font-bold ${
                            category.returns <= 10 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {category.returns}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Vendors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
              <CardDescription>Best vendors by order volume and quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVendors.map((vendor, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {vendor.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {vendor.orders} orders • ${vendor.revenue.toLocaleString()} revenue
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">On-Time</p>
                        <p className="text-lg font-bold text-green-600">{vendor.onTime}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Score</p>
                        <p className="text-lg font-bold text-blue-600">{vendor.score}</p>
                      </div>
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
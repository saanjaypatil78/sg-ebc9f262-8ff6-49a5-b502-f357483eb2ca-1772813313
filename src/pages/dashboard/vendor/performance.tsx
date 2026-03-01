import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Package, RotateCcw } from "lucide-react";

const performanceMetrics = {
  onTimeDelivery: 94,
  returnRate: 6.2,
  qrCompliance: 100,
  packagingQuality: 97,
  customerRating: 4.7,
  responseTime: 2.3
};

const monthlyData = [
  { month: "Feb", orders: 156, onTime: 92, returns: 7.8 },
  { month: "Jan", orders: 142, onTime: 89, returns: 8.5 },
  { month: "Dec", orders: 138, onTime: 91, returns: 7.2 },
  { month: "Nov", orders: 125, onTime: 88, returns: 9.1 }
];

const penalties = [
  { date: "2026-02-20", reason: "SLA breach (87% on-time)", amount: "$125" },
  { date: "2026-01-15", reason: "Missing QR codes (3 orders)", amount: "$75" }
];

export default function VendorPerformance() {
  return (
    <>
      <SEO title="Performance Metrics - DropSync Vendor" />
      <DashboardLayout role="vendor">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Performance Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track your SLA compliance and quality metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {performanceMetrics.onTimeDelivery}%
                </div>
                <Progress value={performanceMetrics.onTimeDelivery} className="h-2 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Target: 90% • Status: Compliant
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {performanceMetrics.returnRate}%
                </div>
                <Progress value={performanceMetrics.returnRate * 10} className="h-2 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Limit: 10% • Status: Within Range
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">QR Compliance</CardTitle>
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {performanceMetrics.qrCompliance}%
                </div>
                <Progress value={performanceMetrics.qrCompliance} className="h-2 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Target: 100% • Status: Perfect
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SLA Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance Details</CardTitle>
              <CardDescription>Breakdown of service level metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">On-Time Delivery Rate</span>
                    <span className="text-sm font-bold text-green-600">
                      {performanceMetrics.onTimeDelivery}%
                    </span>
                  </div>
                  <Progress value={performanceMetrics.onTimeDelivery} className="h-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Target: ≥90% | Current: Above Target
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Packaging Quality Score</span>
                    <span className="text-sm font-bold text-blue-600">
                      {performanceMetrics.packagingQuality}%
                    </span>
                  </div>
                  <Progress value={performanceMetrics.packagingQuality} className="h-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Based on customer feedback and admin audits
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">QR Code Compliance</span>
                    <span className="text-sm font-bold text-purple-600">
                      {performanceMetrics.qrCompliance}%
                    </span>
                  </div>
                  <Progress value={performanceMetrics.qrCompliance} className="h-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    All shipments include vendor-printed QR codes
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-sm font-bold text-cyan-600">
                      {performanceMetrics.responseTime}h
                    </span>
                  </div>
                  <Progress value={100 - performanceMetrics.responseTime * 10} className="h-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Time to respond to customer queries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance</CardTitle>
              <CardDescription>Last 4 months trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="w-16">
                      <p className="font-medium text-slate-900 dark:text-white">{data.month}</p>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Orders</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {data.orders}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">On-Time</p>
                        <p className={`text-lg font-bold ${data.onTime >= 90 ? "text-green-600" : "text-orange-600"}`}>
                          {data.onTime}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Returns</p>
                        <p className={`text-lg font-bold ${data.returns <= 10 ? "text-blue-600" : "text-red-600"}`}>
                          {data.returns}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Penalties */}
          {penalties.length > 0 && (
            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-orange-900 dark:text-orange-400">
                    Recent Penalties
                  </CardTitle>
                </div>
                <CardDescription>SLA violations and charges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {penalties.map((penalty, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {penalty.reason}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {penalty.date}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-orange-600">{penalty.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
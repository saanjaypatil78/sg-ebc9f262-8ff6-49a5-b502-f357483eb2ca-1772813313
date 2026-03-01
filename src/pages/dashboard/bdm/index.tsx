import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Clock, CheckCircle, UserPlus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const onboardingPipeline = [
  { vendor: "ElectroMart", stage: "Documentation", progress: 75, contact: "Sarah J.", deadline: "2026-03-05" },
  { vendor: "HomeGoods Pro", stage: "Integration", progress: 45, contact: "Mike R.", deadline: "2026-03-08" },
  { vendor: "Fashion Hub", stage: "Training", progress: 90, contact: "Lisa M.", deadline: "2026-03-03" }
];

const stats = [
  { label: "Active Vendors", value: "28", icon: Users, color: "text-blue-600", change: "+4 this month" },
  { label: "In Onboarding", value: "5", icon: Clock, color: "text-orange-600", change: "3 near completion" },
  { label: "Avg. Vendor Score", value: "91%", icon: TrendingUp, color: "text-green-600", change: "+3% vs last month" },
  { label: "Completed This Month", value: "7", icon: CheckCircle, color: "text-purple-600", change: "Above target" }
];

const recentVendors = [
  { name: "TechSupplies Co", joined: "2026-02-25", orders: 45, performance: "94%", status: "Active" },
  { name: "QuickShip Ltd", joined: "2026-02-20", orders: 67, performance: "89%", status: "Active" },
  { name: "Premium Goods", joined: "2026-02-15", orders: 92, performance: "96%", status: "Excellent" }
];

export default function BDMDashboard() {
  return (
    <>
      <SEO title="BDM Dashboard - DropSync" />
      <DashboardLayout role="bdm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">BDM Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Manage vendor relationships and onboarding</p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Vendor
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

          {/* Onboarding Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Pipeline</CardTitle>
              <CardDescription>Vendors in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingPipeline.map((item, i) => (
                  <div key={i} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.vendor}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Contact: {item.contact}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          {item.stage}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Due: {item.deadline}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-medium text-slate-900 dark:text-white">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Vendors */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Onboarded Vendors</CardTitle>
              <CardDescription>Performance of new vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVendors.map((vendor, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{vendor.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Joined {vendor.joined}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Orders</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{vendor.orders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Performance</p>
                        <p className="text-lg font-bold text-green-600">{vendor.performance}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
                      vendor.status === "Excellent" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
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
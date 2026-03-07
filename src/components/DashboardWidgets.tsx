import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
} from "lucide-react";

export function DashboardWidgets() {
  // Recent Activity Widget
  const activities = [
    {
      id: 1,
      action: "Payout Received",
      amount: "₹1,50,000",
      time: "5 minutes ago",
      type: "credit",
      icon: DollarSign,
    },
    {
      id: 2,
      action: "New Referral",
      amount: "John Smith (L2)",
      time: "1 hour ago",
      type: "info",
      icon: Users,
    },
    {
      id: 3,
      action: "Investment Growth",
      amount: "+15.5%",
      time: "2 hours ago",
      type: "success",
      icon: TrendingUp,
    },
  ];

  // Performance Metrics Widget
  const metrics = [
    {
      label: "ROI Progress",
      value: 203.6,
      target: 250,
      color: "bg-green-500",
    },
    {
      label: "Network Growth",
      value: 24,
      target: 50,
      color: "bg-cyan-500",
    },
    {
      label: "Monthly Target",
      value: 150000,
      target: 200000,
      color: "bg-orange-500",
    },
  ];

  // Quick Actions Widget
  const quickActions = [
    { label: "New Investment", icon: DollarSign, href: "/invest" },
    { label: "View Network", icon: Users, href: "/dashboard/investor/network" },
    { label: "Track Payouts", icon: Activity, href: "/dashboard/investor" },
    { label: "Settings", icon: Target, href: "/dashboard/profile" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity Widget */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Recent Activity
          </h3>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors"
            >
              <div
                className={`p-2 rounded-lg ${
                  activity.type === "credit"
                    ? "bg-green-500/20"
                    : activity.type === "success"
                    ? "bg-cyan-500/20"
                    : "bg-orange-500/20"
                }`}
              >
                <activity.icon
                  className={`w-5 h-5 ${
                    activity.type === "credit"
                      ? "text-green-400"
                      : activity.type === "success"
                      ? "text-cyan-400"
                      : "text-orange-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{activity.action}</div>
                <div className="text-xs text-slate-400">{activity.time}</div>
              </div>
              <div className="font-semibold text-white text-sm">{activity.amount}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Performance Metrics Widget */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Performance Metrics
          </h3>
          <Badge className="bg-green-500/20 text-green-400">On Track</Badge>
        </div>

        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const percentage = (metric.value / metric.target) * 100;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{metric.label}</span>
                  <span className="text-sm font-semibold text-white">
                    {typeof metric.value === "number" && metric.value > 1000
                      ? `₹${(metric.value / 1000).toFixed(0)}K`
                      : metric.value}
                    {" / "}
                    {typeof metric.target === "number" && metric.target > 1000
                      ? `₹${(metric.target / 1000).toFixed(0)}K`
                      : metric.target}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">{percentage.toFixed(1)}% Complete</span>
                  {percentage >= 80 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions Widget */}
      <Card className="bg-slate-800/50 border-slate-700 p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={index}
              href={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                  <action.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </Card>
    </div>
  );
}
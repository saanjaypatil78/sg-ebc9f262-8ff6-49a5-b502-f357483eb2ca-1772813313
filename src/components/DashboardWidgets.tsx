"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Award, Target } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}

interface DashboardWidgetsProps {
  metrics?: Record<string, number>;
}

function MetricCard({ title, value, change, trend, icon: Icon }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-orange-500/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Icon className="w-6 h-6 text-orange-400" />
          </div>
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export function DashboardWidgets({ metrics: customMetrics }: DashboardWidgetsProps) {
  const defaultMetrics = [
    { title: "Total Investment", value: "₹2.5 Cr", change: "+12.5%", trend: "up" as const, icon: DollarSign },
    { title: "Monthly Returns", value: "₹37.5 L", change: "+15%", trend: "up" as const, icon: TrendingUp },
    { title: "Active Referrals", value: "28", change: "+8", trend: "up" as const, icon: Users },
    { title: "Current Rank", value: "Gold", change: "↑ 1", trend: "up" as const, icon: Award },
  ];

  // Map custom metrics to default structure if provided
  const metrics = customMetrics ? [
    { title: "Total Revenue", value: `₹${(customMetrics.totalRevenue || 0).toLocaleString()}`, change: "+12.5%", trend: "up" as const, icon: DollarSign },
    { title: "Total Orders", value: (customMetrics.totalOrders || 0).toLocaleString(), change: "+5%", trend: "up" as const, icon: TrendingUp },
    { title: "Active Users", value: ((customMetrics.activeVendors || 0) + (customMetrics.activeInvestors || 0)).toLocaleString(), change: "+8", trend: "up" as const, icon: Users },
    { title: "Pending", value: (customMetrics.pendingSettlements || 0).toLocaleString(), change: "-2", trend: "down" as const, icon: Target },
  ] : defaultMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
}
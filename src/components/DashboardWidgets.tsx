"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, gradient, iconColor }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${gradient} backdrop-blur-xl border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400" />
            )}
            <span className={isPositive ? "text-green-400" : "text-red-400"}>
              {isPositive ? "+" : ""}{change}%
            </span>
            <span className="text-slate-400 ml-1">{changeLabel || "vs last month"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardWidgetsProps {
  metrics: {
    totalRevenue?: number;
    totalOrders?: number;
    activeVendors?: number;
    totalInvestments?: number;
    totalCommissions?: number;
    pendingSettlements?: number;
  };
}

export function DashboardWidgets({ metrics }: DashboardWidgetsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {metrics.totalRevenue !== undefined && (
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total Revenue"
            value={`₹${(metrics.totalRevenue / 100000).toFixed(2)}L`}
            change={12.5}
            icon={DollarSign}
            gradient="from-green-500/20 to-emerald-500/20"
            iconColor="text-green-400"
          />
        </motion.div>
      )}

      {metrics.totalOrders !== undefined && (
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            change={8.2}
            icon={ShoppingCart}
            gradient="from-blue-500/20 to-cyan-500/20"
            iconColor="text-cyan-400"
          />
        </motion.div>
      )}

      {metrics.activeVendors !== undefined && (
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Active Vendors"
            value={metrics.activeVendors}
            change={5.1}
            icon={Package}
            gradient="from-purple-500/20 to-pink-500/20"
            iconColor="text-purple-400"
          />
        </motion.div>
      )}

      {metrics.totalInvestments !== undefined && (
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total Investments"
            value={`₹${(metrics.totalInvestments / 10000000).toFixed(2)}Cr`}
            change={15.3}
            icon={TrendingUp}
            gradient="from-orange-500/20 to-amber-500/20"
            iconColor="text-orange-400"
          />
        </motion.div>
      )}

      {metrics.totalCommissions !== undefined && (
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total Commissions"
            value={`₹${(metrics.totalCommissions / 100000).toFixed(2)}L`}
            change={22.8}
            icon={Users}
            gradient="from-cyan-500/20 to-blue-500/20"
            iconColor="text-cyan-400"
          />
        </motion.div>
      )}

      {metrics.pendingSettlements !== undefined && (
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Pending Settlements"
            value={metrics.pendingSettlements}
            change={-3.5}
            icon={Package}
            gradient="from-yellow-500/20 to-orange-500/20"
            iconColor="text-yellow-400"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
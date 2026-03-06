import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CommissionReports } from "@/components/CommissionReports";

export default function AdminDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    role: "all",
    dateFrom: undefined,
    dateTo: undefined,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
  };

  // Mock metrics for the dashboard
  const metrics = {
    totalRevenue: 12500000,
    totalOrders: 1245,
    activeVendors: 48,
    totalInvestments: 120000000,
    totalCommissions: 5000000,
    pendingSettlements: 12
  };

  return (
    <>
      <SEO title="Admin Dashboard | Brave Ecom" />
      <DashboardLayout role="admin">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-orange-900/20 backdrop-blur-xl border border-white/10 p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-orange-500/10 animate-pulse" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
                <span className="text-sm font-semibold text-orange-400">System Overview</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-orange-200 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-slate-400 mt-2">
                Monitor platform performance, commissions, and system health.
              </p>
            </div>
          </motion.div>

          {/* Widgets Grid */}
          <DashboardWidgets metrics={metrics} />

          {/* Filters */}
          <DashboardFilters 
            onFilterChange={handleFilterChange}
            showDateRange={true}
            showStatus={true}
            showRole={true}
            showSearch={true}
          />

          {/* Reports Section */}
          <div className="grid gap-6">
            <CommissionReports />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
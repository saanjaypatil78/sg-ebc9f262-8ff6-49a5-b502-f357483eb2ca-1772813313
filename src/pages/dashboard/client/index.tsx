import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { motion } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";

export default function ClientDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log("Client filters updated:", newFilters);
  };

  const metrics = {
    totalOrders: 24,
    totalRevenue: 185000,
    pendingSettlements: 2,
  };

  return (
    <>
      <SEO title="Client Dashboard - Brave Ecom" />
      <DashboardLayout role="client">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/20 via-slate-900/40 to-emerald-900/20 backdrop-blur-xl border border-white/10 p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10 animate-pulse" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-400">Shopping Portal</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
                    My Dashboard
                  </h1>
                  <p className="text-slate-400 mt-2">
                    Track your orders and manage your account
                  </p>
                </div>
                <ExportTools data={[]} filename="my-orders" />
              </div>
            </div>
          </motion.div>

          {/* Widgets Grid */}
          <DashboardWidgets metrics={metrics} />

          {/* Filters */}
          <DashboardFilters
            onFilterChange={handleFilterChange}
            showSearch={true}
            showDateRange={true}
            showStatus={true}
            showRole={false}
          />
        </div>
      </DashboardLayout>
    </>
  );
}
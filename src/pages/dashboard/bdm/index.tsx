import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { motion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";

export default function BDMDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log("BDM filters updated:", newFilters);
  };

  const metrics = {
    activeVendors: 45,
    totalOrders: 1240,
    totalRevenue: 8500000,
  };

  return (
    <>
      <SEO title="BDM Dashboard - Brave Ecom" />
      <DashboardLayout role="bdm">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 via-slate-900/40 to-cyan-900/20 backdrop-blur-xl border border-white/10 p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 animate-pulse" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-400">Business Development</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                    BDM Dashboard
                  </h1>
                  <p className="text-slate-400 mt-2">
                    Manage vendor pipeline and track performance
                  </p>
                </div>
                <ExportTools data={[]} filename="bdm-report" />
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
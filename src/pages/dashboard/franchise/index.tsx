import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

export default function FranchiseDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log("Franchise filters updated:", newFilters);
  };

  const metrics = {
    totalRevenue: 850000,
    totalOrders: 342,
    activeVendors: 23,
  };

  return (
    <>
      <SEO title="Franchise Dashboard - Brave Ecom" />
      <DashboardLayout role="franchise_partner">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/20 via-slate-900/40 to-orange-900/20 backdrop-blur-xl border border-white/10 p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10 animate-pulse" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-orange-400 animate-pulse" />
                <span className="text-sm font-semibold text-orange-400">Territory Management</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
                    Franchise Overview
                  </h1>
                  <p className="text-slate-400 mt-2">
                    Manage your franchise operations and earnings
                  </p>
                </div>
                <ExportTools data={[]} filename="franchise-report" />
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
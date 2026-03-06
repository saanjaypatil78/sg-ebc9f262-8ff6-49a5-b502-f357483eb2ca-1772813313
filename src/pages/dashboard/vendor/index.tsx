import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRGenerator } from "@/components/QRGenerator";

export default function VendorDashboard() {
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

  // Mock metrics for vendor
  const metrics = {
    totalRevenue: 450000,
    totalOrders: 85,
    pendingSettlements: 4
  };

  return (
    <>
      <SEO title="Vendor Dashboard | Brave Ecom" />
      <DashboardLayout role="vendor">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-pink-900/20 backdrop-blur-xl border border-white/10 p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 animate-pulse" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-pink-400 animate-pulse" />
                <span className="text-sm font-semibold text-pink-400">Vendor Portal</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Vendor Dashboard
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your products, orders, and settlements.
              </p>
            </div>
          </motion.div>

          {/* Widgets Grid */}
          <DashboardWidgets metrics={metrics} />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Filters */}
              <DashboardFilters 
                onFilterChange={handleFilterChange}
                showDateRange={true}
                showStatus={true}
                showRole={false}
                showSearch={true}
              />

              {/* Recent Orders Placeholder */}
              <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-400">
                    No recent orders matching filters.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <QRGenerator />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
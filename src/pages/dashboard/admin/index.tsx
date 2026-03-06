import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";
import { 
  RevenueChart, 
  UserGrowthChart, 
  OrderStatusChart, 
  VendorPerformanceChart,
  StatsCard 
} from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { Users, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    console.log("Admin filters updated:", newFilters);
    // TODO: Fetch data with filters
  };

  return (
    <>
      <SEO title="Admin Dashboard - Brave Ecom" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Platform overview and analytics
              </p>
            </div>
            <ExportTools data={[]} filename="admin-report" />
          </div>

          {/* Filters */}
          <DashboardFilters
            config={{
              search: true,
              dateRange: true,
              status: true,
              role: true,
            }}
            onFilterChange={handleFilterChange}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value="1,234"
              change="+12.5%"
              trend="up"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Total Revenue"
              value="₹12.5 Cr"
              change="+8.2%"
              trend="up"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <StatsCard
              title="Active Orders"
              value="856"
              change="+5.1%"
              trend="up"
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <StatsCard
              title="Growth Rate"
              value="23.5%"
              change="+2.3%"
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <UserGrowthChart />
            <OrderStatusChart />
            <VendorPerformanceChart />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
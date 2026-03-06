import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";
import { StatsCard, RevenueChart, OrderStatusChart } from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { MapPin, DollarSign, TrendingUp, Users } from "lucide-react";

export default function FranchiseDashboard() {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    console.log("Franchise filters updated:", newFilters);
    // TODO: Fetch data with filters
  };

  return (
    <>
      <SEO title="Franchise Dashboard - Brave Ecom" />
      <DashboardLayout role="franchise_partner">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Franchise Overview</h1>
              <p className="text-muted-foreground mt-1">
                Manage your franchise operations and earnings
              </p>
            </div>
            <ExportTools data={[]} filename="franchise-report" />
          </div>

          {/* Filters */}
          <DashboardFilters
            config={{
              search: true,
              dateRange: true,
              status: true,
            }}
            onFilterChange={handleFilterChange}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Earnings"
              value="₹8.5 L"
              change="+12.5%"
              trend="up"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <StatsCard
              title="Active Customers"
              value="342"
              change="+28 this month"
              trend="up"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Territory Growth"
              value="23.5%"
              change="+5.2%"
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatsCard
              title="Location"
              value="NAVI MUMBAI"
              icon={<MapPin className="h-5 w-5" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              title="Monthly Earnings" 
              description="Franchise revenue trends"
            />
            <OrderStatusChart 
              title="Territory Performance" 
              description="Customer acquisition and retention"
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
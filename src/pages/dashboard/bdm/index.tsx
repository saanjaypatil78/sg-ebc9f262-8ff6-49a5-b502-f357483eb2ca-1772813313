import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";
import { 
  StatsCard, 
  UserGrowthChart, 
  VendorPerformanceChart 
} from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { Users, TrendingUp, Target, Award } from "lucide-react";

export default function BDMDashboard() {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    console.log("BDM filters updated:", newFilters);
    // TODO: Fetch data with filters
  };

  return (
    <>
      <SEO title="BDM Dashboard - Brave Ecom" />
      <DashboardLayout role="bdm">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">BDM Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage vendor pipeline and track performance
              </p>
            </div>
            <ExportTools data={[]} filename="bdm-report" />
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
              title="Active Vendors"
              value="45"
              change="+8 this month"
              trend="up"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Onboarding Pipeline"
              value="12"
              change="3 pending approval"
              icon={<Target className="h-5 w-5" />}
            />
            <StatsCard
              title="Conversion Rate"
              value="78.5%"
              change="+5.2%"
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatsCard
              title="Performance Score"
              value="92/100"
              change="Excellent"
              trend="up"
              icon={<Award className="h-5 w-5" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserGrowthChart 
              title="Vendor Acquisition" 
              description="Monthly vendor onboarding trends"
            />
            <VendorPerformanceChart 
              title="Top Performing Vendors" 
              description="Vendor sales leaderboard"
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
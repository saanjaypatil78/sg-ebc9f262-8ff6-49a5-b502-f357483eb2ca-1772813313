import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";
import { StatsCard, RevenueChart, UserGrowthChart } from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { DollarSign, TrendingUp, PieChart, Wallet } from "lucide-react";

export default function InvestorDashboard() {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    console.log("Investor filters updated:", newFilters);
    // TODO: Fetch data with filters
  };

  return (
    <>
      <SEO title="Investor Dashboard - Brave Ecom" />
      <DashboardLayout role="investor">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Investment Portfolio</h1>
              <p className="text-muted-foreground mt-1">
                Track your investments and returns
              </p>
            </div>
            <ExportTools data={[]} filename="portfolio-statement" />
          </div>

          {/* Filters */}
          <DashboardFilters
            config={{
              search: true,
              dateRange: true,
            }}
            onFilterChange={handleFilterChange}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Investment"
              value="₹1.5 Cr"
              change="Active"
              icon={<Wallet className="h-5 w-5" />}
            />
            <StatsCard
              title="Current Value"
              value="₹1.82 Cr"
              change="+21.3%"
              trend="up"
              icon={<PieChart className="h-5 w-5" />}
            />
            <StatsCard
              title="Monthly Returns"
              value="₹22.5 L"
              change="15% ROI"
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatsCard
              title="Total Profit"
              value="₹32 L"
              change="+18.7%"
              trend="up"
              icon={<DollarSign className="h-5 w-5" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              title="Investment Growth" 
              description="Portfolio value over time"
            />
            <UserGrowthChart 
              title="Returns Distribution" 
              description="Monthly returns breakdown"
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
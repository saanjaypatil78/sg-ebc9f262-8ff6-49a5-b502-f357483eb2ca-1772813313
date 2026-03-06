import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";
import { 
  StatsCard, 
  RevenueChart, 
  OrderStatusChart, 
  VendorPerformanceChart 
} from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { DollarSign, Package, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VendorDashboard() {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    role: "all",
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    console.log("Vendor filters updated:", newFilters);
    // TODO: Fetch data with filters
  };

  return (
    <>
      <SEO title="Vendor Dashboard - Brave Ecom" />
      <DashboardLayout role="vendor">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Vendor Portal</h1>
              <p className="text-muted-foreground mt-1">
                Manage your products and fulfill orders
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/vendor/verification">
                <Button variant="outline" className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Complete KYC
                </Button>
              </Link>
              <ExportTools data={[]} filename="vendor-report" />
            </div>
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
              title="Total Revenue"
              value="₹2.4 Cr"
              change="+12.5%"
              trend="up"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <StatsCard
              title="Orders Fulfilled"
              value="1,234"
              change="+8.2%"
              trend="up"
              icon={<Package className="h-5 w-5" />}
            />
            <StatsCard
              title="On-Time Delivery"
              value="94.5%"
              change="+2.1%"
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatsCard
              title="Return Rate"
              value="4.2%"
              change="-0.8%"
              trend="up"
              icon={<AlertCircle className="h-5 w-5" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              title="Sales Performance" 
              description="Monthly revenue and order trends"
            />
            <OrderStatusChart 
              title="Order Fulfillment" 
              description="Current order status breakdown"
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
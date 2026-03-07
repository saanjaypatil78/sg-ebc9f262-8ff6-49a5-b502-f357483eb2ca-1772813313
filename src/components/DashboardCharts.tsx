import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { motion } from "framer-motion";

interface ChartData {
  label: string;
  value: number;
  change: number;
  icon: any;
  color: string;
}

export type DashboardRole = "investor" | "vendor" | "admin" | "bdm" | "client" | "franchise_partner";

interface DashboardChartsProps {
  role?: DashboardRole;
}

export function DashboardCharts({ role = "investor" }: DashboardChartsProps) {
  const getChartData = (): ChartData[] => {
    switch (role) {
      case "investor":
        return [
          {
            label: "Total Investment",
            value: 1000000,
            change: 15.5,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Monthly Return",
            value: 150000,
            change: 12.3,
            icon: TrendingUp,
            color: "from-cyan-500 to-blue-600",
          },
          {
            label: "Total Earnings",
            value: 1800000,
            change: 203.6,
            icon: TrendingUp,
            color: "from-orange-500 to-amber-600",
          },
          {
            label: "Network Size",
            value: 24,
            change: 8.7,
            icon: Users,
            color: "from-purple-500 to-pink-600",
          },
        ];

      case "vendor":
        return [
          {
            label: "Total Revenue",
            value: 2500000,
            change: 18.2,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Orders",
            value: 342,
            change: 12.5,
            icon: ShoppingCart,
            color: "from-cyan-500 to-blue-600",
          },
          {
            label: "Active Products",
            value: 28,
            change: 5.4,
            icon: Package,
            color: "from-orange-500 to-amber-600",
          },
          {
            label: "Conversion Rate",
            value: 3.2,
            change: 0.8,
            icon: TrendingUp,
            color: "from-purple-500 to-pink-600",
          },
        ];

      case "admin":
        return [
          {
            label: "Total Users",
            value: 1842,
            change: 15.3,
            icon: Users,
            color: "from-cyan-500 to-blue-600",
          },
          {
            label: "Total Revenue",
            value: 12000000,
            change: 22.1,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Active Vendors",
            value: 156,
            change: 8.9,
            icon: Package,
            color: "from-orange-500 to-amber-600",
          },
          {
            label: "Payouts Processed",
            value: 65190000,
            change: 18.7,
            icon: TrendingUp,
            color: "from-purple-500 to-pink-600",
          },
        ];

      case "bdm":
        return [
          {
            label: "Pipeline Value",
            value: 5200000,
            change: 24.5,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Active Vendors",
            value: 45,
            change: 12.8,
            icon: Users,
            color: "from-cyan-500 to-blue-600",
          },
          {
            label: "Conversion Rate",
            value: 68.5,
            change: 5.3,
            icon: TrendingUp,
            color: "from-orange-500 to-amber-600",
          },
          {
            label: "Avg Deal Size",
            value: 115000,
            change: 8.2,
            icon: Package,
            color: "from-purple-500 to-pink-600",
          },
        ];

      default:
        return [];
    }
  };

  const formatValue = (value: number, label: string): string => {
    if (label.includes("Rate") || label.includes("Conversion")) {
      return `${value.toFixed(1)}%`;
    }
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    if (value >= 1000) {
      return value.toLocaleString("en-IN");
    }
    return value.toString();
  };

  const chartData = getChartData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {chartData.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {item.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    item.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-slate-400">{item.label}</div>
              <div className="text-2xl font-bold text-white">
                {formatValue(item.value, item.label)}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
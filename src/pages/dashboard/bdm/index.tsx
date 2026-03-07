import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { ExportTools } from "@/components/ExportTools";
import { motion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";

export default function BDMDashboardPage() {
  return (
    <DashboardLayout showCharts={true} role="bdm">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">BDM Dashboard</h1>
          <p className="text-slate-400">
            Track your vendor pipeline and performance.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
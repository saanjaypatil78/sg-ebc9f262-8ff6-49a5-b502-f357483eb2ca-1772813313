import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CommissionReports } from "@/components/CommissionReports";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout showCharts={true} role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">
            Manage the entire platform ecosystem.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardFilters, FilterState } from "@/components/DashboardFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRGenerator } from "@/components/QRGenerator";

export default function VendorDashboardPage() {
  return (
    <DashboardLayout showCharts={true} role="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Vendor Dashboard</h1>
          <p className="text-slate-400">
            Track your product performance and sales.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
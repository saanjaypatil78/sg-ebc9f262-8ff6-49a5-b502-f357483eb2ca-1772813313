import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  TrendingUp, ArrowUpRight, DollarSign, Calendar, 
  PieChart, Download, AlertCircle, Shield, Smartphone,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function InvestorDashboardPage() {
  return (
    <DashboardLayout showCharts={true} role="investor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investor Dashboard</h1>
          <p className="text-slate-400">
            Welcome back! Here's your investment overview.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
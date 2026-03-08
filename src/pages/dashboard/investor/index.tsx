import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { RankProgressCard } from "@/components/RankProgressCard";
import { CommissionReports } from "@/components/CommissionReports";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function InvestorDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <SEO title="Investor Dashboard - Brave Ecom" />
      <DashboardLayout role="investor" showCharts={true}>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-slate-400">
              Track your investments, earnings, and network growth
            </p>
          </div>

          {/* Rank Progress Card */}
          {user && <RankProgressCard userId={user.id} />}

          {user && (
            <div className="flex items-center justify-end">
              <Link href="/dashboard/investor/rank">
                <Button variant="outline" className="border-slate-700 bg-slate-800/40 hover:bg-slate-800">
                  Open Rank Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {/* Commission & Wealth Distribution */}
          {user && (
            <CommissionReports 
              userId={user.id} 
              primaryInvestment={1000000} // ₹10 Lakhs - fetch from DB in production
            />
          )}

          {/* Rest of dashboard content */}
        </div>
      </DashboardLayout>
    </>
  );
}
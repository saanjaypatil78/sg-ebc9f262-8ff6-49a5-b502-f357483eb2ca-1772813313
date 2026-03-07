import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { RankProgressCard } from "@/components/RankProgressCard";

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

          {/* Rest of dashboard content */}
        </div>
      </DashboardLayout>
    </>
  );
}
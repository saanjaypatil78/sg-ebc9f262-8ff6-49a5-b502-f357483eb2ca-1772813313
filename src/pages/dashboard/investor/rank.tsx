import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { RankProgressCard } from "@/components/RankProgressCard";

export default function InvestorRankDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <SEO title="Rank Dashboard - Brave Ecom" />
      <DashboardLayout role="investor" showCharts={false}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Individual Rank Dashboard</h1>
            <p className="text-slate-400">
              Rank is evaluated using your team’s confirmed business volume in the last 3 consecutive months.
            </p>
          </div>

          {user ? (
            <RankProgressCard userId={user.id} variant="full" />
          ) : (
            <div className="rounded-lg border border-white/10 bg-slate-900/30 p-6 text-slate-300">
              Please login to view your rank dashboard.
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
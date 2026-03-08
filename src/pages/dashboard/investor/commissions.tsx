import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { CommissionsDashboard } from "@/components/CommissionsDashboard";

export default function InvestorCommissionsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <SEO title="Commissions & Referrals" />
      <DashboardLayout role="investor">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Commissions & Referrals</h1>
            <p className="text-slate-400">
              Track earnings, referral-level commissions, and compare performance across your visible network.
            </p>
          </div>

          <CommissionsDashboard />
        </div>
      </DashboardLayout>
    </>
  );
}
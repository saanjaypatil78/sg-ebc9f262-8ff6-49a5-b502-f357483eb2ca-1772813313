import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { AdminCommissionAuditPayouts } from "@/components/AdminCommissionAuditPayouts";

export default function AdminCommissionsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <SEO title="Commission Audit & Payouts" />
      <DashboardLayout role="admin">
        <AdminCommissionAuditPayouts />
      </DashboardLayout>
    </>
  );
}
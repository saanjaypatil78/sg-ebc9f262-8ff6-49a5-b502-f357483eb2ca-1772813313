import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SystemHealthWidget } from "@/components/SystemHealthWidget";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">System monitoring and management</p>
        </div>

        {/* System Health Monitor */}
        <SystemHealthWidget />

        {/* Other dashboard widgets can go here */}
      </div>
    </DashboardLayout>
  );
}
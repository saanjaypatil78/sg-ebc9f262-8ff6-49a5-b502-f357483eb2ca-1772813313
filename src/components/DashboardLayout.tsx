import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, Home, PieChart, Users, Settings, Briefcase, 
  ShoppingCart, Package, BarChart3, Bell, Shield, Key, History, User, Edit
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileEditor } from "@/components/ProfileEditor";
import { DashboardCharts } from "@/components/DashboardCharts";
import { MobileMenu } from "@/components/MobileMenu";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";

export type DashboardRole = "investor" | "vendor" | "admin" | "bdm" | "client" | "franchise_partner";

interface DashboardLayoutProps {
  children: ReactNode;
  showCharts?: boolean;
  role?: DashboardRole;
  metrics?: any;
}

export function DashboardLayout({ children, showCharts = false, role = "investor", metrics }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const getNavigation = () => {
    let baseNav = [];
    switch (role) {
      case "admin":
        baseNav = [
          { name: "Overview", href: "/dashboard/admin", icon: PieChart },
          { name: "Users", href: "/dashboard/admin/users", icon: Users },
          { name: "Vendors", href: "/dashboard/admin/vendors", icon: Briefcase },
          { name: "Settlements", href: "/dashboard/admin/settlements", icon: BarChart3 },
          { name: "Security Monitor", href: "/dashboard/admin/security", icon: Shield },
        ];
        break;
      case "vendor":
        baseNav = [
          { name: "Overview", href: "/dashboard/vendor", icon: Home },
          { name: "Orders", href: "/dashboard/vendor/orders", icon: ShoppingCart },
          { name: "Products", href: "/dashboard/vendor/uploads", icon: Package },
          { name: "Performance", href: "/dashboard/vendor/performance", icon: BarChart3 },
        ];
        break;
      default:
        baseNav = [
          { name: "Portfolio", href: "/dashboard/investor", icon: PieChart },
          { name: "New Investment", href: "/invest", icon: Briefcase },
        ];
    }

    // Combine base navigation with universal security/settings links
    return [
      ...baseNav,
      { name: "Active Sessions", href: "/dashboard/security/active-sessions", icon: Key },
      { name: "Login History", href: "/dashboard/security/login-history", icon: History },
      { name: "Trusted Devices", href: "/dashboard/security/trusted-devices", icon: Shield },
      { name: "Settings", href: "/dashboard/profile", icon: Settings },
    ];
  };

  const navItems = getNavigation();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="font-bold text-white text-xl leading-none">B</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:inline">Brave Ecom</span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <NotificationCenter />
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProfileEditorOpen(true)}
                className="hidden md:flex border-slate-700 bg-slate-800/50 hover:bg-slate-800"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex border-slate-700 bg-slate-800/50 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Charts */}
        {showCharts && (
          <div className="mb-8">
            <DashboardCharts role={role} />
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">{children}</div>
      </div>

      {/* Profile Editor Modal */}
      <ProfileEditor
        open={profileEditorOpen}
        onClose={() => setProfileEditorOpen(false)}
      />
    </div>
  );
}
import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { NotificationCenter } from "@/components/NotificationCenter";
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  RotateCcw,
  BarChart3,
  Upload,
  Users,
  Settings,
  DollarSign,
  TrendingUp,
  Menu,
  X,
  LogOut
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "client" | "vendor" | "admin" | "bdm";
}

const roleConfig = {
  client: {
    title: "Client Dashboard",
    nav: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/client" },
      { icon: Package, label: "My Orders", href: "/dashboard/client/orders" },
      { icon: RotateCcw, label: "Returns", href: "/dashboard/client/returns" },
      { icon: Settings, label: "Settings", href: "/dashboard/client/settings" }
    ]
  },
  vendor: {
    title: "Vendor Portal",
    nav: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/vendor" },
      { icon: Package, label: "Orders", href: "/dashboard/vendor/orders" },
      { icon: RotateCcw, label: "Returns", href: "/dashboard/vendor/returns" },
      { icon: BarChart3, label: "Performance", href: "/dashboard/vendor/performance" },
      { icon: Upload, label: "File Uploads", href: "/dashboard/vendor/uploads" },
      { icon: Settings, label: "Settings", href: "/dashboard/vendor/settings" }
    ]
  },
  admin: {
    title: "Admin Control Panel",
    nav: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
      { icon: Users, label: "User Management", href: "/dashboard/admin/users" },
      { icon: Users, label: "Vendors", href: "/dashboard/admin/vendors" },
      { icon: DollarSign, label: "Settlements", href: "/dashboard/admin/settlements" },
      { icon: BarChart3, label: "Analytics", href: "/dashboard/admin/analytics" },
      { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" }
    ]
  },
  bdm: {
    title: "BDM Dashboard",
    nav: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/bdm" },
      { icon: Users, label: "Vendor Pipeline", href: "/dashboard/bdm/vendors" },
      { icon: TrendingUp, label: "Performance", href: "/dashboard/bdm/performance" },
      { icon: Settings, label: "Settings", href: "/dashboard/bdm/settings" }
    ]
  }
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-cyan-500" />
          <span className="font-bold text-slate-900 dark:text-white">DropSync</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800">
            <Package className="w-6 h-6 text-cyan-500" />
            <span className="font-bold text-slate-900 dark:text-white">DropSync</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {config.nav.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 dark:text-slate-400"
              onClick={() => router.push("/auth/login")}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {config.title}
          </h1>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <ThemeSwitch />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
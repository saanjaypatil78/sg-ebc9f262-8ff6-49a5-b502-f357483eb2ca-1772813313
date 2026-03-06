import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, Home, PieChart, Users, Settings, Briefcase, 
  ShoppingCart, Package, BarChart3, Bell
} from "lucide-react";
import { useRouter } from "next/router";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "investor" | "admin" | "super_admin" | "vendor" | "client" | "bdm" | "franchise" | "franchise_partner";
}

export function DashboardLayout({ children, role = "investor" }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const getNavigation = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Overview", href: "/dashboard/admin", icon: PieChart },
          { name: "Users", href: "/dashboard/admin/users", icon: Users },
          { name: "Vendors", href: "/dashboard/admin/vendors", icon: Briefcase },
          { name: "Settlements", href: "/dashboard/admin/settlements", icon: BarChart3 },
        ];
      case "vendor":
        return [
          { name: "Overview", href: "/dashboard/vendor", icon: Home },
          { name: "Orders", href: "/dashboard/vendor/orders", icon: ShoppingCart },
          { name: "Products", href: "/dashboard/vendor/uploads", icon: Package },
          { name: "Performance", href: "/dashboard/vendor/performance", icon: BarChart3 },
        ];
      default:
        return [
          { name: "Portfolio", href: "/dashboard/investor", icon: PieChart },
          { name: "New Investment", href: "/invest", icon: Briefcase },
          { name: "Settings", href: "/dashboard/profile", icon: Settings },
        ];
    }
  };

  const navItems = getNavigation();

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Sidebar - Glassmorphic */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-64 hidden md:flex flex-col bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 relative z-20"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-bold text-white text-xl leading-none">B</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Brave Ecom</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-xl border-b border-white/5 z-10 sticky top-0">
          <h2 className="text-sm font-medium text-slate-400 capitalize">
            {router.pathname.split('/').filter(Boolean).join(' / ') || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-white/20 p-0.5">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Cinematic Page Transitions */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, rotateX: 5, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateX: -5, y: -40, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
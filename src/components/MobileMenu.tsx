import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Menu, X, Home, PieChart, Users, Settings, Briefcase, 
  ShoppingCart, Package, BarChart3, Bell, Shield, Key, History, 
  LogOut, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard/investor", icon: Home },
    { name: "Portfolio", href: "/dashboard/investor", icon: PieChart },
    { name: "Network", href: "/dashboard/investor/network", icon: Users },
    { name: "New Investment", href: "/invest", icon: Briefcase },
    { name: "Active Sessions", href: "/dashboard/security/active-sessions", icon: Key },
    { name: "Login History", href: "/dashboard/security/login-history", icon: History },
    { name: "Trusted Devices", href: "/dashboard/security/trusted-devices", icon: Shield },
    { name: "Settings", href: "/dashboard/profile", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="text-white hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="font-bold text-white text-xl">B</span>
                  </div>
                  <span className="font-bold text-xl text-white">Brave Ecom</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <span className="font-bold text-white text-lg">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.email?.split('@')[0]}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={item.href}>
                        <div
                          className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-50" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-slate-800">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
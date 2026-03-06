"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, Home, PieChart, Briefcase, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

interface MobileMenuProps {
  role?: "investor" | "admin" | "super_admin" | "vendor" | "client" | "bdm" | "franchise" | "franchise_partner";
}

export function MobileMenu({ role = "investor" }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const getNavigation = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Overview", href: "/dashboard/admin", icon: PieChart },
          { name: "Users", href: "/dashboard/admin/users", icon: Home },
          { name: "Vendors", href: "/dashboard/admin/vendors", icon: Briefcase },
        ];
      case "vendor":
        return [
          { name: "Overview", href: "/dashboard/vendor", icon: Home },
          { name: "Orders", href: "/dashboard/vendor/orders", icon: PieChart },
          { name: "Products", href: "/dashboard/vendor/uploads", icon: Briefcase },
        ];
      default:
        return [
          { name: "Portfolio", href: "/dashboard/investor", icon: PieChart },
          { name: "Invest", href: "/invest", icon: Briefcase },
          { name: "Settings", href: "/dashboard/profile", icon: Settings },
        ];
    }
  };

  const navItems = getNavigation();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-40 p-6"
            >
              <div className="flex flex-col h-full pt-16">
                <nav className="flex-1 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.href} onClick={() => setIsOpen(false)}>
                        <span className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          router.pathname === item.href
                            ? "bg-purple-500/10 text-purple-400"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}>
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
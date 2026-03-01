import { SEO } from "@/components/SEO";
import Link from "next/link";
import { ArrowRight, Package, TrendingUp, Shield, Users, FileSpreadsheet, Zap, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <>
      <SEO 
        title="DropSync - Professional Dropshipping Platform"
        description="Enterprise dropshipping platform with automated vendor management, SLA enforcement, and guaranteed returns"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  DropSync
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                Professional E-commerce Solution
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Dropshipping Platform Built for{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Scale
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                Enterprise-grade vendor management with automated SLA enforcement, guaranteed returns under 10%, and 90% on-time delivery tracking.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Free 14-day trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-3xl rounded-full" />
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400">On-Time Delivery</p>
                      <p className="text-3xl font-bold text-green-600">94.8%</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Return Rate</p>
                      <p className="text-3xl font-bold text-blue-600">6.2%</p>
                    </div>
                    <Shield className="w-12 h-12 text-blue-600 opacity-20" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div>
                      <p className="text-sm text-purple-700 dark:text-purple-400">Active Vendors</p>
                      <p className="text-3xl font-bold text-purple-600">147</p>
                    </div>
                    <Users className="w-12 h-12 text-purple-600 opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20 bg-white dark:bg-slate-900/50 rounded-3xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive tools for vendors, admins, and business development teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: "Multi-Vendor Management",
                description: "Centralized dashboard to manage unlimited vendors with performance tracking",
                color: "from-cyan-500 to-blue-600"
              },
              {
                icon: Shield,
                title: "10% Return Guarantee",
                description: "Automated replacement handling with zero commission on replacement products",
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: TrendingUp,
                title: "90% On-Time SLA",
                description: "Real-time delivery performance monitoring with automated penalty enforcement",
                color: "from-blue-500 to-purple-600"
              },
              {
                icon: FileSpreadsheet,
                title: "File Automation",
                description: "Upload operational files for automated reconciliation and settlements",
                color: "from-orange-500 to-red-600"
              },
              {
                icon: Zap,
                title: "QR Code Tracking",
                description: "Vendor-printed QR codes on every package for seamless tracking",
                color: "from-purple-500 to-pink-600"
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Custom dashboards for clients, vendors, admins, and BDMs",
                color: "from-pink-500 to-rose-600"
              }
            ].map((feature, i) => (
              <Card key={i} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Role Selection */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
              Choose Your Role
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Four Specialized Dashboards
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Every user gets a customized experience based on their role
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: "Client",
                description: "Order tracking, returns, and support",
                features: ["Order history", "Live tracking", "Easy returns"],
                color: "from-blue-500 to-cyan-600",
                link: "/dashboard/client"
              },
              {
                role: "Vendor",
                description: "Fulfillment and performance tools",
                features: ["QR generation", "File uploads", "Performance metrics"],
                color: "from-green-500 to-emerald-600",
                link: "/dashboard/vendor"
              },
              {
                role: "Admin",
                description: "Platform control and monitoring",
                features: ["Vendor management", "SLA tracking", "Settlements"],
                color: "from-purple-500 to-pink-600",
                link: "/dashboard/admin"
              },
              {
                role: "BDM",
                description: "Vendor acquisition and growth",
                features: ["Onboarding pipeline", "Performance reports", "Incentives"],
                color: "from-orange-500 to-red-600",
                link: "/dashboard/bdm"
              }
            ].map((role, i) => (
              <Card key={i} className="border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className={`w-full h-32 bg-gradient-to-br ${role.color} rounded-lg flex items-center justify-center mb-4`}>
                    <span className="text-4xl font-bold text-white">{role.role}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {role.role} Dashboard
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {role.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {role.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={role.link}>
                    <Button className="w-full" variant="outline">
                      View Demo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Growing Businesses
            </h2>
            <p className="text-xl opacity-90">
              Platform metrics that speak for themselves
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Orders Processed", value: "1.2M+", icon: Package },
              { label: "Active Vendors", value: "500+", icon: Users },
              { label: "Avg On-Time Rate", value: "92.4%", icon: TrendingUp },
              { label: "Customer Satisfaction", value: "4.8/5", icon: Star }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <p className="text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-lg opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-3xl p-12 text-center border border-slate-700">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Dropshipping Business?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses using DropSync to automate vendor management and scale operations
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">DropSync</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Professional dropshipping platform for modern e-commerce businesses.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Features</Link></li>
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Pricing</Link></li>
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Documentation</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">About</Link></li>
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Blog</Link></li>
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Privacy</Link></li>
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Terms</Link></li>
                  <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600">Security</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center text-slate-600 dark:text-slate-400">
              <p>© {new Date().getFullYear()} DropSync. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
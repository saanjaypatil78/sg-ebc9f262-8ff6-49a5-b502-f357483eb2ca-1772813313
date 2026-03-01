import { SEO } from "@/components/SEO";
import Link from "next/link";
import { ArrowRight, Package, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <SEO
        title="DropSync - Professional Dropshipping Platform"
        description="Complete dropshipping ecosystem with vendor management, automated settlements, and guaranteed compliance"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">DropSync</span>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#roles" className="text-slate-300 hover:text-white transition-colors">
                  Roles
                </Link>
                <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-8">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Production-Ready Dropshipping Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Complete Dropshipping
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Ecosystem
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Multi-vendor marketplace with automated settlements, SLA enforcement,
              <br />
              QR tracking, and guaranteed return management
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 text-lg px-8 py-6">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto">
            {[
              { label: "Return Rate Control", value: "≤10%" },
              { label: "On-Time Delivery", value: "90%" },
              { label: "Automated Tracking", value: "100%" },
              { label: "Vendor Support", value: "24/7" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Platform Features</h2>
            <p className="text-slate-400 text-lg">Everything you need to run a professional dropshipping business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: "Multi-Vendor Management",
                description: "Onboard, manage, and monitor unlimited vendors with performance scorecards"
              },
              {
                icon: Shield,
                title: "Guaranteed Returns",
                description: "10% return limit with mandatory free replacements and zero commission"
              },
              {
                icon: TrendingUp,
                title: "90% On-Time SLA",
                description: "Automated delivery tracking with penalties for non-compliance"
              },
              {
                icon: Zap,
                title: "QR Code Tracking",
                description: "Vendor-printed QR codes on every package for complete traceability"
              },
              {
                icon: Package,
                title: "File Automation",
                description: "Upload operational files for automatic reconciliation and settlements"
              },
              {
                icon: Shield,
                title: "Role-Based Access",
                description: "Separate dashboards for Clients, Vendors, Admins, and BDMs"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Four Powerful Roles</h2>
            <p className="text-slate-400 text-lg">Each role gets a customized drag-and-drop dashboard</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Clients",
                description: "Browse products, place orders, track shipments, manage returns",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Vendors",
                description: "Fulfill orders, print QR codes, upload reports, track performance",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Admins",
                description: "Approve vendors, monitor SLA, process settlements, resolve disputes",
                color: "from-orange-500 to-red-500"
              },
              {
                title: "BDMs",
                description: "Acquire vendors, manage relationships, design plans, track onboarding",
                color: "from-green-500 to-emerald-500"
              }
            ].map((role, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} mb-4 flex items-center justify-center text-white text-2xl font-black`}>
                    {role.title[0]}
                  </div>
                  <CardTitle className="text-white text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/auth/register?role=${role.title.toLowerCase()}`}>
                    <Button variant="ghost" className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Launch Your Dropshipping Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of successful vendors and start selling today
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-slate-100 text-lg px-8 py-6 font-bold">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950/50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-bold text-white">DropSync</span>
              </div>
              <div className="text-slate-400 text-sm">
                © 2026 DropSync. Professional Dropshipping Platform.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
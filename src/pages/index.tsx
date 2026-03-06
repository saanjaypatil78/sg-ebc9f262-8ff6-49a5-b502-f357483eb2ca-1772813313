import { SEO } from "@/components/SEO";
import { ParallaxHero } from "@/components/ParallaxHero";
import { PublicLedger } from "@/components/PublicLedger";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award,
  Zap,
  BarChart3,
  Lock,
  Clock,
  Globe
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "100% Transparent",
      description: "Every transaction publicly verifiable with UTR and TXN IDs",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "15% Monthly Returns",
      description: "Guaranteed returns backed by ₹12 Crore corpus fund",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Referral Commissions",
      description: "Earn up to 45% commission on your network's investments",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: DollarSign,
      title: "28 Exclusive Slots",
      description: "Limited opportunity - ₹43 Lakh per contract unit",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { label: "Total Corpus", value: "₹12 Cr", icon: BarChart3 },
    { label: "Contract Slots", value: "28", icon: Users },
    { label: "Monthly Return", value: "15%", icon: TrendingUp },
    { label: "Commission Rate", value: "45%", icon: Award }
  ];

  return (
    <>
      <SEO 
        title="Brave Ecom - India's Most Transparent Investment Ecosystem"
        description="Join the exclusive ₹12 Crore investment opportunity. 15% monthly returns with full transparency. Only 28 slots available."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* Parallax Hero Section */}
        <ParallaxHero />

        {/* Features Section */}
        <section className="py-24 px-4 relative">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                Why Choose Brave Ecom
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Built On <span className="text-purple-400">Trust</span> & <span className="text-cyan-400">Transparency</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                India's first fully transparent investment platform with public ledger and verifiable transactions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <GlassmorphicCard 
                  key={i} 
                  className="p-6 group"
                  glow
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </GlassmorphicCard>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <GlassmorphicCard className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </div>
        </section>

        {/* Public Ledger */}
        <PublicLedger />

        {/* How It Works */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                Simple Process
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Get Started in <span className="text-cyan-400">3 Easy Steps</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Register & KYC",
                  description: "Complete quick registration with secure KYC verification",
                  icon: Lock
                },
                {
                  step: "2",
                  title: "Invest",
                  description: "Choose your investment tier and secure your slot",
                  icon: DollarSign
                },
                {
                  step: "3",
                  title: "Earn",
                  description: "Receive 15% monthly returns + referral commissions",
                  icon: TrendingUp
                }
              ].map((item, i) => (
                <GlassmorphicCard key={i} className="p-8 text-center" glow>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <item.icon className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </GlassmorphicCard>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <GlassmorphicCard className="p-12 text-center" glow>
              <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Don't Miss This <span className="text-yellow-400">Limited Opportunity</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Only 28 slots available. Once they're gone, they're gone forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register?role=investor">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Secure Your Slot Now
                  </Button>
                </Link>
                <Link href="#transparency">
                  <Button size="lg" variant="outline" className="border-2 border-white/20 backdrop-blur-xl bg-white/5 hover:bg-white/10 text-white text-lg px-8 py-6 rounded-xl">
                    <Globe className="mr-2 h-5 w-5" />
                    View Public Ledger
                  </Button>
                </Link>
              </div>
            </GlassmorphicCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-white">BRAVE ECOM</span>
              </div>
              <div className="flex gap-6 text-sm text-slate-400">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>
              <div className="text-sm text-slate-400">
                © 2026 Brave Ecom. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
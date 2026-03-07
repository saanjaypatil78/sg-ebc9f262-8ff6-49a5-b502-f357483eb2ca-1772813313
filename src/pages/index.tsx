import { SEO } from "@/components/SEO";
import { Hero3DParallax } from "@/components/Hero3DParallax";
import { ScrollProgressIndicator } from "@/components/ScrollProgressIndicator";
import { CameraParallax, CameraFade, CameraZoom } from "@/components/CameraParallax";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Shield,
  Zap,
  Globe,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const router = useRouter();

  const handleViewLedger = () => {
    router.push('/shop');
  };

  return (
    <>
      <SEO
        title="Brave Ecom - Transform Your Financial Future"
        description="Join 184+ investors earning 200%+ returns with India's most transparent investment platform. Pre-IPO opportunity with guaranteed returns and complete transparency."
      />

      <ScrollProgressIndicator />

      <div className="relative bg-slate-950 min-h-screen">
        {/* Hero Section - Full 3D Parallax */}
        <Hero3DParallax />

        {/* Logo Showcase - Optimized for Instant Rendering */}
        <div className="relative w-48 h-48 mx-auto -mt-10 mb-8 z-20">
          <Image
            src="/bravecom-logo-full.jpg"
            alt="Brave Ecom Logo"
            fill
            className="object-contain drop-shadow-2xl rounded-2xl"
            priority
            unoptimized // Bypasses Next.js optimization for true instant loading
          />
        </div>

        {/* Stats Section with Camera Effects */}
        <section className="relative py-16 bg-slate-900/50 overflow-hidden">
          <CameraZoom intensity={0.15}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-orange-500/10 rounded-full blur-3xl" />
            </div>
          </CameraZoom>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  label: "Total Investors",
                  value: "184",
                  color: "from-cyan-400 to-blue-500",
                },
                {
                  icon: DollarSign,
                  label: "Total Investment",
                  value: "₹12.00 Cr",
                  color: "from-green-400 to-emerald-500",
                },
                {
                  icon: TrendingUp,
                  label: "Payouts Distributed",
                  value: "₹65.19 Cr",
                  color: "from-orange-400 to-amber-500",
                },
                {
                  icon: Award,
                  label: "Average ROI",
                  value: "203.64%",
                  color: "from-purple-400 to-pink-500",
                },
              ].map((stat, i) => (
                <CameraFade key={i} delay={i * 0.1}>
                  <div className="group relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                </CameraFade>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 overflow-hidden">
          <CameraParallax speed={40} direction="down">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          </CameraParallax>
          
          <CameraParallax speed={25} direction="up">
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          </CameraParallax>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <CameraFade>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Why Choose <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Brave Ecom</span>?
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Experience the future of investing with guaranteed returns, complete transparency, and unmatched security
                </p>
              </div>
            </CameraFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "100% Transparent",
                  description: "Public ledger with real-time investment tracking. See exactly where your money goes.",
                  color: "from-cyan-500 to-blue-600",
                },
                {
                  icon: TrendingUp,
                  title: "Guaranteed Returns",
                  description: "15% monthly returns for investors. Transparent, predictable, and consistent.",
                  color: "from-green-500 to-emerald-600",
                },
                {
                  icon: Zap,
                  title: "Quick Payouts",
                  description: "First payout in 45 days, then monthly. Automated and on-time every month.",
                  color: "from-orange-500 to-amber-600",
                },
                {
                  icon: Globe,
                  title: "Pan-India Network",
                  description: "Dropshipping ecosystem across 28 states. National reach, local impact.",
                  color: "from-purple-500 to-pink-600",
                },
                {
                  icon: Users,
                  title: "Referral Rewards",
                  description: "Earn up to 45% commission on referrals. Build your network, grow your income.",
                  color: "from-indigo-500 to-purple-600",
                },
                {
                  icon: BarChart3,
                  title: "Pre-IPO Opportunity",
                  description: "Ground floor access before IPO. Lock in exclusive rates and benefits.",
                  color: "from-rose-500 to-orange-600",
                },
              ].map((feature, i) => (
                <CameraFade key={i} delay={i * 0.05}>
                  <div className="group relative p-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl overflow-hidden h-full hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </CameraFade>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Ultra responsive CSS buttons (sub 0.1s response) */}
        <section className="relative py-24 overflow-hidden bg-slate-900/80">
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Financial Future
              </span>
              ?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Join 184+ investors who are already earning consistent returns with India's most transparent investment platform
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/invest">
                <button className="group relative px-10 py-5 w-full sm:w-auto text-lg font-semibold text-white rounded-xl overflow-hidden shadow-2xl transition-all duration-75 ease-in-out hover:scale-105 active:scale-95 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Investing Today
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>

              <button
                onClick={handleViewLedger}
                className="px-10 py-5 w-full sm:w-auto text-lg font-semibold text-cyan-400 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm transition-all duration-75 ease-in-out hover:border-cyan-500 hover:bg-cyan-500/20 active:scale-95 hover:scale-105"
              >
                Shop with Earning
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
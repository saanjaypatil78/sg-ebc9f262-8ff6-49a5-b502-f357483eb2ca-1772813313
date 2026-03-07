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

export default function HomePage() {
  const router = useRouter();

  const handleViewLedger = () => {
    router.push('/auth/login');
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

        {/* Stats Section with Camera Effects */}
        <section className="relative py-24 bg-slate-900/50 overflow-hidden">
          {/* Animated background orbs with Camera Zoom */}
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
                  <CameraParallax speed={20 + (i * 5)} direction="up">
                    <motion.div
                      className="group relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </motion.div>
                  </CameraParallax>
                </CameraFade>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with Multi-Layer Parallax */}
        <section className="relative py-24 overflow-hidden">
          {/* Background layers with different speeds */}
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
                  <CameraParallax speed={15 + (i * 3)} direction={(i % 2 === 0) ? "up" : "down"}>
                    <motion.div
                      className="group relative p-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl overflow-hidden h-full"
                      whileHover={{ scale: 1.05, y: -10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  </CameraParallax>
                </CameraFade>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Dolly Zoom */}
        <section className="relative py-32 overflow-hidden">
          <CameraZoom intensity={0.2}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />
            </div>
          </CameraZoom>

          <CameraFade>
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
                  <motion.button
                    className="group relative px-10 py-5 text-lg font-semibold text-white rounded-xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center gap-2">
                      Start Investing Today
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </motion.button>
                </Link>

                <motion.button
                  onClick={handleViewLedger}
                  className="px-10 py-5 text-lg font-semibold text-cyan-400 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm hover:border-cyan-500/80 transition-colors"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Public Ledger
                </motion.button>
              </div>
            </div>
          </CameraFade>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center text-slate-400">
              <p className="mb-2">© 2026 Brave Ecom. All rights reserved.</p>
              <p className="text-sm">
                Transparent investing for a brighter financial future
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
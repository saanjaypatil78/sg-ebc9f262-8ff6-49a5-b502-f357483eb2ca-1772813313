import { SEO } from "@/components/SEO";
import { Hero3DParallax } from "@/components/Hero3DParallax";
import { ScrollProgressIndicator } from "@/components/ScrollProgressIndicator";
import { CameraFade, CameraZoom } from "@/components/CameraParallax";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Award, Shield, Zap, Globe, BarChart3, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Brave Ecom - Transform Your Financial Future"
        description="Join investors building long-term wealth with transparent systems, rank progression, and performance-based rewards."
      />

      <ScrollProgressIndicator />

      <div className="relative bg-slate-950 min-h-screen">
        <Hero3DParallax />

        <div className="relative w-48 h-48 mx-auto -mt-10 mb-8 z-20">
          <Image
            src="/sunray-logo.jpg"
            alt="Brave Ecom Logo"
            fill
            className="object-contain drop-shadow-2xl rounded-2xl"
            priority
            unoptimized
          />
        </div>

        <section className="relative py-16 bg-slate-900/50 overflow-hidden">
          <CameraZoom intensity={0.15}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-orange-500/10 rounded-full blur-3xl" />
            </div>
          </CameraZoom>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, label: "Total Investors", value: "184", color: "from-cyan-400 to-blue-500" },
                { icon: DollarSign, label: "Total Investment", value: "₹12.00 Cr", color: "from-green-400 to-emerald-500" },
                { icon: TrendingUp, label: "Payouts Distributed", value: "₹65.19 Cr", color: "from-orange-400 to-amber-500" },
                { icon: Award, label: "Average ROI", value: "203.64%", color: "from-purple-400 to-pink-500" },
              ].map((stat, i) => (
                <CameraFade key={stat.label} delay={i * 0.1}>
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

        <section className="relative py-24 overflow-hidden bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <CameraFade>
              <div className="text-center mb-14">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Official Store (External){" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Powered by PhonePe
                  </span>
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Shopping is hosted externally (Shopify / WordPress) for faster checkout and payment integration. Click below to continue.
                </p>
              </div>
            </CameraFade>

            <div className="max-w-2xl mx-auto">
              <CameraFade delay={0.1}>
                <Link href="/shop" className="block">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                      <div>
                        <div className="text-lg font-semibold text-white">Continue to External Store</div>
                        <div className="text-sm text-slate-400 mt-1">Opens the official store link in a new tab</div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="w-full sm:w-auto"
                      >
                        <div className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 animate-pulse ring-2 ring-cyan-500/40 text-white font-semibold text-center transition-colors">
                          Visit Store
                          <ArrowRight className="inline-block ml-2 w-5 h-5" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </CameraFade>
            </div>
          </div>
        </section>

        <section className="relative py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <CameraFade>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Brave Ecom
                  </span>
                  ?
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Transparent systems, performance-based rank progression, and strong governance designed for long-term growth.
                </p>
              </div>
            </CameraFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Transparent Operations",
                  description: "Clear rules, traceable data, and accountable workflows built for real-world execution.",
                  color: "from-cyan-500 to-blue-600",
                },
                {
                  icon: TrendingUp,
                  title: "Performance-Based Rewards",
                  description: "Rank progress is based on business performance and remains stable when targets are maintained.",
                  color: "from-green-500 to-emerald-600",
                },
                {
                  icon: Zap,
                  title: "Automation-First",
                  description: "Structured processes to reduce manual workload and ensure consistent outcomes.",
                  color: "from-orange-500 to-amber-600",
                },
                {
                  icon: Globe,
                  title: "Scalable Ecosystem",
                  description: "Built to support multi-role operations across investors, vendors, admins, and BDMs.",
                  color: "from-purple-500 to-pink-600",
                },
                {
                  icon: Users,
                  title: "Network Growth",
                  description: "Referral workflows and dashboards designed for growth with visibility and control.",
                  color: "from-indigo-500 to-purple-600",
                },
                {
                  icon: BarChart3,
                  title: "Actionable Analytics",
                  description: "Dashboards focus on performance and progress so users can take the right next action.",
                  color: "from-rose-500 to-orange-600",
                },
              ].map((feature, i) => (
                <CameraFade key={feature.title} delay={i * 0.05}>
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
              Track your rank progress, grow your network, and build performance consistently over rolling 3-month windows.
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

              <Link href="/shop">
                <button className="px-10 py-5 w-full sm:w-auto text-lg font-semibold text-cyan-200 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm transition-all duration-75 ease-in-out hover:border-cyan-500 hover:bg-cyan-500/20 active:scale-95 hover:scale-105 animate-pulse ring-2 ring-cyan-500/30">
                  Visit External Store
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
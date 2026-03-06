import { SEO } from "@/components/SEO";
import { PublicLedger } from "@/components/PublicLedger";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { RotatingHexLogo } from "@/components/RotatingHexLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Shield, TrendingUp, Users, DollarSign, Award, Zap,
  BarChart3, Lock, Globe, Key, CheckCircle, Network, ArrowUpRight, ArrowRight
} from "lucide-react";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ScrollProgressIndicator } from "@/components/ScrollProgressIndicator";
import Image from "next/image";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // ULTRA-ENHANCED parallax scroll effects - MAXIMUM INTENSITY (2x stronger)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Ultra-strong parallax transforms for maximum visibility (2x stronger)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -800]);   // 2x stronger (was -400)
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 600]);   // 2x stronger (was 300)
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -500]);    // 2x stronger (was -250)
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 300]);    // 2x stronger (was 150)
  
  // Advanced cinematic effects
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [1, 0.95, 0.85, 0.7, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.02, 0.98, 0.95]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 4, -8]); // Stronger rotation
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const stats = [
    { label: "Total Corpus", value: "₹12 Cr", icon: BarChart3 },
    { label: "Contract Slots", value: "28", icon: Users },
    { label: "Monthly Return", value: "15%", icon: TrendingUp },
    { label: "Commission Rate", value: "45%", icon: Award }
  ];

  const demoRoles = [
    { role: "Super Admin", email: "admin@sunray.eco" },
    { role: "Finance Head", email: "finance@sunray.eco" },
    { role: "Elite Vendor", email: "vendor@sunray.eco" },
    { role: "Active Investor", email: "investor@sunray.eco" }
  ];

  return (
    <>
      <SEO 
        title="Brave Ecom - India's Most Transparent Investment Ecosystem"
        description="Join the exclusive ₹12 Crore investment opportunity. 15% monthly returns with full transparency. Only 28 slots available."
      />
      
      <div ref={containerRef} className="relative min-h-screen bg-slate-950">
        {/* Parallax Background - Behind Everything */}
        <div className="fixed inset-0 pointer-events-none -z-[999] overflow-hidden">
          {/* Layer 1: Copper (Ultra Fast) - 2x stronger */}
          <motion.div 
            style={{ y: y1, rotate, scale }}
            className="absolute -top-[40%] -right-[20%] w-[900px] h-[900px] rounded-full bg-orange-700/20 blur-[180px]" 
          />
          {/* Layer 2: Bronze (Slow Reverse) - 2x stronger */}
          <motion.div 
            style={{ y: y2, opacity }}
            className="absolute top-[60%] -left-[20%] w-[800px] h-[800px] rounded-full bg-amber-600/15 blur-[160px]" 
          />
          {/* Layer 3: Gold (Medium Fast) - 2x stronger */}
          <motion.div 
            style={{ y: y3, scale }}
            className="absolute top-[15%] right-[15%] w-[700px] h-[700px] rounded-full bg-yellow-500/10 blur-[140px]" 
          />
          {/* Layer 4: Deep Blue (Subtle Slow) - 2x stronger */}
          <motion.div 
            style={{ y: y4, opacity }}
            className="absolute top-[70%] right-[30%] w-[600px] h-[600px] rounded-full bg-slate-500/10 blur-[120px]" 
          />
          {/* Static Floor Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-t from-orange-900/20 via-slate-800/20 to-transparent blur-[120px]" />
        </div>

        <ScrollProgressIndicator />

        {/* Hero Section */}
        <motion.div
          style={{ scale: scaleHero, opacity: opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-24 pb-16"
        >
          {/* Logo */}
          <motion.div 
            className="mb-8 relative z-20 flex justify-center"
          >
            <RotatingHexLogo size={200} showTick={true} playSound={true} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white"
          >
            The Future of Frictionless <br/>
            <span className="text-orange-500">Dropshipping.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join 1,200+ investors earning guaranteed 15% monthly returns through our transparent, 
            blockchain-verified investment ecosystem. Every transaction publicly auditable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link 
              href="/invest"
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Investing Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </Link>
            
            <a 
              href="#transparency"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              View Public Ledger
            </a>
          </motion.div>
        </motion.div>

        {/* Pre-IPO vs IPO Market Growth */}
        <section className="py-24 px-4 relative z-10 bg-slate-950/50 backdrop-blur-sm border-y border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                Market Analysis
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Where True Wealth is Generated
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Discover why institutional money focuses strictly on Pre-IPO rounds. 
                We are democratizing this access.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <GlassmorphicCard className="p-10 border-orange-500/30 relative overflow-hidden group" glow>
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-32 h-32 text-orange-500" />
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 mb-6">Sunray Pre-IPO Phase</Badge>
                <h3 className="text-3xl font-bold text-white mb-4">Early Stage Access</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  High-growth potential phase before public listing. Capital deployed directly into infrastructure, marketing, and expansion driving explosive valuation multiples.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-slate-400">Target Multiplier</span>
                    <span className="text-3xl font-black text-orange-400">10x - 50x</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-slate-400">Monthly Yield</span>
                    <span className="text-xl font-bold text-white">15% Fixed</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-slate-400">Accessibility</span>
                    <span className="text-xl font-bold text-white">Limited to 28 Slots</span>
                  </div>
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-10 border-slate-700/50 relative overflow-hidden" glow>
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <BarChart3 className="w-32 h-32 text-slate-400" />
                </div>
                <Badge className="bg-slate-700/50 text-slate-300 mb-6">Standard Public IPO</Badge>
                <h3 className="text-3xl font-bold text-white mb-4">Public Markets</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Mature stage where retail investors typically enter. The massive valuation jumps have already been extracted by institutional early backers.
                </p>
                <div className="space-y-4 opacity-70">
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-slate-500">Historical Avg Growth</span>
                    <span className="text-2xl font-bold text-slate-300">12% - 20% / yr</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-slate-500">Volatility Risk</span>
                    <span className="text-xl font-bold text-slate-300">High (Market Dependent)</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-slate-500">Value Extraction</span>
                    <span className="text-xl font-bold text-slate-300">Fully Priced In</span>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </section>

        {/* Global Dropshipping Reach Map */}
        <section className="py-24 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
                International Logistics
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our Global Dropshipping Hub
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Connecting Indian manufacturing excellence directly to global consumers across North America, Europe, Middle East, and Oceania.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-4 md:p-8 backdrop-blur-sm"
            >
              <Image 
                src="/global-reach-map.png" 
                alt="Global Dropshipping Reach" 
                width={1200} 
                height={600} 
                className="w-full h-auto object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Strategic Sponsors & Case Studies */}
        <section className="py-20 px-4 relative z-10 bg-gradient-to-b from-slate-950 to-slate-900 border-y border-white/5">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                Backed by Industry Leaders
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Strategic Technology Sponsors
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Our infrastructure scales securely alongside the world's most powerful platforms, driving our massive marketing and growth efforts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassmorphicCard className="p-8 text-center hover:border-white/30 transition-colors bg-black/40">
                <div className="h-16 flex items-center justify-center mb-6">
                  <Network className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Vercel Infrastructure</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Powering our global edge network, ensuring sub-100ms load times worldwide for maximum conversion rates and seamless e-commerce transactions.
                </p>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-8 text-center hover:border-blue-500/30 transition-colors bg-black/40">
                <div className="h-16 flex items-center justify-center mb-6">
                  <Zap className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Google Gemini AI</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our strategic AI partner for predictive analytics, optimizing product trend spotting and automating customer support at global scale.
                </p>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-8 text-center hover:border-purple-500/30 transition-colors bg-black/40">
                <div className="h-16 flex items-center justify-center mb-6">
                  <Shield className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">GitHub Enterprise</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Securing our codebase and smart contracts, providing verifiable audit trails, and enabling rapid continuous deployment of new features.
                </p>
              </GlassmorphicCard>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 relative z-10">
          <div className="container mx-auto max-w-7xl">
            <GlassmorphicCard className="p-8 border-orange-500/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </div>
        </section>

        {/* Public Ledger - MAXIMUM VISIBILITY */}
        <div className="relative z-[999] bg-slate-950 py-20">
          <PublicLedger />
        </div>

        {/* CTA Section */}
        <section className="relative z-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20">
          <div className="container mx-auto max-w-4xl">
            <GlassmorphicCard className="p-12 text-center border-orange-500/30" glow>
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-orange-400" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Secure Your Position <span className="text-orange-400">Before Pre-IPO Closes</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Only 28 institutional-grade slots available for retail participation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register?role=investor">
                  <Button size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-lg px-8 py-6 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Enter Ecosystem
                  </Button>
                </Link>
                <Link href="#transparency">
                  <Button size="lg" variant="outline" className="border-2 border-white/20 backdrop-blur-xl bg-white/5 hover:bg-white/10 text-white text-lg px-8 py-6 rounded-xl">
                    <Globe className="mr-2 h-5 w-5" />
                    View Live Ledger
                  </Button>
                </Link>
              </div>
            </GlassmorphicCard>
          </div>
        </section>

        {/* Footer with Hexagonal Logo */}
        <footer className="py-12 px-4 border-t border-white/10 relative z-10 bg-black/80 backdrop-blur-lg">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <RotatingHexLogo size={32} showTick={false} playSound={false} />
                <span className="text-xl font-bold tracking-tight text-white">BRAVECOM</span>
              </div>
              <div className="flex gap-6 text-sm text-slate-400">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>
              <div className="text-sm text-slate-400">
                © 2026 BRAVECOM (Sunray Ecosystem). All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
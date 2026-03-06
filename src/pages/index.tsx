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
import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { SparklingCountdown, useDailySound, Confetti, ScrollProgressIndicator } from "@/components/SparklingCountdown";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Countdown timer - TARGET: November 1, 2025 00:00:00 IST
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [countdownEnded, setCountdownEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Target date: November 1, 2025 at 00:00:00 IST (UTC+5:30)
      // Convert to UTC for accurate calculation
      const targetDate = new Date('2025-11-01T00:00:00+05:30');
      const targetUTC = targetDate.getTime();
      
      // Current time in UTC
      const now = new Date().getTime();
      
      // Calculate difference (should be DECREASING)
      const difference = targetUTC - now;

      console.log('Countdown Debug:', {
        targetDate: targetDate.toISOString(),
        targetUTC,
        now,
        difference,
        differenceInDays: Math.floor(difference / (1000 * 60 * 60 * 24))
      });

      if (difference > 0) {
        // Calculate remaining time
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setCountdownEnded(false);
      } else {
        // Countdown has ended
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!countdownEnded) {
          setCountdownEnded(true);
          // Trigger celebration (confetti already implemented)
        }
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [countdownEnded]);

  // ULTRA-ENHANCED parallax scroll effects - MAXIMUM INTENSITY (2x stronger)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Ultra-strong parallax transforms for maximum visibility
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -400]);   // Primary layer - Fast upward
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 300]);   // Secondary layer - Slow downward
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -250]);    // Tertiary layer - Medium upward
  const y4 = useTransform(scrollYProgress, [0, 1], [-50, 150]);    // Quaternary layer - Subtle downward
  
  // Advanced cinematic effects
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [1, 0.95, 0.85, 0.7, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.02, 0.98, 0.95]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 2, -3]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 2, 5]);

  // ULTRA-ENHANCED parallax scroll effects - MAXIMUM INTENSITY (2x stronger)
  const rotateHero = useTransform(scrollYProgress, [0, 1], [0, 8]); // Stronger rotation
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <>
      <SEO 
        title="Brave Ecom - India's Most Transparent Investment Ecosystem"
        description="Join the exclusive ₹12 Crore investment opportunity. 15% monthly returns with full transparency. Only 28 slots available."
      />
      
      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative">
        {/* ULTRA-ENHANCED 4-Layer Parallax Background - MAXIMUM INTENSITY */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Layer 1: Primary Copper/Bronze Orb (BRAVECOM Logo Colors) - Ultra Fast */}
          <motion.div 
            style={{ y: y1, rotate, scale }}
            className="absolute -top-[40%] -right-[20%] w-[900px] h-[900px] rounded-full bg-copper-600/80 blur-[180px]" 
          />
          
          {/* Layer 2: Secondary BRAVECOM Cyan Orb - Slow Reverse */}
          <motion.div 
            style={{ y: y2, opacity }}
            className="absolute top-[60%] -left-[20%] w-[800px] h-[800px] rounded-full bg-cyan-600/20 blur-[160px]" 
          />
          
          {/* Layer 3: Tertiary Purple Accent - Medium Fast */}
          <motion.div 
            style={{ y: y3, scale }}
            className="absolute top-[15%] right-[15%] w-[700px] h-[700px] rounded-full bg-purple-400/15 blur-[140px]" 
          />
          
          {/* Layer 4: Quaternary Cyan Accent - Subtle Slow */}
          <motion.div 
            style={{ y: y4, opacity }}
            className="absolute top-[70%] right-[30%] w-[600px] h-[600px] rounded-full bg-cyan-400/10 blur-[120px]" 
          />
          
          {/* Static BRAVECOM Brand Glow - Bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-t from-purple-600/15 via-cyan-600/10 to-transparent blur-[120px]" />
        </div>

        {/* Hero Section */}
        <motion.div
          style={{ scale: scaleHero, opacity: opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-24"
        >
          {/* BRAVECOM Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-8xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                BRAVECOM
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wider">
              SUNRAY ECOSYSTEM
            </p>
          </motion.div>

          <motion.h2
            style={{ scale }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              You'll never get a second chance
            </span>
            <br />
            <span className="text-purple-400">to be early.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto"
          >
            Join the revolution in e-commerce investment. 15% monthly returns, transparent operations, and a community of successful investors.
          </motion.p>

          {/* FOMO Countdown Timer - DECREASING to Nov 1, 2025 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            <GlassmorphicCard className={`inline-block px-8 py-6 ${countdownEnded ? 'border-yellow-500/50' : 'border-purple-500/30'}`}>
              {!countdownEnded ? (
                <>
                  <p className="text-sm text-purple-400 mb-4 tracking-wider uppercase">
                    🚀 Limited Time Opportunity Ends In:
                  </p>
                  <div className="flex gap-6 justify-center">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Minutes', value: timeLeft.minutes },
                      { label: 'Seconds', value: timeLeft.seconds }
                    ].map((unit, index) => (
                      <motion.div 
                        key={index} 
                        className="text-center w-20"
                        animate={{ 
                          scale: unit.label === 'Seconds' ? [1, 1.05, 1] : 1 
                        }}
                        transition={{ 
                          duration: 1, 
                          repeat: unit.label === 'Seconds' ? Infinity : 0 
                        }}
                      >
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                          {String(unit.value).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">
                          {unit.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-4">
                    Target Date: November 1, 2025 • Countdown is LIVE ⏱️
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold text-yellow-400 mb-2">
                    🎉 Opportunity is LIVE!
                  </p>
                  <p className="text-sm text-slate-400">
                    Register now to secure your slot
                  </p>
                </motion.div>
              )}
            </GlassmorphicCard>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <section className="py-24 px-4 relative z-10">
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
                  className="p-6 group hover:-translate-y-2 transition-transform duration-300"
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
        <section className="py-16 px-4 relative z-10">
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
        <div className="relative z-10">
          <PublicLedger />
        </div>

        {/* How It Works */}
        <section className="py-24 px-4 relative z-10">
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
                <GlassmorphicCard key={i} className="p-8 text-center hover:-translate-y-2 transition-transform duration-300" glow>
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
        <section className="py-24 px-4 relative z-10">
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
        <footer className="py-12 px-4 border-t border-white/10 relative z-10 bg-slate-950/80 backdrop-blur-lg">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">BRAVECOM</span>
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
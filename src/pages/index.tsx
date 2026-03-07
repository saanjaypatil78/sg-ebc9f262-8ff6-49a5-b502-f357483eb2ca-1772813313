import { SEO } from "@/components/SEO";
import { PublicLedger } from "@/components/PublicLedger";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TrendingUp, Shield, Users, Globe, 
  ArrowRight, CheckCircle, Target,
  Sparkles, Award, Rocket,
  LogIn, UserPlus, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotatingHexLogo } from "@/components/RotatingHexLogo";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { useScrollParallax } from "@/hooks/use-scroll-parallax";
import { ScrollProgressIndicator } from "@/components/ScrollProgressIndicator";

export default function HomePage() {
  const layer1 = useScrollParallax({ speed: 0.5, direction: 'down' });
  const layer2 = useScrollParallax({ speed: 1, direction: 'up' });
  const layer3 = useScrollParallax({ speed: 1.5, direction: 'down' });
  const layer4 = useScrollParallax({ speed: 0.3, direction: 'up', opacity: true });

  return (
    <>
      <SEO 
        title="Brave Ecom - Smart Investment Platform"
        description="Join 184 investors earning 15% monthly returns. Transparent, secure, and compliant investment ecosystem."
        image="/og-image.png"
      />

      <ScrollProgressIndicator />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 relative">
                  <RotatingHexLogo />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent">
                    Brave Ecom
                  </span>
                  <span className="text-xs text-slate-400">Smart Investments</span>
                </div>
              </Link>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                <Link href="/#transparency">
                  <Button 
                    variant="ghost" 
                    className="hidden sm:flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Public Ledger</span>
                  </Button>
                </Link>
                
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section - Full Parallax */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Parallax Background Layers */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Layer 1 - Orange Orb */}
            <div 
              ref={layer1.ref}
              style={layer1.style}
              className="absolute top-20 right-20 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl"
            />
            
            {/* Layer 2 - Cyan Orb */}
            <div 
              ref={layer2.ref}
              style={layer2.style}
              className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
            />
            
            {/* Layer 3 - Purple Orb */}
            <div 
              ref={layer3.ref}
              style={layer3.style}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl"
            />
            
            {/* Layer 4 - Ambient Glow */}
            <div 
              ref={layer4.ref}
              style={layer4.style}
              className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-cyan-500/5"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border border-orange-500/30 backdrop-blur-xl"
              >
                <Sparkles className="w-5 h-5 text-orange-400" />
                <span className="text-slate-200 font-medium">184 Active Investors • ₹12 Crore Invested</span>
                <Award className="w-5 h-5 text-cyan-400" />
              </motion.div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-cyan-400 bg-clip-text text-transparent">
                  Smart Investments,
                </span>
                <br />
                <span className="text-white">
                  Transparent Returns
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto">
                Earn <span className="text-orange-400 font-bold">15% monthly returns</span> with complete transparency. 
                Join 184 investors who trust our proven investment ecosystem.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/auth/register">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-6 shadow-2xl shadow-orange-500/30"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Investing Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/#transparency">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-lg px-8 py-6"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View Public Ledger
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-12">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">100% Transparent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300">Bank-Grade Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span className="text-slate-300">184 Active Investors</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-slate-400 text-sm">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-2 bg-orange-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassmorphicCard animation="slide" delay={0.1} gradient className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20">
                    <Users className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Investors</p>
                    <p className="text-3xl font-bold text-white">184</p>
                  </div>
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard animation="slide" delay={0.2} gradient className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-orange-500/20">
                    <TrendingUp className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Investment</p>
                    <p className="text-3xl font-bold text-white">₹12.00 Cr</p>
                  </div>
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard animation="slide" delay={0.3} gradient className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Target className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Payouts Distributed</p>
                    <p className="text-3xl font-bold text-white">₹65.19 Cr</p>
                  </div>
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard animation="slide" delay={0.4} gradient className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Award className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Average ROI</p>
                    <p className="text-3xl font-bold text-white">203.64%</p>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </section>

        {/* Public Ledger Section */}
        <section id="transparency" className="relative py-20 px-4 scroll-mt-20">
          <PublicLedger />
        </section>

        {/* Final CTA */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <GlassmorphicCard gradient className="p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold text-white">
                  Ready to Start Your Investment Journey?
                </h2>
                <p className="text-xl text-slate-300">
                  Join 184 investors earning consistent monthly returns with complete transparency.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/auth/register">
                    <Button 
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-6"
                    >
                      Get Started Today
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-lg px-8 py-6"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </GlassmorphicCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-slate-800/50 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10">
                    <RotatingHexLogo />
                  </div>
                  <span className="text-xl font-bold text-white">Brave Ecom</span>
                </div>
                <p className="text-slate-400">
                  Smart investment platform with transparent returns and bank-grade security.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-slate-400 hover:text-cyan-400">Home</Link></li>
                  <li><Link href="/#transparency" className="text-slate-400 hover:text-cyan-400">Public Ledger</Link></li>
                  <li><Link href="/invest" className="text-slate-400 hover:text-cyan-400">Start Investing</Link></li>
                  <li><Link href="/contact" className="text-slate-400 hover:text-cyan-400">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/terms" className="text-slate-400 hover:text-cyan-400">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-slate-400 hover:text-cyan-400">Privacy Policy</Link></li>
                  <li><Link href="/disclaimer" className="text-slate-400 hover:text-cyan-400">Risk Disclaimer</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-800/50 text-center text-slate-400">
              <p>&copy; {new Date().getFullYear().toString()} Brave Ecom. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
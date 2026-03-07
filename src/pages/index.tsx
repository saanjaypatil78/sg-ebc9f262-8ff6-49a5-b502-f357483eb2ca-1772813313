import { SEO } from "@/components/SEO";
import { StaticPulsingLogo } from "@/components/StaticPulsingLogo";
import { HorizontalParallax, ArtisticParallax } from "@/components/HorizontalParallax";
import { PublicLedger } from "@/components/PublicLedger";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TrendingUp, Shield, Users, ArrowRight, 
  Sparkles, Award, Rocket, LogIn, UserPlus, Eye,
  DollarSign, Target, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Brave Ecom - Smart Investment Platform"
        description="Join 184 investors earning 15% monthly returns. Transparent, secure, and compliant investment ecosystem."
        image="/og-image.png"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Fixed Navigation */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-4 group">
                <StaticPulsingLogo />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
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

        {/* Hero Landing Page - Full Screen */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          {/* Artistic Horizontal Parallax Background */}
          <ArtisticParallax layers={4}>
            {/* Hero Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border border-orange-500/30 backdrop-blur-xl"
                  >
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    <span className="text-slate-200 font-medium">184 Active Investors • ₹12 Crore Invested</span>
                    <Award className="w-5 h-5 text-cyan-400" />
                  </motion.div>

                  {/* Heading */}
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                      Smart Investments,
                    </span>
                    <br />
                    <span className="text-white">
                      Guaranteed Returns
                    </span>
                  </h1>

                  {/* Subheading */}
                  <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed">
                    Earn <span className="text-orange-400 font-bold">15% monthly returns</span> with complete transparency. 
                    Join 184 investors who trust our proven investment ecosystem.
                  </p>

                  {/* Key Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: Shield, label: "100% Transparent", color: "text-green-400" },
                      { icon: TrendingUp, label: "15% Monthly ROI", color: "text-orange-400" },
                      { icon: Users, label: "184 Investors", color: "text-cyan-400" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                      >
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                        <span className="text-slate-200">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
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
                </motion.div>

                {/* Right Column - Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Users, label: "Investors", value: "184", color: "from-cyan-500 to-blue-500" },
                      { icon: DollarSign, label: "Investment", value: "₹12Cr", color: "from-orange-500 to-amber-500" },
                      { icon: Target, label: "Payouts", value: "₹65Cr", color: "from-green-500 to-emerald-500" },
                      { icon: Award, label: "Avg ROI", value: "204%", color: "from-purple-500 to-pink-500" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 rounded-2xl blur-xl transition-opacity" 
                             style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} 
                        />
                        <div className="relative p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                          <stat.icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                          <p className="text-sm text-slate-400">{stat.label}</p>
                          <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Global Reach Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Globe className="w-6 h-6 text-cyan-400" />
                      <span className="text-slate-200 font-semibold">Global Reach</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Operating across India with 184 active investors and growing
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </ArtisticParallax>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
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

        {/* Horizontal Parallax Section - Pre-IPO vs IPO */}
        <HorizontalParallax direction="right" speed={0.5} className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Why Invest Pre-IPO?
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pre-IPO Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 backdrop-blur-xl"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-4">Pre-IPO Investment</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>15% monthly guaranteed returns</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Complete transparency with public ledger</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Early investor benefits and bonuses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Referral commission program</span>
                  </li>
                </ul>
              </motion.div>

              {/* Post-IPO Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl"
              >
                <h3 className="text-2xl font-bold text-slate-400 mb-4">Post-IPO Investment</h3>
                <ul className="space-y-3 text-slate-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-600 mt-1">×</span>
                    <span>Variable returns (market dependent)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-600 mt-1">×</span>
                    <span>Higher entry price</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-600 mt-1">×</span>
                    <span>No early investor bonuses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-600 mt-1">×</span>
                    <span>Standard dividend structure</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </HorizontalParallax>

        {/* Public Ledger Section */}
        <section id="transparency" className="relative py-20 px-4 scroll-mt-20">
          <PublicLedger />
        </section>

        {/* Horizontal Parallax Section - Technology Sponsors */}
        <HorizontalParallax direction="left" speed={0.7} className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16 text-white"
            >
              Powered By Industry Leaders
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Vercel", desc: "Enterprise deployment platform" },
                { name: "Google Gemini AI", desc: "Advanced AI analytics" },
                { name: "GitHub Enterprise", desc: "Secure code management" },
              ].map((sponsor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/50 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{sponsor.name}</h3>
                  <p className="text-slate-400">{sponsor.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </HorizontalParallax>

        {/* Final CTA */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 text-center rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Start Your Investment Journey?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join 184 investors earning consistent monthly returns with complete transparency.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-slate-800/50 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10">
                    <StaticPulsingLogo />
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
              <p>&copy; 2026 Brave Ecom. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
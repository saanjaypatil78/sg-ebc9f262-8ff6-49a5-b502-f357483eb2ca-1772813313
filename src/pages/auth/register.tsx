import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { emailNotifications } from "@/lib/email/notifications";
import Image from "next/image";
import { supabase } from "@/integrations/supabase/client";

const Confetti = dynamic(() => import("@/components/Confetti").then(mod => ({ default: mod.Confetti })), { ssr: false });

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    referralCode: "",
  });

  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Validate referral code and get role
      const { data: referrer, error: referralError } = await supabase
        .from('users')
        .select('id, role, referral_code')
        .eq('referral_code', formData.referralCode.toUpperCase())
        .single();

      if (referralError || !referrer) {
        throw new Error("Invalid referral code");
      }

      // Register with Supabase Auth
      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        referral_code: formData.referralCode.toUpperCase(),
        referred_by: referrer.id,
        role: referrer.role // Assign same role as referrer
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create account");
      }

      setShowConfetti(true);
      
      toast({
        title: "🎉 Account Created Successfully!",
        description: "Please check your email to verify your account. Redirecting...",
      });

      setTimeout(() => {
        router.push("/auth/onboarding");
      }, 3000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account | Brave Ecom" description="Join our investment platform" />
      <Confetti trigger={showConfetti} duration={5000} />

      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div 
            style={{ y: y1 }}
            className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          ref={containerRef}
          style={{ opacity }}
          className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center"
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Join thousands of investors growing their wealth
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label className="text-slate-300">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        placeholder="John Doe"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label className="text-slate-300">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label className="text-slate-300">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label className="text-slate-300">Confirm Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </motion.div>

                  {/* Referral Code - MANDATORY */}
                  <div className="space-y-2">
                    <Label htmlFor="referralCode" className="text-sm font-medium">
                      Referral Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      required
                    />
                    <p className="text-xs text-slate-400">
                      Referral code is required to join Brave Ecom
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Creating Account...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Create Account
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center text-sm text-slate-400"
                  >
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                      Sign In
                    </Link>
                  </motion.div>
                </form>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Secure Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Email Verification</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { twoFactorService } from "@/lib/security/2fa-service";
import { deviceFingerprintService } from "@/lib/security/device-fingerprint-service";
import { abacPolicyEngine } from "@/lib/security/abac-policy-engine";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  
  // Device binding state
  const [showDeviceWarning, setShowDeviceWarning] = useState(false);
  const [deviceBindingRequired, setDeviceBindingRequired] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });

      if (!result.success || !result.user) {
        throw new Error(result.error || "Login failed");
      }

      // Success toast
      toast({
        title: "✅ Login Successful!",
        description: `Welcome back, ${result.user.name || result.user.email}`,
      });

      // Redirect based on role
      const role = result.user.role?.toLowerCase();
      
      const roleRoutes: Record<string, string> = {
        investor: "/dashboard/investor",
        client: "/dashboard/client",
        vendor: "/dashboard/vendor",
        admin: "/dashboard/admin",
        super_admin: "/dashboard/admin",
        bdm: "/dashboard/bdm",
        franchise_partner: "/dashboard/franchise",
      };

      const redirectPath = roleRoutes[role] || "/dashboard/investor";
      
      // Redirect after short delay for toast visibility
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.verify2FA(tempUserId, twoFactorCode);

      if (!result.success) {
        toast({
          title: "Invalid Code",
          description: result.error || "The verification code is incorrect",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const user = authService.getSession();
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user?.name}!`,
      });

      const redirectTo = authService.getCurrentRole() 
        ? `/dashboard/${authService.getCurrentRole()?.toLowerCase()}`
        : "/dashboard";

      router.push(redirectTo);
    } catch (error) {
      console.error("2FA verification error:", error);
      toast({
        title: "Verification Error",
        description: "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterDevice = async () => {
    setIsLoading(true);

    try {
      const result = await authService.registerDevice(tempUserId, "Current Device");
      
      if (!result.success) {
        toast({
          title: "Registration Failed",
          description: result.error || "Failed to register device",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Device Registered",
        description: "This device is now trusted for high-value operations",
      });

      const user = authService.getSession();
      const redirectTo = authService.getCurrentRole() 
        ? `/dashboard/${authService.getCurrentRole()?.toLowerCase()}`
        : "/dashboard";

      router.push(redirectTo);
    } catch (error) {
      console.error("Device registration error:", error);
      toast({
        title: "Registration Error",
        description: "Failed to register device",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show 2FA verification screen
  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Two-Factor Authentication</CardTitle>
            <CardDescription className="text-slate-400">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twoFactorCode" className="text-slate-300">Verification Code</Label>
              <Input
                id="twoFactorCode"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                className="bg-slate-800 border-slate-700 text-white text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              onClick={handleVerify2FA}
              disabled={isLoading || twoFactorCode.length !== 6}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShow2FA(false)}
              className="w-full text-slate-400 hover:text-white"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show device binding warning
  if (showDeviceWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <Card className="w-full max-w-md border-amber-500/20 bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Device Binding Required</CardTitle>
            <CardDescription className="text-slate-400">
              Your account has investments ≥ ₹5 Crore
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <p className="text-sm text-slate-300">
                For your security, high-value accounts require trusted device binding. 
                This ensures only authorized devices can access your account and execute transactions.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-400">This will:</p>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Register this device as trusted
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Enable high-value operations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Require this device for transactions ≥ ₹1 Cr
                </li>
              </ul>
            </div>

            <Button
              onClick={handleRegisterDevice}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              {isLoading ? "Registering..." : "Register This Device"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowDeviceWarning(false)}
              className="w-full text-slate-400 hover:text-white"
            >
              Cancel Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show normal login screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md">
        <GlassmorphicCard className="p-8 border border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src="/WhatsApp_Image_2026-01-27_at_23.16.51-removebg-preview.png"
                alt="Bravecom Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-slate-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link 
                href="/auth/forgot-password" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Create Account
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            <span>Secured with bank-grade encryption</span>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
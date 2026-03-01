import { SEO } from "@/components/SEO";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowLeft } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Demo login - route based on email
    setTimeout(() => {
      if (email.includes("admin")) {
        router.push("/dashboard/admin");
      } else if (email.includes("vendor")) {
        router.push("/dashboard/vendor");
      } else if (email.includes("bdm")) {
        router.push("/dashboard/bdm");
      } else {
        router.push("/dashboard/client");
      }
    }, 1000);
  };

  return (
    <>
      <SEO title="Sign In - DropSync" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
              <CardDescription className="text-slate-400">
                Sign in to your DropSync account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-300">Password</Label>
                    <Link href="/auth/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Create account
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-xs text-slate-500 text-center">
                  Demo accounts: admin@dropsync.com, vendor@dropsync.com, bdm@dropsync.com, client@dropsync.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
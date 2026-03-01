import { SEO } from "@/components/SEO";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, ArrowLeft } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const { role } = router.query;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: (role as string) || "client",
    company: ""
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Demo registration
    setTimeout(() => {
      router.push(`/dashboard/${formData.role}`);
    }, 1000);
  };

  return (
    <>
      <SEO title="Create Account - DropSync" />
      
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
              <CardTitle className="text-2xl text-white">Create Account</CardTitle>
              <CardDescription className="text-slate-400">
                Get started with DropSync today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300">Account Type</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-800">
                      <SelectItem value="client" className="text-white">Client - Buy Products</SelectItem>
                      <SelectItem value="vendor" className="text-white">Vendor - Sell Products</SelectItem>
                      <SelectItem value="bdm" className="text-white">BDM - Manage Vendors</SelectItem>
                      <SelectItem value="admin" className="text-white">Admin - Platform Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                {(formData.role === "vendor" || formData.role === "bdm") && (
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-slate-300">Company Name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company Ltd."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
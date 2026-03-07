import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  TrendingUp, ArrowUpRight, DollarSign, Calendar, 
  PieChart, Download, AlertCircle, Shield, Smartphone,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [requiresDeviceBinding, setRequiresDeviceBinding] = useState(false);
  const [hasBindDevice, setHasBindDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvestorData();
  }, [user]);

  async function loadInvestorData() {
    if (!user) return;
    
    try {
      // In production, fetch from database
      // For now, using mock data
      
      // Simulate checking investment amount
      const mockInvestment = 60000000; // 6 Cr for demo
      setInvestmentAmount(mockInvestment);
      
      // Check if device binding required (>5 Cr)
      const requiresBinding = mockInvestment > 50000000;
      setRequiresDeviceBinding(requiresBinding);
      
      // Check if device is already bound
      // In production: query trusted_devices table
      setHasBindDevice(false);
    } catch (error) {
      console.error("Error loading investor data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const monthlyReturn = investmentAmount * 0.15; // 15% monthly
  const yearlyReturn = monthlyReturn * 12;

  return (
    <DashboardLayout role="investor">
      <div className="space-y-8">
        {/* Security Alert for High-Value Investors */}
        {requiresDeviceBinding && !hasBindDevice && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <Shield className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-500 font-semibold">Enhanced Security Required</AlertTitle>
            <AlertDescription className="text-slate-300">
              Your investment of ₹{(investmentAmount / 10000000).toFixed(2)} Crore requires device binding for enhanced security.
              <Link href="/dashboard/security/trusted-devices">
                <Button variant="outline" size="sm" className="ml-4 border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Bind This Device
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {requiresDeviceBinding && hasBindDevice && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertTitle className="text-green-500 font-semibold">Device Secured</AlertTitle>
            <AlertDescription className="text-slate-300">
              This device is trusted and bound to your account.
            </AlertDescription>
          </Alert>
        )}

        {/* Portfolio Overview */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investment Portfolio</h1>
          <p className="text-slate-400">Track your returns and performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Investment</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">₹{(investmentAmount / 10000000).toFixed(2)} Cr</div>
              <p className="text-xs text-slate-500 mt-1">Principal amount</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Monthly Return</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">₹{(monthlyReturn / 10000000).toFixed(2)} Cr</div>
              <p className="text-xs text-green-500 mt-1">+15% per month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Annual Projection</CardTitle>
              <Calendar className="h-5 w-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">₹{(yearlyReturn / 10000000).toFixed(2)} Cr</div>
              <p className="text-xs text-cyan-500 mt-1">Estimated yearly return</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Performance Overview</CardTitle>
            <CardDescription>Monthly returns breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { month: "January 2025", return: monthlyReturn, status: "paid" },
              { month: "February 2025", return: monthlyReturn, status: "due", dueDate: "Feb 28" },
              { month: "March 2025", return: monthlyReturn, status: "upcoming", dueDate: "Mar 31" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div>
                  <p className="text-white font-medium">{item.month}</p>
                  <p className="text-xs text-slate-400">
                    {item.status === "paid" && "Paid"}
                    {item.status === "due" && `Due: ${item.dueDate}`}
                    {item.status === "upcoming" && `Upcoming: ${item.dueDate}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-400">
                    ₹{(item.return / 10000000).toFixed(2)} Cr
                  </p>
                  <p className="text-xs text-slate-500">15% return</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Commission Dashboard
              </CardTitle>
              <CardDescription>View your referral earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Commissions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-cyan-500" />
                Download Reports
              </CardTitle>
              <CardDescription>Export your investment reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-white/20 hover:bg-white/5">
                Generate PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Status */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Account Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm text-slate-300">Two-Factor Authentication</span>
              <span className="text-sm text-green-500 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm text-slate-300">Trusted Devices</span>
              <Link href="/dashboard/security/trusted-devices">
                <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm text-slate-300">Active Sessions</span>
              <Link href="/dashboard/security/active-sessions">
                <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                  View All
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
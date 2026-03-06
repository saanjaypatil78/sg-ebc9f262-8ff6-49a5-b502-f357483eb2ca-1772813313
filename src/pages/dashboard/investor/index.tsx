import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { investmentService, InvestmentAgreement, MonthlyPayout } from "@/services/investmentService";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Calendar, DollarSign, PieChart, ArrowUpRight, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalInvested: 0,
    totalReceived: 0,
    monthlyReturn: 0,
    activeAgreements: 0,
    roi: 0
  });
  const [agreements, setAgreements] = useState<InvestmentAgreement[]>([]);
  const [payouts, setPayouts] = useState<MonthlyPayout[]>([]);
  const [nextPayoutDate, setNextPayoutDate] = useState("");

  useEffect(() => {
    async function loadInvestorData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Handle null user gracefully
        
        const summary = await investmentService.getPortfolioSummary(user.id);
        const active = await investmentService.getInvestorAgreements(user.id);
        const history = await investmentService.getPayoutHistory(user.id);
        
        setSummary(summary);
        setAgreements(active);
        setPayouts(history);
        setNextPayoutDate(investmentService.calculateNextPayoutDate());
      } catch (error) {
        console.error("Failed to load investor data", error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadInvestorData();
    }
  }, [user]);

  return (
    <>
      <SEO title="Investor Portfolio | Brave Ecom" />
      <DashboardLayout role="investor">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Investment Portfolio</h1>
              <p className="text-muted-foreground mt-1">Track your agreements, returns, and payout schedule.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.location.href='/invest'} className="bg-primary hover:bg-primary/90 text-white font-semibold">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                New Investment
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card/50 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatCurrency(summary.totalInvested)}</div>
                <p className="text-xs text-muted-foreground mt-1">Across {summary.activeAgreements} active agreements</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Received</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(summary.totalReceived)}</div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime earnings (ROI: {summary.roi.toFixed(1)}%)</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payout</CardTitle>
                <Calendar className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{formatCurrency(summary.monthlyReturn)}</div>
                <p className="text-xs text-muted-foreground mt-1">Next payout: {nextPayoutDate}</p>
              </CardContent>
            </Card>

             <Card className="bg-card/50 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Agreement Value</CardTitle>
                <PieChart className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">₹43,00,000</div>
                <p className="text-xs text-muted-foreground mt-1">Per standard contract unit</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Agreements Table */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4 bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Active Agreements</CardTitle>
                <CardDescription>Your current active investment contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agreements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No active agreements found.
                    </div>
                  ) : (
                    agreements.map((agreement) => (
                      <div key={agreement.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">Agreement #{agreement.agreement_number}</p>
                          <p className="text-xs text-muted-foreground">Matures: {new Date(agreement.maturity_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{formatCurrency(agreement.agreement_value)}</p>
                          <p className="text-xs text-green-500">Active (15% Monthly)</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card className="col-span-3 bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Payouts</CardTitle>
                <CardDescription>Latest monthly returns credited</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                  {payouts.slice(0, 5).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No payouts received yet.
                    </div>
                  ) : (
                    payouts.slice(0, 5).map((payout) => (
                      <div key={payout.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                             <History className="h-4 w-4 text-green-500" />
                           </div>
                           <div>
                             <p className="text-sm font-medium text-white">{new Date(payout.payout_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                             <p className="text-xs text-muted-foreground">{payout.status}</p>
                           </div>
                        </div>
                        <div className="text-sm font-bold text-green-500">
                          +{formatCurrency(payout.payout_amount)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Wallet,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const totalRaised = 12.0;
  const targetGoal = 111.0;
  const progressPercent = (totalRaised / targetGoal) * 100;
  const contracts = 28;
  const minInvestment = 100000;
  const deadline = "Aug 26, 2026";

  return (
    <>
      <SEO 
        title="Brave Ecom Platform - Future of Frictionless Dropshipping"
        description="Join the exclusive journey to our ₹111 Cr milestone. Be part of the global dropshipping and logistics infrastructure revolution."
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">BRAVE ECOM</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#dashboard" className="text-sm hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="#portfolio" className="text-sm hover:text-primary transition-colors">
                Portfolio
              </Link>
              <Link href="#payouts" className="text-sm hover:text-primary transition-colors">
                PAYOUTS
              </Link>
              <Link href="#learn" className="text-sm hover:text-primary transition-colors">
                Learn
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">TEST:</span>
                <Link href="/auth/register?role=admin">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
                <Link href="/auth/register?role=investor">
                  <Button variant="outline" size="sm">Investor</Button>
                </Link>
                <Link href="/auth/register?role=franchise_partner">
                  <Button variant="outline" size="sm">Partner</Button>
                </Link>
              </div>
              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              LIVE ROUND
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              Future of{" "}
              <span className="text-primary">Frictionless</span>
              <br />
              <span className="text-primary">Dropshipping</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the exclusive journey to our <span className="text-primary font-bold">₹111 Cr</span> milestone. 
              Be part of the global dropshipping and logistics infrastructure revolution.
            </p>
          </div>

          {/* Investment Stats Card */}
          <div className="max-w-3xl mx-auto mt-12">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">TOTAL RAISED</p>
                    <h2 className="text-4xl md:text-5xl font-bold">
                      ₹{totalRaised.toFixed(2)} Cr
                    </h2>
                    <p className="text-primary text-sm mt-1">+15% this week</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-muted-foreground mb-2">TARGET GOAL</p>
                    <h2 className="text-4xl md:text-5xl font-bold">
                      ₹{targetGoal.toFixed(2)} Cr
                    </h2>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progressPercent} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-1">CONTRACTS</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      {contracts}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-1">MIN INVESTMENT</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      ₹{(minInvestment / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-1">TIME REMAINING</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {deadline}
                    </p>
                  </div>
                </div>

                <Link href="/auth/register?role=investor">
                  <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
                    Secure Your Allocation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Invest in Brave Ecom?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Verified KYC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Industry-standard identity verification powered by Didit.me ensures secure onboarding.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <TrendingUp className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>15% Monthly Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Passive income with transparent payout schedules. First payout in 45 days, then monthly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Franchise Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Become a franchise partner and earn 25% active returns by managing logistics operations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 mb-16">
          <Card className="max-w-3xl mx-auto border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
              <p className="text-muted-foreground">
                Choose your investment path and complete KYC verification in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/auth/register?role=investor">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    Become an Investor
                  </Button>
                </Link>
                <Link href="/auth/register?role=franchise_partner">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Franchise Partnership
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
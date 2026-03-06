import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { diditService } from "@/services/diditService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function VendorVerification() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");

  // Handle callback from Didit
  useEffect(() => {
    if (router.query.status === "completed") {
      setStatus("success");
      toast({
        title: "Verification Successful",
        description: "Your identity has been verified. You can now proceed to document upload.",
      });
      // In a real app, we would verify the webhook signature here
    }
  }, [router.query, toast]);

  const startVerification = async () => {
    setLoading(true);
    try {
      const session = await (diditService as any).createVerificationSession();
      
      // Redirect to Didit verification page
      if (session.verification_url) {
        window.location.href = session.verification_url;
      } else {
        throw new Error("No verification URL returned");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Error",
        description: "Could not start verification session. Please check configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="vendor">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Identity Verification</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Step 1 of 6: Vendor Onboarding Process
          </p>
        </div>

        {status === "success" ? (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Identity Verified</h3>
                <p className="text-green-700 dark:text-green-400">
                  Your KYC verification was successful.
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/vendor/uploads")}>
                Continue to Document Upload
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Identity</CardTitle>
              <CardDescription>
                We partner with Didit to securely verify your identity. This is required for all vendors to ensure platform safety.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg space-y-2">
                  <ShieldCheck className="w-8 h-8 text-cyan-500" />
                  <h4 className="font-semibold">Secure</h4>
                  <p className="text-sm text-slate-500">Bank-grade encryption for your data.</p>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <ShieldCheck className="w-8 h-8 text-cyan-500" />
                  <h4 className="font-semibold">Fast</h4>
                  <p className="text-sm text-slate-500">Automated verification in seconds.</p>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <ShieldCheck className="w-8 h-8 text-cyan-500" />
                  <h4 className="font-semibold">Compliance</h4>
                  <p className="text-sm text-slate-500">Full KYC/AML regulatory compliance.</p>
                </div>
              </div>

              <Alert>
                <AlertTitle>Before you start</AlertTitle>
                <AlertDescription>
                  Please have your government-issued ID (Passport, Driver's License, or National ID) ready.
                </AlertDescription>
              </Alert>

              <Button 
                size="lg" 
                className="w-full sm:w-auto" 
                onClick={startVerification}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Didit...
                  </>
                ) : (
                  "Start Verification with Didit"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
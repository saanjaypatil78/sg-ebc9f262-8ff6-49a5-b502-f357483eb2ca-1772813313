import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { emailVerificationService } from "@/lib/security/email-verification-service";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token && typeof token === "string") {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const result = await emailVerificationService.verifyEmail(verificationToken);
      
      if (result.success) {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(result.error || "Verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred during verification");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            {status === "verifying" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
            {status === "success" && <CheckCircle className="w-8 h-8 text-white" />}
            {status === "error" && <XCircle className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {status === "verifying" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {message || "Please wait while we verify your email address..."}
          </CardDescription>
        </CardHeader>

        {status !== "verifying" && (
          <CardContent>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              {status === "success" ? "Continue to Login" : "Back to Login"}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
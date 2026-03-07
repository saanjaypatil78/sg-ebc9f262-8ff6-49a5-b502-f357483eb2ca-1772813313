import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { emailNotificationService } from "@/lib/email/notifications";
import { Loader2, Mail, ArrowLeft, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Send password reset email
      await emailNotificationService.sendPasswordReset(
        email,
        "User",
        `${window.location.origin}/auth/reset-password?token=RESET_TOKEN_HERE`
      );

      setEmailSent(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password - Brave Ecom"
        description="Reset your Brave Ecom account password"
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back to Login Link */}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 p-8">
            {!emailSent ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-slate-400">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-6"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                {/* Additional Help */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    Remember your password?{" "}
                    <Link
                      href="/auth/login"
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-slate-400 mb-6">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-cyan-400 font-medium mb-8">{email}</p>

                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm text-slate-300 mb-8">
                    <p className="mb-2">
                      <strong>Didn't receive the email?</strong>
                    </p>
                    <ul className="list-disc list-inside text-left space-y-1 text-slate-400">
                      <li>Check your spam folder</li>
                      <li>Make sure the email address is correct</li>
                      <li>Wait a few minutes and check again</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    Try Another Email
                  </Button>

                  <div className="mt-6">
                    <Link
                      href="/auth/login"
                      className="text-sm text-slate-400 hover:text-cyan-300"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Security Notice */}
          <p className="mt-6 text-xs text-center text-slate-500">
            For security reasons, password reset links expire after 1 hour
          </p>
        </motion.div>
      </div>
    </>
  );
}
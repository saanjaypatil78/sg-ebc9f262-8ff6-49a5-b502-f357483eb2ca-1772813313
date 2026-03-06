import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Shield, Smartphone, Key, Check, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { twoFactorService } from "@/lib/security/2fa-service";
import { authService } from "@/services/authService";

export default function Setup2FAPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<"scan" | "verify">("scan");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  useEffect(() => {
    initiate2FASetup();
  }, []);

  const initiate2FASetup = async () => {
    const user = authService.getSession();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const setup = await twoFactorService.setupTwoFactor(user.id);
      setQrCodeUrl(setup.qrCodeUrl);
      setSecret(setup.secret);
      setBackupCodes(setup.backupCodes);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to initialize 2FA setup",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const user = authService.getSession();
    
    try {
      const isValid = await twoFactorService.verifyAndEnable(user!.id, verificationCode);
      
      if (isValid) {
        toast({
          title: "2FA Enabled!",
          description: "Two-factor authentication is now active",
        });
        
        setTimeout(() => {
          router.push("/dashboard/profile");
        }, 2000);
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify 2FA code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
    toast({
      title: "Copied!",
      description: "Secret key copied to clipboard",
    });
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
    toast({
      title: "Copied!",
      description: "Backup codes copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-4">
      <Card className="w-full max-w-2xl border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-slate-400">
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "scan" && (
            <>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    Step 1: Scan QR Code
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Scan this QR code with Google Authenticator, Authy, or Microsoft Authenticator
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="text-center text-slate-900 font-mono text-xs">
                      {qrCodeUrl}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Key className="w-5 h-5 text-cyan-400" />
                    Manual Entry (if QR scan fails)
                  </h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-slate-900 text-cyan-400 rounded font-mono text-sm">
                      {secret}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copySecret}
                      className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                    >
                      {copiedSecret ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <h3 className="text-amber-400 font-semibold mb-2">⚠️ Backup Codes</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Save these codes in a secure place. Each can be used once if you lose access to your authenticator.
                  </p>
                  <div className="bg-slate-900 p-3 rounded font-mono text-xs text-cyan-400 mb-3">
                    {backupCodes.map((code, idx) => (
                      <div key={idx}>{code}</div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyBackupCodes}
                    className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700"
                  >
                    {copiedBackup ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Backup Codes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setStep("verify")}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                Continue to Verification
              </Button>
            </>
          )}

          {step === "verify" && (
            <>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2">Step 2: Verify Setup</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-slate-300">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="bg-slate-800/50 border-slate-700 text-white text-center text-2xl tracking-widest"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("scan")}
                  className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerify}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? "Verifying..." : "Enable 2FA"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
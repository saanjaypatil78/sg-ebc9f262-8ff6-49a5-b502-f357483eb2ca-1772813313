import { useState, useRef, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { diditService } from "@/services/diditService";
import { investmentService } from "@/services/investmentService";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building2, QrCode, CheckCircle2, ArrowRight, 
  ShieldCheck, Banknote, Search, AlertCircle, Scale, FileText 
} from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Confetti } from "@/components/Confetti";
import { useRouter } from "next/router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function InvestPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState<string>("51111");
  const [utrNumber, setUtrNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [isVerifyingIfsc, setIsVerifyingIfsc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Real-time payment polling
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'verified' | 'failed'>('pending');
  const [pollingProgress, setPollingProgress] = useState(0);

  // Parallax Scroll Effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const numericAmount = parseInt(amount.replace(/,/g, '') || "0", 10);
  const isLargeTransfer = numericAmount >= 100000;

  // Real-time payment status polling
  useEffect(() => {
    if (!transactionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await diditService.checkVerificationStatus(transactionId);
        setPaymentStatus(status.status);
        setPollingProgress((prev) => Math.min(prev + 10, 90));

        if (status.status === 'verified') {
          clearInterval(pollInterval);
          setPollingProgress(100);
          setShowConfetti(true);
          
          toast({
            title: "✅ Payment Verified!",
            description: "Your investment has been confirmed. Redirecting to dashboard...",
          });

          setTimeout(() => {
            router.push('/dashboard/investor');
          }, 3000);
        } else if (status.status === 'failed') {
          clearInterval(pollInterval);
          toast({
            variant: "destructive",
            title: "Payment Verification Failed",
            description: "Please contact support with your UTR number.",
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [transactionId, router, toast]);

  // Real-time IFSC Fetch
  useEffect(() => {
    if (ifscCode.length === 11) {
      handleIfscLookup();
    } else {
      setBankName("");
    }
  }, [ifscCode]);

  const handleIfscLookup = async () => {
    setIsVerifyingIfsc(true);
    try {
      const details = await diditService.verifyIFSC(ifscCode);
      if (details.verified && details.bankName) {
        setBankName(`${details.bankName} - ${details.branchName}`);
        toast({
          title: "Bank Details Verified",
          description: `Routing to ${details.bankName}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid IFSC Code",
          description: "Please check the code and try again.",
        });
        setBankName("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsVerifyingIfsc(false);
    }
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
    if (!utrNumber || utrNumber.length < 12) return toast({ title: "Invalid UTR", description: "Please enter a valid 12-digit UTR/Transaction ID.", variant: "destructive" });

    setIsSubmitting(true);
    setPaymentStatus('processing');
    
    try {
      // 1. Register transaction via Didit platform
      const verification = await diditService.createVerificationRequest({
        amount: numericAmount,
        utr: utrNumber,
        accountNumber: isLargeTransfer ? "4051939609" : "PHONEPE",
        ifscCode: isLargeTransfer ? "KKBK0001352" : "NA",
        userId: user.id
      });

      setTransactionId(verification.id);

      // 2. Sync with Supabase (Investment Agreement Creation)
      await investmentService.createAgreement(user.id, numericAmount);

      toast({
        title: "Investment Initiated! 🎉",
        description: "Your payment is under verification. Real-time status updates will appear below.",
      });

      // Reset form but keep showing status
      setAmount("");
      setUtrNumber("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error processing your investment.",
      });
      setPaymentStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Secure Investment Portal | Brave Ecom" />
      <Confetti trigger={showConfetti} duration={5000} />
      
      <DashboardLayout role="investor">
        <motion.div 
          ref={containerRef}
          style={{ opacity, scale }}
          className="max-w-5xl mx-auto py-8 relative"
        >
          {/* Background Ambient Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <motion.div style={{ y: y1 }} className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
            <motion.div style={{ y: y2 }} className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-cyan-600/20 blur-[100px]" />
          </div>

          <div className="text-center mb-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-sm">
                Secure Investment Gateway
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                Smart routing enabled. Enter your investment amount to view the most optimal payment method.
              </p>
            </motion.div>
          </div>

          {/* Legal Agreement Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-orange-900/20 to-amber-900/20 border border-orange-700/50 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Legally Binding Agreement
                </h3>
                <p className="text-slate-300 mb-4">
                  All investments are governed by a <strong>12-month notarized agreement</strong> executed before a licensed Advocate. 
                  This ensures complete legal protection and enforceability of investment terms.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-1">Agreement Term</div>
                    <div className="text-white text-2xl font-bold">12 Months</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-1">Monthly ROI</div>
                    <div className="text-white text-2xl font-bold">15%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-cyan-400 font-semibold mb-1">Total Return</div>
                    <div className="text-white text-2xl font-bold">280%</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 border-orange-700/50 hover:bg-orange-900/20"
                  onClick={() => setShowAgreement(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Agreement Terms
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Agreement Terms Dialog */}
          <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  12-Month Investment Agreement Terms
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">1. Agreement Duration</h3>
                  <p>This investment agreement is valid for exactly <strong className="text-orange-400">12 months</strong> from the date of investment.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2. Monthly Returns</h3>
                  <p>The investor shall receive <strong className="text-green-400">15% monthly returns</strong> on the principal investment amount for 12 consecutive months.</p>
                  <div className="mt-2 p-4 bg-slate-800/50 rounded-lg">
                    <div className="font-mono text-sm">
                      <div>First Payout: 45 days after investment date</div>
                      <div>Subsequent Payouts: Every 30 days thereafter</div>
                      <div>Total Payouts: 12 monthly payments</div>
                      <div className="mt-2 text-green-400">Total Profit: 180% of principal</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3. Principal Return</h3>
                  <p>At the end of the 12-month term, the <strong className="text-cyan-400">full principal amount</strong> shall be returned to the investor along with the final monthly profit payment.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">4. Lock-in Period</h3>
                  <p>This agreement includes a <strong className="text-orange-400">12-month lock-in period</strong>. Early withdrawal or termination of the agreement is <strong>not permitted</strong> except under extraordinary circumstances with written consent from both parties.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5. Legal Notarization</h3>
                  <p>This agreement is <strong className="text-purple-400">legally notarized</strong> before a licensed Advocate and registered with appropriate authorities. All terms are legally binding and enforceable under Indian law.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6. Re-investment Option</h3>
                  <p>Upon completion of the 12-month term, the investor may choose to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Re-invest with a new 12-month agreement</li>
                    <li>Withdraw the total payout (principal + profit)</li>
                    <li>Partially re-invest and withdraw remaining amount</li>
                  </ul>
                </div>
                
                <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Important Notice</h3>
                  <p className="text-sm">
                    By proceeding with this investment, you acknowledge that you have read, understood, and agree to all terms and conditions outlined in the notarized agreement. 
                    This is a legally binding contract executed before a licensed Advocate.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {/* Left Column: Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassmorphicCard className="p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-slate-900/60">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
                
                <form onSubmit={handleSubmission} className="space-y-8">
                  {/* Amount Input */}
                  <div className="space-y-3">
                    <Label className="text-slate-300 text-sm font-semibold uppercase tracking-wider">Investment Amount (₹)</Label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₹</span>
                      <Input
                        type="number"
                        min="51111"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 h-14 bg-white/5 border-white/10 text-white text-xl font-semibold focus:ring-2 focus:ring-purple-500/50 transition-all rounded-xl"
                        placeholder="e.g., 51111"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-focus-within:opacity-20 transition-opacity pointer-events-none -z-10 blur-md" />
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                      Amount determines payment method automatically
                    </p>
                  </div>

                  {/* Payment Routing Display */}
                  <AnimatePresence mode="wait">
                    {isLargeTransfer ? (
                      <motion.div
                        key="bank"
                        initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                        exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                        className="p-6 rounded-xl bg-gradient-to-br from-blue-900/30 to-slate-900/50 border border-blue-500/30 space-y-4 shadow-inner"
                      >
                        <div className="flex items-center gap-3 text-blue-400 font-semibold mb-2">
                          <Building2 className="w-5 h-5" />
                          <span>Direct Bank Transfer Route</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Company Name</p>
                            <p className="text-white font-medium bg-white/5 p-2 rounded-md">Brave Ecom Pvt Ltd</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Bank Name</p>
                            <p className="text-white font-medium bg-white/5 p-2 rounded-md">Kotak Mahindra Bank</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Account Number</p>
                            <p className="text-white font-mono tracking-wider bg-white/5 p-2 rounded-md">4051939609</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider">IFSC Code</p>
                            <p className="text-white font-mono tracking-wider bg-white/5 p-2 rounded-md text-cyan-400">KKBK0001352</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="qr"
                        initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                        exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                        className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 flex items-center justify-between shadow-inner"
                      >
                        <div>
                          <div className="flex items-center gap-3 text-purple-400 font-semibold mb-2">
                            <QrCode className="w-5 h-5" />
                            <span>PhonePe QR Route</span>
                          </div>
                          <p className="text-slate-400 text-sm">Fast, secure payment via PhonePe gateway for amounts under ₹1 Lakh.</p>
                        </div>
                        <ArrowRight className="text-purple-500/50 w-8 h-8 hidden md:block" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Verification Section */}
                  <div className="space-y-5 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Payment Verification
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Sender IFSC Lookup (Optional but cool for Didit) */}
                      <div className="space-y-2">
                        <Label className="text-slate-300">Your Bank IFSC (For validation)</Label>
                        <div className="relative">
                          <Input
                            type="text"
                            maxLength={11}
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                            placeholder="e.g., SBIN0001234"
                            className="bg-white/5 border-white/10 text-white uppercase font-mono h-12"
                          />
                          {isVerifyingIfsc && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                        {bankName && (
                          <p className="text-sm text-cyan-400 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {bankName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">UTR / Transaction ID *</Label>
                        <Input
                          type="text"
                          required
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="Enter 12-digit UTR number"
                          className="bg-white/5 border-white/10 text-white font-mono h-12"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting || !utrNumber}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all hover:scale-[1.02] rounded-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying via Didit...
                      </span>
                    ) : (
                      "Submit for Verification"
                    )}
                  </Button>

                  {/* Real-time Payment Status */}
                  {transactionId && paymentStatus !== 'pending' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-300 font-medium">Payment Status</span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${
                          paymentStatus === 'verified' ? 'text-green-400' :
                          paymentStatus === 'processing' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {paymentStatus}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pollingProgress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        {paymentStatus === 'verified' ? '✅ Verified! Redirecting...' :
                         paymentStatus === 'processing' ? '⏳ Checking payment status...' :
                         '❌ Verification failed'}
                      </p>
                    </motion.div>
                  )}
                </form>
              </GlassmorphicCard>
            </motion.div>

            {/* Right Column: Visual Feedback / QR */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {!isLargeTransfer ? (
                  <motion.div
                    key="qr-display"
                    initial={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    className="w-full max-w-sm"
                  >
                    <GlassmorphicCard glow className="p-2 border-white/20 bg-slate-900/80 aspect-[4/5] flex flex-col items-center justify-center relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <div className="text-center mb-6 z-10">
                        <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Scan to Pay</h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold border border-green-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                          Accepted Here
                        </div>
                      </div>
                      
                      <div className="relative w-64 h-64 bg-white p-4 rounded-2xl shadow-2xl z-10 transform transition-transform group-hover:scale-105 duration-500">
                        <div className="absolute inset-0 border-4 border-dashed border-purple-500/30 rounded-2xl animate-pulse" />
                        {/* Assuming the image is uploaded and copied to public */}
                        <Image 
                          src="/phonepe-qr.png" 
                          alt="PhonePe QR Code" 
                          fill
                          className="object-contain p-2"
                          loading="lazy"
                        />
                      </div>
                      
                      <p className="mt-8 text-slate-400 font-medium tracking-widest text-sm z-10">
                        SANJAY SANTOSH PATIL
                      </p>
                    </GlassmorphicCard>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bank-display"
                    initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    className="w-full"
                  >
                    <GlassmorphicCard glow className="p-8 border-white/20 bg-gradient-to-br from-slate-900 to-blue-950/50 h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full" />
                      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full" />
                      
                      <Building2 className="w-20 h-20 text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      <h3 className="text-2xl font-bold text-white mb-2 text-center">Institutional Transfer</h3>
                      <p className="text-slate-400 text-center mb-8 max-w-sm">
                        For investments of ₹1 Lakh and above, please use NEFT, RTGS, or IMPS directly to our corporate account.
                      </p>

                      <div className="w-full bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <span className="text-slate-400 text-sm">Account Name</span>
                          <span className="text-white font-semibold tracking-wide">Brave Ecom Pvt Ltd</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <span className="text-slate-400 text-sm">Account Number</span>
                          <span className="text-cyan-400 font-mono text-lg font-bold">4051939609</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">IFSC Code</span>
                          <span className="text-purple-400 font-mono text-lg font-bold">KKBK0001352</span>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  );
}
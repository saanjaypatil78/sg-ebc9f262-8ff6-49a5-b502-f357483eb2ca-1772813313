import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldCheck, Banknote, UserPlus, TrendingUp, Mail, Shield, Building2, CreditCard, Users, AlertCircle, Lock, User, Phone, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";

type UserRole = "investor" | "franchise_partner" | "admin" | "super_admin";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  
  // Role from URL or default
  const [role, setRole] = useState<UserRole>("investor");
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Address
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // KYC Documents
    aadhaarNumber: "",
    panNumber: "",
    
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    
    // Investment Details (for investors)
    investmentAmount: "",
    investmentTier: "",
    
    // Franchise Details (for franchise partners)
    franchiseLocation: "",
    franchiseType: "",
    
    // Referral
    referralCode: "",
    
    // Terms
    agreeTerms: false,
    agreeKYC: false
  });

  useEffect(() => {
    const urlRole = router.query.role as UserRole;
    if (urlRole && ["investor", "franchise_partner", "admin", "super_admin"].includes(urlRole)) {
      setRole(urlRole);
    }
  }, [router.query.role]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      // Validate current step
      if (step === 1) {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
          setError("Please fill in all required fields");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          return;
        }
      }
      
      if (step === 2) {
        if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
          setError("Please fill in all address fields");
          return;
        }
        if (!formData.aadhaarNumber || !formData.panNumber) {
          setError("Please provide KYC documents");
          return;
        }
      }
      
      setError("");
      setStep(step + 1);
      return;
    }

    // Final validation
    if (!formData.agreeTerms || !formData.agreeKYC) {
      setError("Please accept all terms and conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: role,
            phone: formData.phone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile record with all details
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: formData.email,
            role: role,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            aadhaar_number: formData.aadhaarNumber,
            pan_number: formData.panNumber,
            bank_name: formData.bankName,
            account_number: formData.accountNumber,
            ifsc_code: formData.ifscCode,
            account_holder_name: formData.accountHolderName,
            investment_amount: formData.investmentAmount ? parseFloat(formData.investmentAmount) : null,
            investment_tier: formData.investmentTier || null,
            franchise_location: formData.franchiseLocation || null,
            franchise_type: formData.franchiseType || null,
            referral_code: formData.referralCode || null,
            kyc_status: "pending",
            onboarding_completed: false
          });

        if (profileError) throw profileError;

        // 3. Redirect to verification page
        router.push("/auth/verify-email");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const investmentTiers = [
    { value: "tier_a", label: "Tier A - ₹51,111 (15% monthly)" },
    { value: "tier_l1", label: "Tier L1 - ₹10,60,000 (15% monthly)" },
    { value: "tier_l2", label: "Tier L2 - ₹27,00,000 (15% monthly)" },
    { value: "tier_l3", label: "Tier L3 - ₹53,00,000 (15% monthly)" },
  ];

  const franchiseTypes = [
    { value: "logistics", label: "Logistics Hub" },
    { value: "warehouse", label: "Warehouse Partner" },
    { value: "regional", label: "Regional Distribution" },
  ];

  return (
    <>
      <SEO title={`Register as ${role === "investor" ? "Investor" : "Franchise Partner"} - Brave Ecom`} />
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">BRAVE ECOM</span>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">
                {role === "investor" ? "Investor Registration" : 
                 role === "franchise_partner" ? "Franchise Partner Registration" :
                 "Admin Registration"}
              </CardTitle>
              <CardDescription>
                Step {step} of 3 - {step === 1 ? "Personal Information" : step === 2 ? "KYC & Address" : "Financial Details"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign In Option */}
              {step === 1 && (
                <div className="mb-6">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Continue with Google
                  </Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or register with email
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Step 2: KYC & Address */}
                {step === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        required
                      />
                    </div>

                    <div className="border-t border-border pt-4 mt-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        KYC Documents
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                          <Input
                            id="aadhaarNumber"
                            type="text"
                            placeholder="12 digit Aadhaar number"
                            maxLength={12}
                            value={formData.aadhaarNumber}
                            onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="panNumber">PAN Number *</Label>
                          <Input
                            id="panNumber"
                            type="text"
                            placeholder="ABCDE1234F"
                            maxLength={10}
                            value={formData.panNumber}
                            onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Financial Details */}
                {step === 3 && (
                  <>
                    <div className="border-t border-border pt-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Bank Account Details
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            type="text"
                            value={formData.bankName}
                            onChange={(e) => handleInputChange("bankName", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            type="text"
                            value={formData.ifscCode}
                            onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accountHolderName">Account Holder Name</Label>
                          <Input
                            id="accountHolderName"
                            type="text"
                            value={formData.accountHolderName}
                            onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {role === "investor" && (
                      <div className="border-t border-border pt-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-primary" />
                          Investment Details
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="investmentTier">Investment Tier</Label>
                            <Select
                              value={formData.investmentTier}
                              onValueChange={(value) => handleInputChange("investmentTier", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select investment tier" />
                              </SelectTrigger>
                              <SelectContent>
                                {investmentTiers.map(tier => (
                                  <SelectItem key={tier.value} value={tier.value}>
                                    {tier.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="investmentAmount">Investment Amount (₹)</Label>
                            <Input
                              id="investmentAmount"
                              type="number"
                              min="51111"
                              value={formData.investmentAmount}
                              onChange={(e) => handleInputChange("investmentAmount", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {role === "franchise_partner" && (
                      <div className="border-t border-border pt-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Franchise Details
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="franchiseType">Franchise Type</Label>
                            <Select
                              value={formData.franchiseType}
                              onValueChange={(value) => handleInputChange("franchiseType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select franchise type" />
                              </SelectTrigger>
                              <SelectContent>
                                {franchiseTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="franchiseLocation">Preferred Location</Label>
                            <Input
                              id="franchiseLocation"
                              type="text"
                              placeholder="City or region"
                              value={formData.franchiseLocation}
                              onChange={(e) => handleInputChange("franchiseLocation", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                        <Input
                          id="referralCode"
                          type="text"
                          value={formData.referralCode}
                          onChange={(e) => handleInputChange("referralCode", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                        />
                        <label htmlFor="agreeTerms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          I agree to the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeKYC"
                          checked={formData.agreeKYC}
                          onCheckedChange={(checked) => handleInputChange("agreeKYC", checked as boolean)}
                        />
                        <label htmlFor="agreeKYC" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          I consent to KYC verification via Didit.me and understand my data will be securely processed
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={loading}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Processing..." : step < 3 ? "Continue" : "Complete Registration"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

interface OnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  aadhaarNumber: string;
  panNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  investmentAmount?: number;
  franchiseLocation?: string;
  termsAccepted: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userRole, setUserRole] = useState<string>('');
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNumber: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    termsAccepted: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', session.user.id)
      .single();

    if (profile?.onboarding_completed) {
      router.push('/dashboard');
      return;
    }

    setUserRole(profile?.role || '');
  };

  const handleInputChange = (field: keyof OnboardingData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
        toast({
          title: "Missing Information",
          description: "Please fill in all address fields",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.aadhaarNumber || !formData.panNumber) {
        toast({
          title: "Missing Information",
          description: "Please provide both Aadhaar and PAN numbers",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
        toast({
          title: "Missing Information",
          description: "Please complete all bank details",
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
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
          investment_amount: formData.investmentAmount,
          franchise_location: formData.franchiseLocation,
          onboarding_completed: true,
          kyc_status: "PENDING",
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Onboarding Complete!",
        description: "Your information has been saved. Proceeding to verification...",
      });

      // Redirect to Didit verification
      setTimeout(() => {
        router.push('/dashboard/vendor/verification');
      }, 1500);
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Address" },
    { number: 3, title: "KYC Documents" },
    { number: 4, title: "Bank Details" },
    { number: 5, title: "Review" },
  ];

  return (
    <>
      <SEO title="Complete Your Onboarding - Brave Ecom" />
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-24 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complete Your Onboarding</CardTitle>
              <CardDescription>
                {userRole === 'investor' && 'Provide your details to start investing'}
                {userRole === 'franchise_partner' && 'Provide your details to start your franchise'}
                {!userRole && 'Loading...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 1234567890"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Address */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: KYC Documents */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                      <Input
                        id="aadhaar"
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                        placeholder="1234 5678 9012"
                        maxLength={12}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number *</Label>
                      <Input
                        id="pan"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Bank Details */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Select
                        value={formData.bankName}
                        onValueChange={(value) => handleInputChange('bankName', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="State Bank of India">State Bank of India</SelectItem>
                          <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                          <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                          <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                          <SelectItem value="Kotak Mahindra Bank">Kotak Mahindra Bank</SelectItem>
                          <SelectItem value="Punjab National Bank">Punjab National Bank</SelectItem>
                          <SelectItem value="Bank of Baroda">Bank of Baroda</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code *</Label>
                      <Input
                        id="ifsc"
                        value={formData.ifscCode}
                        onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                        placeholder="SBIN0001234"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Role-Specific Info + Review */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    {userRole === 'investor' && (
                      <div className="space-y-2">
                        <Label htmlFor="investmentAmount">Investment Amount (₹) *</Label>
                        <Input
                          id="investmentAmount"
                          type="number"
                          value={formData.investmentAmount || ''}
                          onChange={(e) => handleInputChange('investmentAmount', parseInt(e.target.value))}
                          placeholder="100000"
                          min="51111"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Minimum investment: ₹51,111</p>
                      </div>
                    )}

                    {userRole === 'franchise_partner' && (
                      <div className="space-y-2">
                        <Label htmlFor="franchiseLocation">Franchise Location *</Label>
                        <Input
                          id="franchiseLocation"
                          value={formData.franchiseLocation || ''}
                          onChange={(e) => handleInputChange('franchiseLocation', e.target.value)}
                          placeholder="e.g., Mumbai, Maharashtra"
                          required
                        />
                      </div>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I accept the terms and conditions, privacy policy, and risk disclosure statement
                      </label>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                      <h4 className="font-semibold">Review Your Information</h4>
                      <p><span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {formData.phone}</p>
                      <p><span className="text-muted-foreground">Address:</span> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                      <p><span className="text-muted-foreground">PAN:</span> {formData.panNumber}</p>
                      <p><span className="text-muted-foreground">Bank:</span> {formData.bankName}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="ml-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading || !formData.termsAccepted}
                      className="ml-auto"
                    >
                      {loading ? 'Submitting...' : 'Complete Onboarding'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
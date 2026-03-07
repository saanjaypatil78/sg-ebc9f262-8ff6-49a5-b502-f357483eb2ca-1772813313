import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, ShoppingBag, Wallet, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/orderService";
import { phonePeService } from "@/services/phonePeService";
import { supabase } from "@/integrations/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useEarnings, setUseEarnings] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "phonepe",
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to proceed with checkout",
        variant: "destructive",
      });
      router.push("/auth/login?redirect=/shop/checkout");
      return;
    }

    if (cart.length === 0) {
      router.push("/shop/cart");
      return;
    }

    loadWalletBalance();
  }, [user, cart]);

  const loadWalletBalance = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .maybeSingle();
        
      setWalletBalance(data?.wallet_balance || 12500); // Fallback for demo if column doesn't exist
    } catch (error) {
      console.error("Error loading wallet:", error);
      setWalletBalance(12500);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid Indian phone number (10 digits starting with 6-9)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Invalid pincode (6 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const platformFee = cartTotal * 0.15;
  const earningsDiscount = useEarnings ? Math.min(walletBalance, cartTotal + platformFee) : 0;
  const finalPayable = cartTotal + platformFee - earningsDiscount;

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customerId: user.id,
        items: cart,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        subtotal: cartTotal,
        platformFee,
        earningsUsed: earningsDiscount,
        finalAmount: finalPayable,
        paymentMethod: formData.paymentMethod,
      };

      if (finalPayable <= 0) {
        // Order fully covered by earnings
        const order = await orderService.createOrder(orderData);
        clearCart();
        router.push(`/shop/order-success?orderId=${order.id}`);
      } else {
        // Initiate PhonePe payment
        const paymentResponse = await phonePeService.initiateOrderPayment({
          amount: finalPayable,
          userId: user.id,
          mobileNumber: formData.phone
        });
        
        if (paymentResponse && paymentResponse.paymentUrl) {
          clearCart();
          window.location.href = paymentResponse.paymentUrl;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "Unable to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Checkout - Brave Ecom Mall" description="Complete your purchase" />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/shop/cart" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="John Doe"
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Main Street"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Mumbai"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="Maharashtra"
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="400001"
                        maxLength={6}
                        className={errors.pincode ? "border-red-500" : ""}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="phonepe"
                        checked={formData.paymentMethod === "phonepe"}
                        onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                        className="w-4 h-4 text-cyan-600"
                      />
                      <span className="font-medium">PhonePe / UPI</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.productName}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee (15%)</span>
                      <span>₹{platformFee.toLocaleString("en-IN")}</span>
                    </div>

                    {walletBalance > 0 && (
                      <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useEarnings}
                            onChange={(e) => setUseEarnings(e.target.checked)}
                            className="w-4 h-4 text-cyan-600"
                          />
                          <span className="text-sm font-medium flex items-center gap-1">
                            <Wallet className="w-4 h-4" />
                            Use Earnings
                          </span>
                        </label>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 ml-6">
                          Available: ₹{walletBalance.toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}

                    {useEarnings && earningsDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Earnings Discount</span>
                        <span>-₹{earningsDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Payable</span>
                    <span className="text-cyan-600">₹{finalPayable.toLocaleString("en-IN")}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-lg font-semibold"
                  >
                    {loading ? "Processing..." : `Pay ₹${finalPayable.toLocaleString("en-IN")}`}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    By placing your order, you agree to our Terms & Conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import { MapPin, CreditCard, Package } from "lucide-react";
import { phonePeService } from "@/services/phonePeService";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const platformFee = cartTotal * 0.15;
  const vendorAmount = cartTotal * 0.85;
  const grandTotal = cartTotal + platformFee;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to place order",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    // Validate address
    if (!shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      toast({
        title: "Incomplete Address",
        description: "Please fill all required address fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create orders for each product
      const orderPromises = cart.map(async (item) => {
        // Create order in database
        const order = await orderService.createOrder({
          customer_id: user.id,
          vendor_id: item.vendorId,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
          total_amount: item.price * item.quantity,
          platform_commission: (item.price * item.quantity) * 0.15,
          vendor_amount: (item.price * item.quantity) * 0.85,
          status: "pending",
          shipping_address: JSON.stringify(shippingAddress),
          payment_status: "pending",
        });

        // Deduct stock
        await productService.deductStock(item.productId, item.quantity);

        return order;
      });

      await Promise.all(orderPromises);

      // Initiate PhonePe payment
      const paymentResult = await phonePeService.initiatePayment({
        amount: grandTotal,
        merchantTransactionId: `ORDER_${Date.now()}`,
        merchantUserId: user.id,
        redirectUrl: `${window.location.origin}/shop/order-success`,
        callbackUrl: `${window.location.origin}/api/phonepe/callback`,
      });

      if (paymentResult.success && paymentResult.data?.instrumentResponse?.redirectInfo?.url) {
        // Clear cart
        clearCart();

        // Redirect to PhonePe
        window.location.href = paymentResult.data.instrumentResponse.redirectInfo.url;
      } else {
        throw new Error("Payment initiation failed");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    router.push("/shop/cart");
    return null;
  }

  return (
    <>
      <SEO title="Checkout - Brave Ecom Mall" />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shipping Address */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                      }
                      placeholder="House No, Street Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                      }
                      placeholder="Landmark, Area"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        placeholder="Mumbai"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        placeholder="Maharashtra"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={shippingAddress.pincode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, pincode: e.target.value })
                        }
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <img
                      src="/phonepe-qr.png"
                      alt="PhonePe"
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        PhonePe
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Pay securely with PhonePe
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {item.productName} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Platform Fee (15%)</span>
                      <span>₹{platformFee.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                        <span>Total</span>
                        <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Vendor receives: ₹{vendorAmount.toLocaleString("en-IN")} (85%)</p>
                    <p>Platform fee: ₹{platformFee.toLocaleString("en-IN")} (15%)</p>
                    <p className="pt-2">* GST included in platform fee</p>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                    size="lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      `Pay ₹${grandTotal.toLocaleString("en-IN")}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
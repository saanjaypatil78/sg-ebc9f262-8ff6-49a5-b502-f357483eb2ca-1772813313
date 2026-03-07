import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CheckCircle, Package, Truck, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Confetti } from "@/components/Confetti";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">No order information found</p>
            <Link href="/shop">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO title="Order Placed Successfully - Brave Ecom Mall" description="Your order has been confirmed" />
      
      {showConfetti && <Confetti trigger={showConfetti} />}

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-2 border-cyan-500/20 shadow-2xl">
            <CardContent className="pt-12 pb-10 text-center space-y-8">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full p-6">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Order Placed Successfully!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Thank you for shopping with us
                </p>
              </div>

              {/* Order Details */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Order ID</span>
                  <Badge className="bg-cyan-500 text-white px-4 py-1 text-sm font-mono">
                    #{orderId.toString().slice(0, 8).toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Status</span>
                  <Badge className="bg-emerald-500 text-white">Confirmed</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Estimated Delivery</span>
                  <span className="font-semibold">3-5 Business Days</span>
                </div>
              </div>

              {/* What's Next */}
              <div className="text-left bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-slate-800/30 dark:to-slate-800/30 rounded-xl p-6 border border-cyan-200 dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-600" />
                  What happens next?
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Order Confirmation Email</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        You'll receive an email with order details shortly
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Vendor Preparation</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Our vendor will carefully pack your order
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Shipping Update</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Track your package in real-time from your account
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/dashboard/client/orders" className="flex-1">
                  <Button variant="outline" className="w-full h-12 border-2 hover:border-cyan-500 hover:text-cyan-600 transition-colors">
                    <Truck className="w-5 h-5 mr-2" />
                    Track Order
                  </Button>
                </Link>
                
                <Link href="/shop" className="flex-1">
                  <Button className="w-full h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <Link href="/" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 transition-colors mt-4">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@bravecom.eco" className="text-cyan-600 hover:underline font-medium">
                support@bravecom.eco
              </a>
            </p>
            
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
              <span>✓ 10 Days Replacement Guarantee</span>
              <span>✓ Free Returns</span>
              <span>✓ Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
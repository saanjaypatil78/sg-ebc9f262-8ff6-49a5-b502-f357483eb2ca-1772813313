import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("@/components/Confetti").then(mod => ({ default: mod.Confetti })), { ssr: false });

export default function OrderSuccessPage() {
  const router = useRouter();
  const { transaction_id, merchant_transaction_id } = router.query;

  return (
    <>
      <SEO title="Order Successful - Brave Ecom Mall" />
      <Confetti trigger={true} duration={5000} />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Order Successful! 🎉
            </h1>

            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Your order has been placed successfully and is being processed.
            </p>

            {merchant_transaction_id && (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Order ID
                </p>
                <p className="font-mono font-semibold text-slate-900 dark:text-white">
                  {merchant_transaction_id}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/dashboard/client/orders">
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                  <Package className="w-4 h-4 mr-2" />
                  Track Your Orders
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
              <p>You will receive order confirmation via email</p>
              <p>Vendor will process your order within 24 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
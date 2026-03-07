import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const platformFee = cartTotal * 0.15;
  const vendorAmount = cartTotal * 0.85;
  const grandTotal = cartTotal + platformFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push("/shop/checkout");
  };

  return (
    <>
      <SEO title="Shopping Cart - Brave Ecom Mall" />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
            <Link href="/shop">
              <Button variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {cart.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  Your cart is empty
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Add products to your cart to get started
                </p>
                <Link href="/shop">
                  <Button className="bg-cyan-500 hover:bg-cyan-600">
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card key={item.productId}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Sold by: {item.vendorName}
                          </p>
                          <p className="text-sm text-slate-500">SKU: {item.sku}</p>

                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity - 1)
                                }
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    item.productId,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-16 text-center"
                                min="1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1)
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex-1" />

                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-900 dark:text-white">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </p>
                              <p className="text-xs text-slate-500">
                                ₹{item.price.toLocaleString("en-IN")} each
                              </p>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Subtotal ({cart.length} items)</span>
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
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-cyan-500 hover:bg-cyan-600"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>

                    <Link href="/shop">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
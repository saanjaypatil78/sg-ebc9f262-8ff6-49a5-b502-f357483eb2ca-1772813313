import { SEO } from "@/components/SEO";
import { Hero3DParallax } from "@/components/Hero3DParallax";
import { ScrollProgressIndicator } from "@/components/ScrollProgressIndicator";
import { CameraParallax, CameraFade, CameraZoom } from "@/components/CameraParallax";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Shield,
  Zap,
  Globe,
  BarChart3,
  ArrowRight,
  Star,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productService.getAllProducts();
      setFeaturedProducts(products.slice(0, 8)); // Show first 8 products
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      productName: product.product_name || product.name,
      price: parseFloat(product.price),
      quantity: 1,
      vendorId: product.vendor_id,
      vendorName: product.vendors?.business_name || "Vendor",
      imageUrl: product.images?.[0] || product.image_url,
      sku: product.sku,
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.product_name || product.name} added to your cart`,
    });
  };

  const handleViewLedger = () => {
    router.push('/shop');
  };

  return (
    <>
      <SEO
        title="Brave Ecom - Transform Your Financial Future"
        description="Join 184+ investors earning 200%+ returns with India's most transparent investment platform. Pre-IPO opportunity with guaranteed returns and complete transparency."
      />

      <ScrollProgressIndicator />

      <div className="relative bg-slate-950 min-h-screen">
        {/* Hero Section - Full 3D Parallax */}
        <Hero3DParallax />

        {/* Logo Showcase - Optimized for Instant Rendering */}
        <div className="relative w-48 h-48 mx-auto -mt-10 mb-8 z-20">
          <Image
            src="/sunray-logo.png"
            alt="Brave Ecom Logo"
            fill
            className="object-contain drop-shadow-2xl rounded-2xl"
            priority
            unoptimized // Bypasses Next.js optimization for true instant loading
          />
        </div>

        {/* Stats Section with Camera Effects */}
        <section className="relative py-16 bg-slate-900/50 overflow-hidden">
          <CameraZoom intensity={0.15}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-orange-500/10 rounded-full blur-3xl" />
            </div>
          </CameraZoom>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  label: "Total Investors",
                  value: "184",
                  color: "from-cyan-400 to-blue-500",
                },
                {
                  icon: DollarSign,
                  label: "Total Investment",
                  value: "₹12.00 Cr",
                  color: "from-green-400 to-emerald-500",
                },
                {
                  icon: TrendingUp,
                  label: "Payouts Distributed",
                  value: "₹65.19 Cr",
                  color: "from-orange-400 to-amber-500",
                },
                {
                  icon: Award,
                  label: "Average ROI",
                  value: "203.64%",
                  color: "from-purple-400 to-pink-500",
                },
              ].map((stat, i) => (
                <CameraFade key={i} delay={i * 0.1}>
                  <div className="group relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                </CameraFade>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="relative py-24 overflow-hidden bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <CameraFade>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Shop Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Marketplace</span>
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
                  Browse products from verified vendors across India. Earn commission on every purchase made by your network!
                </p>
                <Link href="/shop">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                    View All Products
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CameraFade>

            {loadingProducts ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-slate-400">Loading products...</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No products available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, i) => (
                  <CameraFade key={product.id} delay={i * 0.05}>
                    <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                      <Link href={`/shop/product/${product.id}`} className="block">
                        <div className="aspect-square bg-slate-900 relative overflow-hidden group">
                          {product.images?.[0] || product.image_url ? (
                            <img
                              src={product.images?.[0] || product.image_url}
                              alt={product.product_name || product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-600">
                              No Image
                            </div>
                          )}
                          {product.stock_quantity <= 0 && (
                            <Badge className="absolute top-2 right-2 bg-red-500">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </Link>

                      <CardContent className="pt-4 flex-1 flex flex-col">
                        <Link href={`/shop/product/${product.id}`}>
                          <h3 className="font-semibold text-white line-clamp-2 hover:text-cyan-400 transition-colors">
                            {product.product_name || product.name}
                          </h3>
                        </Link>

                        <p className="text-sm text-slate-400 mt-1">
                          by {product.vendors?.business_name || "Vendor"}
                        </p>

                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-white">
                            {parseFloat(product.aggregated_rating || 4.5).toFixed(1)}
                          </span>
                          <span className="text-sm text-slate-400">
                            ({product.review_count || Math.floor(Math.random() * 200) + 15})
                          </span>
                        </div>

                        <div className="mt-auto pt-4 flex items-end justify-between">
                          <div>
                            <p className="text-xl font-bold text-white">
                              ₹{parseFloat(product.price).toLocaleString("en-IN")}
                            </p>
                          </div>

                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity <= 0}
                            size="sm"
                            className="bg-cyan-500 hover:bg-cyan-600"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CameraFade>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 overflow-hidden">
          <CameraParallax speed={40} direction="down">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          </CameraParallax>
          
          <CameraParallax speed={25} direction="up">
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          </CameraParallax>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <CameraFade>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Why Choose <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Brave Ecom</span>?
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Experience the future of investing with guaranteed returns, complete transparency, and unmatched security
                </p>
              </div>
            </CameraFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "100% Transparent",
                  description: "Public ledger with real-time investment tracking. See exactly where your money goes.",
                  color: "from-cyan-500 to-blue-600",
                },
                {
                  icon: TrendingUp,
                  title: "Guaranteed Returns",
                  description: "15% monthly returns for investors. Transparent, predictable, and consistent.",
                  color: "from-green-500 to-emerald-600",
                },
                {
                  icon: Zap,
                  title: "Quick Payouts",
                  description: "First payout in 45 days, then monthly. Automated and on-time every month.",
                  color: "from-orange-500 to-amber-600",
                },
                {
                  icon: Globe,
                  title: "Pan-India Network",
                  description: "Dropshipping ecosystem across 28 states. National reach, local impact.",
                  color: "from-purple-500 to-pink-600",
                },
                {
                  icon: Users,
                  title: "Referral Rewards",
                  description: "Earn up to 45% commission on referrals. Build your network, grow your income.",
                  color: "from-indigo-500 to-purple-600",
                },
                {
                  icon: BarChart3,
                  title: "Pre-IPO Opportunity",
                  description: "Ground floor access before IPO. Lock in exclusive rates and benefits.",
                  color: "from-rose-500 to-orange-600",
                },
              ].map((feature, i) => (
                <CameraFade key={i} delay={i * 0.05}>
                  <div className="group relative p-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl overflow-hidden h-full hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </CameraFade>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Ultra responsive CSS buttons (sub 0.1s response) */}
        <section className="relative py-24 overflow-hidden bg-slate-900/80">
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Financial Future
              </span>
              ?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Join 184+ investors who are already earning consistent returns with India's most transparent investment platform
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/invest">
                <button className="group relative px-10 py-5 w-full sm:w-auto text-lg font-semibold text-white rounded-xl overflow-hidden shadow-2xl transition-all duration-75 ease-in-out hover:scale-105 active:scale-95 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Investing Today
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>

              <Link href="/shop">
                <button
                  className="px-10 py-5 w-full sm:w-auto text-lg font-semibold text-cyan-400 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm transition-all duration-75 ease-in-out hover:border-cyan-500 hover:bg-cyan-500/20 active:scale-95 hover:scale-105"
                >
                  Shop with Earning
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
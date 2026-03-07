import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { Star, ShoppingCart, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart, cartCount } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (id) {
      loadProduct(id as string);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await productService.getProduct(productId);
      setProduct(data);
      if (data?.images?.length > 0) {
        setSelectedImage(data.images[0]);
      } else if (data?.image_url) {
        setSelectedImage(data.image_url);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Error",
        description: "Product not found or failed to load.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      productName: product.product_name || product.name,
      price: parseFloat(product.price),
      quantity: 1,
      vendorId: product.vendor_id,
      vendorName: product.vendors?.business_name || "Vendor",
      imageUrl: selectedImage,
      sku: product.sku,
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.product_name || product.name} added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const price = parseFloat(String(product.price ?? 0));
  const mrp = parseFloat(String((product as any).mrp ?? price));
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // We hide the source platform by standardizing the reviewer display
  const reviews = (product as any).product_aggregated_reviews || [];

  return (
    <>
      {/* 
        This is the "SEO Agency" feature at work. 
        It uses the auto-generated SEO titles and descriptions from the Sync Engine
        to ensure this product page ranks highly on Google.
      */}
      <SEO 
        title={product.seo_title || `${product.product_name} - Brave Ecom Mall`} 
        description={product.seo_description || product.description} 
        image={selectedImage}
      />

      {/* Persistent Product Header with Scroll Effect */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800" 
          : "bg-white dark:bg-slate-900 border-b border-transparent"
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/shop" className="flex items-center text-sm font-medium hover:text-cyan-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
          <Link href="/shop/cart">
            <Button variant="outline" className="relative h-10 px-3 md:px-4">
              <ShoppingCart className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Cart</span>
              {(cartCount || 0) > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-cyan-500 flex items-center justify-center min-w-[20px] h-5 px-1">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-10">
              
              {/* Left Column: Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center p-4">
                  {selectedImage ? (
                    <img src={selectedImage} alt={product.product_name} loading="lazy" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  ) : (
                    <span className="text-slate-400">No Image Available</span>
                  )}
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden bg-slate-100 dark:bg-slate-800 p-1 ${selectedImage === img ? 'border-cyan-500' : 'border-transparent hover:border-slate-300'}`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Product Info */}
              <div className="flex flex-col">
                <div className="mb-2">
                  <Badge variant="secondary" className="mb-2 text-cyan-700 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400 hover:bg-cyan-100">
                    {product.category || "General"}
                  </Badge>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    {product.product_name || product.name}
                  </h1>
                  <p className="text-slate-500 mt-2 text-sm">
                    Sold by <span className="font-semibold text-slate-700 dark:text-slate-300">{product.vendors?.business_name || "Verified Vendor"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3 mb-6">
                  <div className="flex items-center text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-5 h-5 ${star <= Math.round(parseFloat(product.aggregated_rating || 0)) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-lg font-medium ml-1">{parseFloat(product.aggregated_rating || 0).toFixed(1)}</span>
                  <span className="text-sm text-slate-500 underline decoration-dotted underline-offset-4 cursor-pointer hover:text-cyan-600">
                    {product.review_count || reviews.length} verified ratings
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 mb-8">
                  {discount > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-500 font-bold text-lg">-{discount}%</span>
                      <span className="text-slate-500 line-through text-sm">₹{mrp.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-slate-500 mb-1">+15% platform fee</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Inclusive of all taxes</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Truck className="w-5 h-5 text-cyan-500" />
                    <span>Free delivery on orders over ₹500</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>10 Days Replacement Guarantee (No Commission)</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-semibold bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20"
                    onClick={handleAddToCart}
                    disabled={(product.stock_quantity ?? (product as any).stock ?? 0) <= 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {(product.stock_quantity ?? (product as any).stock ?? 0) > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  {(product.stock_quantity ?? (product as any).stock ?? 0) > 0 && (
                    <p className="text-center mt-3 text-sm text-emerald-600 font-medium">
                      In Stock. Ships usually within 24 hours.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Listings & Reviews Tabs */}
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-10">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 rounded-none bg-transparent p-0 mb-6 h-auto">
                <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3 text-base">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3 text-base">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none px-6 py-3 text-base">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <div dangerouslySetInnerHTML={{ __html: product.description || product.product_description || "No description provided." }} />
              </TabsContent>
              
              <TabsContent value="specifications">
                {product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex border-b border-slate-100 dark:border-slate-800 py-3">
                        <span className="w-1/3 font-medium text-slate-900 dark:text-slate-200 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="w-2/3 text-slate-600 dark:text-slate-400">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No detailed specifications available for this product.</p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                            ))}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white ml-2">{review.reviewer_name || "Verified Buyer"}</span>
                          {/* CRITICAL: We DO NOT display review.source_platform here as requested */}
                          <Badge variant="outline" className="ml-2 text-xs font-normal text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
                            Verified Purchase
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                          {review.review_date ? formatDistanceToNow(new Date(review.review_date), { addSuffix: true }) : "Recently"}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {review.review_text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No reviews yet</h3>
                    <p className="text-slate-500">Be the first to review this product after purchase.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </div>
    </>
  );
}
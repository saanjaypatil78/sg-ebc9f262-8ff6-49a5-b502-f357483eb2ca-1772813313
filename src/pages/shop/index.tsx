import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Filter, Star } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Books",
  "Toys",
];

export default function ShopPage() {
  const { addToCart, cartCount } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory && p.product_status === "active";
  });

  return (
    <>
      <SEO title="Shop - Brave Ecom Mall" description="Browse our marketplace" />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                  Brave Ecom Mall
                </h1>
              </Link>

              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <Link href="/shop/cart">
                <Button variant="outline" className="relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-cyan-500">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Categories */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={
                  selectedCategory === cat
                    ? "bg-cyan-500 hover:bg-cyan-600"
                    : ""
                }
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading products...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <Link href={`/shop/product/${product.id}`}>
                    <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      {product.images?.[0] || product.image_url ? (
                        <img
                          src={product.images?.[0] || product.image_url}
                          alt={product.product_name || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
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

                  <CardContent className="pt-4">
                    <Link href={`/shop/product/${product.id}`}>
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 hover:text-cyan-500">
                        {product.product_name || product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      by {product.vendors?.business_name || "Vendor"}
                    </p>

                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.5</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        (128)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          ₹{parseFloat(product.price).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-slate-500">
                          +15% platform fee
                        </p>
                      </div>

                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity <= 0}
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
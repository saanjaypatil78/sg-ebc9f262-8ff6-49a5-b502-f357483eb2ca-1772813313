import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Star, FilterX, Menu, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { useRouter } from "next/router";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports",
  "Books",
  "Toys",
];

export default function ShopPage() {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("featured");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      
      // Calculate max price for the slider automatically based on loaded products
      if (data.length > 0) {
        const highestPrice = Math.max(...data.map((p: any) => parseFloat(p.price || 0)));
        const roundedMax = Math.ceil(highestPrice / 1000) * 1000; // Round up to nearest thousand
        setMaxPrice(roundedMax > 0 ? roundedMax : 100000);
        setPriceRange([0, roundedMax > 0 ? roundedMax : 100000]);
      }
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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange([0, maxPrice]);
  };

  const filteredProducts = products.filter((p) => {
    const pPrice = parseFloat(p.price || 0);
    const name = String(p.product_name || p.name || "");
    const description = String(p.product_description || p.description || "");
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesPrice = pPrice >= priceRange[0] && pPrice <= priceRange[1];
      
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Categories</h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 font-medium"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Price Range</h3>
        <Slider
          defaultValue={[0, maxPrice]}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="my-4"
        />
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
          <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price || 0);
    const priceB = parseFloat(b.price || 0);
    
    switch (sortBy) {
      case "price_asc":
        return priceA - priceB;
      case "price_desc":
        return priceB - priceA;
      case "newest":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "rating_desc":
        return parseFloat(b.aggregated_rating || 4.5) - parseFloat(a.aggregated_rating || 4.5);
      default: // featured
        return 0;
    }
  });

  return (
    <>
      <SEO title="Shop - Brave Ecom Mall" description="Browse our marketplace" />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header with Scroll Effect */}
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800" 
            : "bg-white dark:bg-slate-900 border-b border-transparent"
        }`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] animate-in slide-in-from-left duration-300">
                    <SheetHeader className="mb-6 text-left">
                      <SheetTitle className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                        Brave Ecom
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4">
                      <Link href="/" className="text-lg font-medium hover:text-cyan-500 transition-colors">Home</Link>
                      <Link href="/dashboard/client" className="text-lg font-medium hover:text-cyan-500 transition-colors">My Account</Link>
                      <Link href="/shop/cart" className="text-lg font-medium hover:text-cyan-500 transition-colors flex justify-between">
                        Cart 
                        {cartCount > 0 && <Badge className="bg-cyan-500">{cartCount}</Badge>}
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>

                <Link href="/shop">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent truncate">
                    Brave Ecom Mall
                  </h1>
                </Link>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:block flex-1 max-w-2xl px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-900 w-full"
                  />
                </div>
              </div>

              {/* Cart */}
              <Link href="/shop/cart" className="flex-shrink-0">
                <Button variant="outline" className="relative h-10 px-3 md:px-4">
                  <ShoppingCart className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline">Cart</span>
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-cyan-500 flex items-center justify-center min-w-[20px] h-5 px-1">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Search */}
            <div className="mt-3 lg:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-900 w-full h-10"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters - Desktop Only */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
              <Card className="sticky top-24">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                      <FilterX className="w-3 h-3 mr-1" /> Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center justify-between w-full lg:w-auto">
                  <div className="text-sm text-slate-500">
                    Showing {sortedProducts.length} product{sortedProducts.length !== 1 && "s"}
                  </div>
                  
                  {/* Mobile Filters Trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="w-4 h-4 mr-2" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] overflow-y-auto animate-in slide-in-from-right duration-300">
                      <SheetHeader className="pb-4 border-b mb-4 flex flex-row items-center justify-between space-y-0">
                        <SheetTitle>Filters</SheetTitle>
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                          <FilterX className="w-3 h-3 mr-1" /> Reset
                        </Button>
                      </SheetHeader>
                      <FilterContent />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                    Loading products...
                  </p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-600 dark:text-slate-400">
                    No products found matching your filters.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
                    >
                      <Link href={`/shop/product/${product.id}`} className="block">
                        <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden group">
                          {product.images?.[0] || product.image_url ? (
                            <img
                              src={product.images?.[0] || product.image_url}
                              alt={product.product_name || product.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                      <CardContent className="pt-4 flex-1 flex flex-col">
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
                          <span className="text-sm font-medium">
                            {parseFloat(product.aggregated_rating || 4.5).toFixed(1)}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            ({product.review_count || Math.floor(Math.random() * 200) + 15})
                          </span>
                        </div>

                        <div className="mt-auto pt-4 flex items-end justify-between">
                          <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                              ₹{parseFloat(product.price).toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-slate-500">
                              +15% platform fee
                            </p>
                          </div>

                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity <= 0}
                            className="bg-cyan-500 hover:bg-cyan-600 transition-colors"
                          >
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
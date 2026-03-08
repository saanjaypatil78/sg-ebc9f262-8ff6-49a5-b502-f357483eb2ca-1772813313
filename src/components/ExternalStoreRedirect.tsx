import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SPONSORS = [
  { name: "Apple" },
  { name: "Google" },
  { name: "Microsoft" },
  { name: "Amazon" },
  { name: "Samsung" },
  { name: "Nike" },
  { name: "Coca-Cola" },
  { name: "Toyota" },
  { name: "Unilever" },
  { name: "IBM" },
];

interface ExternalStoreRedirectProps {
  title?: string;
  description?: string;
}

export function ExternalStoreRedirect({ 
  title = "Store", 
  description = "Visit our official store for shopping." 
}: ExternalStoreRedirectProps) {
  const [isFlashing, setIsFlashing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlashing(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleStoreRedirect = () => {
    const storeUrl = process.env.NEXT_PUBLIC_EXTERNAL_STORE_URL;
    
    if (storeUrl) {
      window.open(storeUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("Store is currently unavailable. Please contact support.");
    }
  };

  return (
    <>
      <SEO title={`${title} - Brave Ecom`} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Main Store Redirect Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {title}
                </CardTitle>
                <CardDescription className="text-slate-400 text-lg">
                  {description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center space-y-6">
                <p className="text-slate-300 max-w-2xl mx-auto">
                  We've partnered with leading e-commerce platforms to bring you the best shopping experience. 
                  Click below to visit our official store with secure payments and fast delivery.
                </p>

                <motion.div
                  animate={{ 
                    scale: isFlashing ? 1.05 : 1,
                    boxShadow: isFlashing 
                      ? "0 0 40px rgba(34, 211, 238, 0.6)" 
                      : "0 0 20px rgba(34, 211, 238, 0.3)"
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Button
                    size="lg"
                    onClick={handleStoreRedirect}
                    className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-2xl"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Visit Our Store
                  </Button>
                </motion.div>

                <p className="text-xs text-slate-500">
                  Opens in a new tab • Secure checkout with PhonePe integration
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sponsors Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold text-slate-200">
                  Our Global Partners
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Trusted by world-leading brands
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {SPONSORS.map((sponsor, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 text-center hover:bg-slate-800/50 transition-colors"
                    >
                      <p className="text-sm font-semibold text-slate-300">{sponsor.name}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
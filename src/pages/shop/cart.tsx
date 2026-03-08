import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { EXTERNAL_STORE_LINKS } from "@/lib/externalStore";

export default function CartRedirectPage() {
  const primary = EXTERNAL_STORE_LINKS[0];
  const hasUrl = Boolean(primary?.url);

  return (
    <>
      <SEO title="Cart - Brave Ecom" description="Cart is hosted externally" />
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <Card className="bg-slate-900/50 border-white/10">
            <CardContent className="p-8 space-y-4">
              <h1 className="text-2xl font-bold">Cart</h1>
              <p className="text-slate-300">
                Cart and checkout are hosted on our external store.
              </p>

              <a href={hasUrl ? primary.url : undefined} target="_blank" rel="noreferrer">
                <Button
                  disabled={!hasUrl}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 animate-pulse"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {hasUrl ? "Open Store" : "Set NEXT_PUBLIC_EXTERNAL_STORE_URL"}
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXTERNAL_STORE_LINKS, SPONSORS } from "@/lib/externalStore";
import { ExternalLink, ShieldCheck } from "lucide-react";

export interface ExternalStoreRedirectProps {
  title?: string;
  description?: string;
}

export function ExternalStoreRedirect(props: ExternalStoreRedirectProps) {
  const primary = EXTERNAL_STORE_LINKS[0];
  const hasUrl = Boolean(primary?.url);

  return (
    <>
      <SEO title={`${props.title || "Store"} - Brave Ecom`} description={props.description || "Our store is hosted externally"} />
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4 py-14 max-w-5xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{props.title || "Store"}</h1>
              <p className="text-slate-300 max-w-2xl">
                {props.description ||
                  "We do not host an internal store inside this app. Click the flashing button below to continue to the official external store (Shopify/WordPress) with PhonePe integration."}
              </p>
            </div>

            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-300" />
                  Continue to External Store
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300">
                  This will open the official store in a new tab. Payments and checkout happen there.
                </p>

                <a href={hasUrl ? primary.url : undefined} target="_blank" rel="noreferrer">
                  <Button
                    disabled={!hasUrl}
                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 animate-pulse ring-2 ring-cyan-500/40"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    {hasUrl ? primary.label : "Set NEXT_PUBLIC_EXTERNAL_STORE_URL to enable"}
                  </Button>
                </a>

                <div className="text-xs text-slate-400">
                  For production, set <span className="font-mono">NEXT_PUBLIC_EXTERNAL_STORE_URL</span> in your environment.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/30 border-white/10">
              <CardHeader>
                <CardTitle>Our Sponsors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {SPONSORS.map((s) => (
                    <div
                      key={s.name}
                      className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-3 text-center"
                    >
                      <div className="text-sm font-semibold text-slate-100">{s.name}</div>
                      {s.note ? <div className="text-xs text-slate-400 mt-1">{s.note}</div> : null}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Sponsor names can be updated in <span className="font-mono">src/lib/externalStore.ts</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
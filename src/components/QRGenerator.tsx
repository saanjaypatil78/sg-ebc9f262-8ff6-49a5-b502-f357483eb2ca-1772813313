import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Download, Printer } from "lucide-react";

interface QRGeneratorProps {
  orderId?: string;
  productName?: string;
}

export function QRGenerator({ orderId = "", productName = "" }: QRGeneratorProps) {
  const [qrOrderId, setQrOrderId] = useState(orderId);
  const [qrProduct, setQrProduct] = useState(productName);
  const [generatedQR, setGeneratedQR] = useState("");

  const handleGenerateQR = () => {
    if (qrOrderId) {
      const qrCode = `QR-${qrOrderId}-${Date.now()}`;
      setGeneratedQR(qrCode);
      alert(`QR Code Generated:\n${qrCode}\n\nIn production, this would generate a scannable QR image.`);
    }
  };

  const handlePrint = () => {
    alert("Opening print dialog...\nIn production, this would print a label with:\n- QR Code\n- Order ID\n- Product name\n- Vendor info");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate vendor-printed QR codes for shipments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input
              placeholder="ORD-001"
              value={qrOrderId}
              onChange={(e) => setQrOrderId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Product Name (Optional)</Label>
            <Input
              placeholder="Product description"
              value={qrProduct}
              onChange={(e) => setQrProduct(e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerateQR}
            className="w-full bg-cyan-500 hover:bg-cyan-600"
            disabled={!qrOrderId}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Generate QR Code
          </Button>
          
          {generatedQR && (
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="w-48 h-48 bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-32 h-32 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      QR Preview
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Generated Code:</p>
                <code className="text-lg font-mono bg-white dark:bg-slate-900 px-4 py-2 rounded inline-block mt-1">
                  {generatedQR}
                </code>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Label
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
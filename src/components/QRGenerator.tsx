"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, Copy, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function QRGenerator() {
  const [orderId, setOrderId] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateQR = () => {
    if (orderId.trim()) {
      setQrGenerated(true);
    }
  };

  const downloadQR = () => {
    // In production, this would generate and download actual QR code
    alert("QR Code download functionality would be implemented here");
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-purple-400" />
          QR Code Generator
        </CardTitle>
        <CardDescription>Generate QR codes for package tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderId" className="text-slate-300">Order ID</Label>
          <div className="flex gap-2">
            <Input
              id="orderId"
              placeholder="Enter order ID..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={copyOrderId}
              variant="outline"
              size="icon"
              className="bg-slate-800/50 border-white/10 hover:bg-slate-800/70"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Button
          onClick={generateQR}
          disabled={!orderId.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Generate QR Code
        </Button>

        {qrGenerated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center p-8 bg-white rounded-lg">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-32 h-32 text-purple-600" />
              </div>
            </div>

            <Button
              onClick={downloadQR}
              variant="outline"
              className="w-full bg-slate-800/50 border-white/10 hover:bg-slate-800/70"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
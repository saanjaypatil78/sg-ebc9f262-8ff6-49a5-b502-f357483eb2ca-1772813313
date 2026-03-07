import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { referralService } from "@/services/referralService";
import { Copy, Check, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralLinkCardProps {
  userId: string;
}

export function ReferralLinkCard({ userId }: ReferralLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = referralService.getReferralLink(userId);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Brave Ecom",
          text: "Grow your wealth with 15% monthly returns!",
          url: referralLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-cyan-400" />
          Your Referral Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-slate-800 border-slate-700"
          />
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={copyToClipboard} variant="outline" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button onClick={shareLink} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong className="text-cyan-400">Your User ID:</strong> {userId}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Your User ID is your referral code. Anyone who registers with your link will be added to your network.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
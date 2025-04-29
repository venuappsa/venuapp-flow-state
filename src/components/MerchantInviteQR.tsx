
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, CheckCircle, QrCode } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MerchantInviteQRProps {
  venueId?: string;
  eventId?: string;
  title: string;
}

export default function MerchantInviteQR({ venueId, eventId, title }: MerchantInviteQRProps) {
  const [copied, setCopied] = useState(false);
  
  const type = venueId ? "venue" : "event";
  const id = venueId || eventId || "";
  
  const sharableLink = `https://venuapp.co.za/merchant-apply/${type}/${id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sharableLink)}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharableLink).then(
      () => {
        setCopied(true);
        toast({
          title: "Link Copied",
          description: "Merchant invitation link copied to clipboard",
        });
        setTimeout(() => setCopied(false), 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy link to clipboard",
          variant: "destructive",
        });
      }
    );
  };
  
  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${title.replace(/\s+/g, '-')}-Merchant-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code image has been downloaded",
    });
  };
  
  const handleShareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - Merchant Invitation`,
        text: `Become a merchant for ${title}`,
        url: sharableLink,
      })
      .then(() => {
        toast({
          title: "Shared Successfully",
          description: "Invitation has been shared",
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-venu-orange" />
          Merchant Invitation QR
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
          <img src={qrCodeUrl} alt={`QR code for merchant invitation`} className="w-48 h-48" />
        </div>
        
        <p className="text-sm text-gray-500 mb-4 text-center">
          Print this QR code on marketing materials to allow merchants to easily apply to join your {type}.
          Merchants can scan to complete the application process.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          <Button variant="outline" onClick={handleCopyLink} className="flex gap-2">
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button variant="outline" onClick={handleDownloadQR} className="flex gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleShareQR} className="flex gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

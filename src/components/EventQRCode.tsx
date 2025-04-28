
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface EventQRCodeProps {
  eventId: string;
  eventName: string;
}

export default function EventQRCode({ eventId, eventName }: EventQRCodeProps) {
  const [copied, setCopied] = useState(false);
  
  const sharableLink = `https://venuapp.co.za/events/${eventId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sharableLink)}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharableLink).then(
      () => {
        setCopied(true);
        toast({
          title: "Link Copied",
          description: "Event link copied to clipboard",
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
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${eventName.replace(/\s+/g, '-')}-QR-Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code image has been downloaded",
    });
  };
  
  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: eventName,
        text: `Check out this event: ${eventName}`,
        url: sharableLink,
      })
      .then(() => {
        toast({
          title: "Shared Successfully",
          description: "Event has been shared",
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
          <Share2 className="h-5 w-5 text-venu-orange" />
          Event QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
          <img src={qrCodeUrl} alt={`QR code for ${eventName}`} className="w-48 h-48" />
        </div>
        
        <p className="text-sm text-gray-500 mb-4 text-center">
          Share this QR code for easy access to the event page.
          Visitors can scan it to get event details and tickets.
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
          <Button onClick={handleShareEvent} className="flex gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

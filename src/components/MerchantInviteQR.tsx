
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Download, Copy, CheckCircle, QrCode, Mail, Link } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MerchantInviteQRProps {
  venueId?: string;
  eventId?: string;
  title: string;
  priceId?: string;
  priceName?: string;
}

export default function MerchantInviteQR({ 
  venueId, 
  eventId, 
  title, 
  priceId, 
  priceName 
}: MerchantInviteQRProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'link'>('qr');
  
  const type = venueId ? "venue" : "event";
  const id = venueId || eventId || "";
  
  // Create a standardized URL structure that includes pricing information
  const priceParam = priceId ? `&price=${priceId}` : '';
  const sharableLink = `https://venuapp.co.za/merchant-apply/${type}/${id}${priceParam}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(sharableLink)}`;
  
  // Format a readable shareable message
  const getShareMessage = () => {
    const priceInfo = priceName ? ` (${priceName})` : '';
    return `Apply to become a merchant for ${title}${priceInfo}`;
  };
  
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
        text: getShareMessage(),
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

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Merchant Invitation for ${title}`);
    const body = encodeURIComponent(`Hello,\n\nYou're invited to apply as a merchant for ${title}.\n\nClick here to apply: ${sharableLink}\n\nThank you!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    toast({
      title: "Email Prepared",
      description: "Email invitation is ready to send",
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'qr' | 'link')} className="mb-4">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="qr" className="flex items-center gap-1">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-1">
              <Link className="h-4 w-4" />
              Link
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="qr" className="mt-0">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex justify-center items-start">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <img 
                    src={qrCodeUrl} 
                    alt={`QR code for merchant invitation`} 
                    className="w-64 h-64 md:w-72 md:h-72"
                  />
                </div>
              </div>
              
              <div className="flex-grow space-y-4">
                {priceName && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <span className="text-sm font-medium text-blue-700">Price Plan: {priceName}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleDownloadQR} className="flex gap-2">
                    <Download className="h-4 w-4" />
                    Download QR
                  </Button>
                  <Button onClick={handleShareQR} className="flex gap-2">
                    <Share2 className="h-4 w-4" />
                    Share QR
                  </Button>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">How it works</h3>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Merchants scan this QR code or use the link to apply to your {type}</li>
                    <li>You'll receive a notification when a new application is submitted</li>
                    <li>Merchants will see the pricing and terms before applying</li>
                    <li>Upon approval, merchants can pay immediately through Venuapp</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4 mt-0">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                  <code className="text-sm whitespace-nowrap break-all font-mono text-gray-700">{sharableLink}</code>
                </div>
                
                {priceName && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded mt-4">
                    <span className="text-sm font-medium text-blue-700">Price Plan: {priceName}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full mt-4">
                  <Button variant="outline" onClick={handleCopyLink} className="flex gap-2">
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button variant="outline" onClick={handleEmailShare} className="flex gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button onClick={handleShareQR} className="flex gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="mt-0 md:mt-0">
                  <h3 className="text-sm font-medium mb-2">How it works</h3>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Share this link with merchants to apply to your {type}</li>
                    <li>You'll receive a notification when a new application is submitted</li>
                    <li>Merchants will see the pricing and terms before applying</li>
                    <li>Upon approval, merchants can pay immediately through Venuapp</li>
                    <li>You can track all applications in your merchant dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

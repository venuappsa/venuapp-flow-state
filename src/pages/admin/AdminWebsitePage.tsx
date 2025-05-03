
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, Palette, Globe, Share2, BarChart, Zap, Settings, CheckCircle, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminWebsitePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [formState, setFormState] = useState({
    siteName: "Venuapp",
    siteTagline: "Streamline your event management",
    siteDescription: "Venuapp makes it easy to manage venues, vendors, and events in one place.",
    contactEmail: "support@venuapp.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Event St, San Francisco, CA 94105",
    primaryColor: "#FF5A1F",
    secondaryColor: "#1E3A8A",
    backgroundColor: "#F9FAFB",
    textColor: "#111827",
    font: "Inter",
    favicon: "/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png",
    logo: "/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png",
    maintenanceMode: false,
    showAnnouncements: true,
    enableRegistration: true,
    googleAnalyticsId: "UA-XXXXXXXXX",
    metaTitle: "Venuapp | Event Management Platform",
    metaDescription: "Simplify event management with venue and vendor coordination in one place.",
    facebookUrl: "https://facebook.com/venuapp",
    twitterUrl: "https://twitter.com/venuapp",
    instagramUrl: "https://instagram.com/venuapp",
    linkedinUrl: "https://linkedin.com/company/venuapp",
    footerText: "© 2025 Venuapp. All rights reserved."
  });

  const handleInputChange = (name: string, value: any) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your website settings have been updated successfully."
    });
  };

  const handlePublish = () => {
    toast({
      title: "Website published",
      description: "Your website changes are now live."
    });
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Website Settings</h1>
            <p className="text-gray-500">Customize your website appearance and content</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button onClick={handlePublish}>
              <Globe className="mr-2 h-4 w-4" />
              Publish Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="px-2 py-2">
                  <Tabs 
                    defaultValue="general" 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    orientation="vertical"
                    className="w-full"
                  >
                    <TabsList className="flex flex-col h-full items-stretch justify-start space-y-1 bg-transparent p-0">
                      <TabsTrigger 
                        value="general" 
                        className="justify-start px-3 py-2 text-left"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        General
                      </TabsTrigger>
                      <TabsTrigger 
                        value="appearance" 
                        className="justify-start px-3 py-2 text-left"
                      >
                        <Palette className="h-4 w-4 mr-2" />
                        Appearance
                      </TabsTrigger>
                      <TabsTrigger 
                        value="seo" 
                        className="justify-start px-3 py-2 text-left"
                      >
                        <BarChart className="h-4 w-4 mr-2" />
                        SEO & Analytics
                      </TabsTrigger>
                      <TabsTrigger 
                        value="social" 
                        className="justify-start px-3 py-2 text-left"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Social Media
                      </TabsTrigger>
                      <TabsTrigger 
                        value="advanced" 
                        className="justify-start px-3 py-2 text-left"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Advanced
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "general" && "General Settings"}
                  {activeTab === "appearance" && "Appearance & Branding"}
                  {activeTab === "seo" && "SEO & Analytics"}
                  {activeTab === "social" && "Social Media Integration"}
                  {activeTab === "advanced" && "Advanced Settings"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "general" && "Configure basic website information"}
                  {activeTab === "appearance" && "Customize the look and feel of your website"}
                  {activeTab === "seo" && "Optimize for search engines and configure analytics"}
                  {activeTab === "social" && "Connect your social media accounts"}
                  {activeTab === "advanced" && "Advanced website configuration options"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="general" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input 
                          id="siteName" 
                          value={formState.siteName} 
                          onChange={(e) => handleInputChange("siteName", e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siteTagline">Site Tagline</Label>
                        <Input 
                          id="siteTagline" 
                          value={formState.siteTagline} 
                          onChange={(e) => handleInputChange("siteTagline", e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea 
                        id="siteDescription" 
                        value={formState.siteDescription} 
                        onChange={(e) => handleInputChange("siteDescription", e.target.value)} 
                      />
                    </div>
                    
                    <Separator />
                    <h3 className="font-medium">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input 
                          id="contactEmail" 
                          type="email" 
                          value={formState.contactEmail} 
                          onChange={(e) => handleInputChange("contactEmail", e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input 
                          id="contactPhone" 
                          value={formState.contactPhone} 
                          onChange={(e) => handleInputChange("contactPhone", e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={formState.address} 
                        onChange={(e) => handleInputChange("address", e.target.value)} 
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h3 className="font-medium">Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="primaryColor" 
                            type="color" 
                            value={formState.primaryColor} 
                            onChange={(e) => handleInputChange("primaryColor", e.target.value)} 
                            className="h-10 w-10 p-1 border"
                          />
                          <Input 
                            value={formState.primaryColor} 
                            onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="secondaryColor" 
                            type="color" 
                            value={formState.secondaryColor} 
                            onChange={(e) => handleInputChange("secondaryColor", e.target.value)} 
                            className="h-10 w-10 p-1 border"
                          />
                          <Input 
                            value={formState.secondaryColor} 
                            onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="backgroundColor" 
                            type="color" 
                            value={formState.backgroundColor} 
                            onChange={(e) => handleInputChange("backgroundColor", e.target.value)} 
                            className="h-10 w-10 p-1 border"
                          />
                          <Input 
                            value={formState.backgroundColor} 
                            onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="textColor" 
                            type="color" 
                            value={formState.textColor} 
                            onChange={(e) => handleInputChange("textColor", e.target.value)} 
                            className="h-10 w-10 p-1 border"
                          />
                          <Input 
                            value={formState.textColor} 
                            onChange={(e) => handleInputChange("textColor", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    <h3 className="font-medium">Typography</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font">Font Family</Label>
                      <Select 
                        value={formState.font} 
                        onValueChange={(value) => handleInputChange("font", value)}
                      >
                        <SelectTrigger id="font">
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    <h3 className="font-medium">Logo & Favicon</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="logo">Logo</Label>
                        <div className="flex items-center gap-4">
                          <img 
                            src={formState.logo} 
                            alt="Logo" 
                            className="h-16 w-16 object-contain border rounded p-1" 
                          />
                          <Button variant="outline">
                            Change Logo
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="favicon">Favicon</Label>
                        <div className="flex items-center gap-4">
                          <img 
                            src={formState.favicon} 
                            alt="Favicon" 
                            className="h-12 w-12 object-contain border rounded p-1" 
                          />
                          <Button variant="outline">
                            Change Favicon
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footerText">Footer Text</Label>
                      <Input 
                        id="footerText" 
                        value={formState.footerText} 
                        onChange={(e) => handleInputChange("footerText", e.target.value)} 
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="seo" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h3 className="font-medium">SEO Settings</h3>
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input 
                        id="metaTitle" 
                        value={formState.metaTitle} 
                        onChange={(e) => handleInputChange("metaTitle", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea 
                        id="metaDescription" 
                        value={formState.metaDescription} 
                        onChange={(e) => handleInputChange("metaDescription", e.target.value)} 
                      />
                    </div>
                    
                    <Separator />
                    <h3 className="font-medium">Analytics</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                      <Input 
                        id="googleAnalyticsId" 
                        value={formState.googleAnalyticsId} 
                        onChange={(e) => handleInputChange("googleAnalyticsId", e.target.value)} 
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="social" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h3 className="font-medium">Social Media Links</h3>
                    <div className="space-y-2">
                      <Label htmlFor="facebookUrl">Facebook URL</Label>
                      <Input 
                        id="facebookUrl" 
                        value={formState.facebookUrl} 
                        onChange={(e) => handleInputChange("facebookUrl", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">Twitter URL</Label>
                      <Input 
                        id="twitterUrl" 
                        value={formState.twitterUrl} 
                        onChange={(e) => handleInputChange("twitterUrl", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagramUrl">Instagram URL</Label>
                      <Input 
                        id="instagramUrl" 
                        value={formState.instagramUrl} 
                        onChange={(e) => handleInputChange("instagramUrl", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                      <Input 
                        id="linkedinUrl" 
                        value={formState.linkedinUrl} 
                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)} 
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h3 className="font-medium">System Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable maintenance mode to temporarily close your site to visitors
                        </p>
                      </div>
                      <Switch 
                        id="maintenanceMode" 
                        checked={formState.maintenanceMode} 
                        onCheckedChange={(value) => handleInputChange("maintenanceMode", value)} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showAnnouncements">Show Announcements</Label>
                        <p className="text-sm text-muted-foreground">
                          Display system announcements on your website
                        </p>
                      </div>
                      <Switch 
                        id="showAnnouncements" 
                        checked={formState.showAnnouncements} 
                        onCheckedChange={(value) => handleInputChange("showAnnouncements", value)} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableRegistration">Enable Registration</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow new users to register on your website
                        </p>
                      </div>
                      <Switch 
                        id="enableRegistration" 
                        checked={formState.enableRegistration} 
                        onCheckedChange={(value) => handleInputChange("enableRegistration", value)} 
                      />
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Save Changes</CardTitle>
                <CardDescription>
                  Apply and publish your website settings
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <Button variant="outline" onClick={handleSave}>
                  Save Draft
                </Button>
                <Button onClick={handlePublish}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save & Publish
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
}

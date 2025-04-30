import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

export default function VendorPricingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [pricingModel, setPricingModel] = useState("fixed");
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState([50]);
  const [negotiable, setNegotiable] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [availabilityMode, setAvailabilityMode] = useState("instant");
  const [leadTime, setLeadTime] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load pricing settings from localStorage for demonstration
    const storedSettings = localStorage.getItem("pricingSettings");
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        setPricingModel(settings.pricingModel || "fixed");
        setDepositRequired(settings.depositRequired || false);
        setDepositPercentage([settings.depositPercentage || 50]);
        setNegotiable(settings.negotiable || false);
        setDiscount(settings.discount || false);
        setDiscountType(settings.discountType || "percentage");
        setDiscountValue(settings.discountValue || "");
        setAvailabilityMode(settings.availabilityMode || "instant");
        setLeadTime(settings.leadTime || "");
      } catch (error) {
        console.error("Error parsing pricing settings from localStorage", error);
      }
    }
  }, []);

  const handleSave = async () => {
  if (!user) return;

  try {
    setSaving(true);

    // Update vendor profile
    const { error } = await supabase
      .from("vendor_profiles")
      .update({
        setup_stage: "pricing",
        setup_progress: 90,
        // Store pricing settings as JSON in the profile
        pricing_settings: {
          pricingModel,
          depositRequired,
          depositPercentage: depositPercentage[0],
          negotiable,
          discount,
          discountType,
          discountValue,
          availabilityMode,
          leadTime
        }
      })
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }
    
    // Store the pricing settings in localStorage for demonstration
    localStorage.setItem("pricingSettings", JSON.stringify({
      pricingModel,
      depositRequired,
      depositPercentage: depositPercentage[0],
      negotiable,
      discount,
      discountType,
      discountValue,
      availabilityMode,
      leadTime
    }));

    toast({
      title: "Pricing settings saved",
      description: "Your pricing preferences have been updated successfully"
    });

    navigate("/vendor/go-live");
  } catch (error: any) {
    console.error("Error saving pricing settings:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to save pricing settings",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

  return (
    <VendorPanelLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Set Your Pricing</h1>
        <p className="text-gray-500 mb-6">Configure your pricing model and availability settings</p>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Pricing Model</CardTitle>
            <CardDescription>Choose how you want to price your services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Label htmlFor="pricing-model">Pricing Model</Label>
              <Select value={pricingModel} onValueChange={setPricingModel}>
                <SelectTrigger id="pricing-model">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  {/* <SelectItem value="hourly">Hourly Rate</SelectItem> */}
                  {/* <SelectItem value="custom">Custom Quote</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Deposit Settings</CardTitle>
            <CardDescription>Configure deposit requirements for bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="deposit-required">Require Deposit</Label>
              <Switch id="deposit-required" checked={depositRequired} onCheckedChange={setDepositRequired} />
            </div>
            {depositRequired && (
              <div className="grid gap-4">
                <Label htmlFor="deposit-percentage">Deposit Percentage</Label>
                <Slider
                  id="deposit-percentage"
                  defaultValue={depositPercentage}
                  max={100}
                  step={10}
                  onValueChange={setDepositPercentage}
                />
                <p className="text-sm text-muted-foreground">
                  {depositPercentage}% of the total booking amount
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Negotiation & Discounts</CardTitle>
            <CardDescription>Set preferences for price negotiation and discounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="negotiable">Negotiable Prices</Label>
              <Switch id="negotiable" checked={negotiable} onCheckedChange={setNegotiable} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="discount">Offer Discounts</Label>
              <Switch id="discount" checked={discount} onCheckedChange={setDiscount} />
            </div>
            {discount && (
              <div className="space-y-2">
                <div className="grid gap-4">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger id="discount-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    placeholder="Enter discount value"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Availability Settings</CardTitle>
            <CardDescription>Configure how hosts can book your services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Label htmlFor="availability-mode">Availability Mode</Label>
              <Select value={availabilityMode} onValueChange={setAvailabilityMode}>
                <SelectTrigger id="availability-mode">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant Booking</SelectItem>
                  <SelectItem value="request">Request to Book</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4">
              <Label htmlFor="lead-time">Lead Time</Label>
              <Input
                id="lead-time"
                type="text"
                placeholder="e.g., 2 days, 1 week"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </VendorPanelLayout>
  );
}

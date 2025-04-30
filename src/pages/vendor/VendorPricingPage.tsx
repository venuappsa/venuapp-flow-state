
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Info,
  DollarSign,
  Clock,
  Brush,
} from "lucide-react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

// Pricing schema
const pricingFormSchema = z.object({
  pricingModel: z.enum(["fixed", "hourly", "package", "custom"], {
    required_error: "Please select a pricing model",
  }),
  depositRequired: z.boolean().default(false),
  depositPercentage: z.number().min(0).max(100).optional(),
  negotiable: z.boolean().default(false),
  discount: z.boolean().default(false),
  discountType: z.enum(["percentage", "fixed_amount", "none"]).optional(),
  discountValue: z.number().min(0).optional(),
  availabilityMode: z.enum(["always", "specific_days", "by_request"], {
    required_error: "Please select availability mode",
  }),
  leadTime: z.enum(["same_day", "1_day", "2_3_days", "1_week", "2_weeks", "custom"], {
    required_error: "Please select lead time",
  }),
});

export default function VendorPricingPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vendorPricing, setVendorPricing] = useState<any>(null);

  // Initialize form
  const form = useForm<z.infer<typeof pricingFormSchema>>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      pricingModel: "fixed",
      depositRequired: false,
      negotiable: false,
      discount: false,
      availabilityMode: "always",
      leadTime: "1_week",
    },
  });

  // Watch form values for conditional rendering
  const depositRequired = form.watch("depositRequired");
  const discount = form.watch("discount");

  useEffect(() => {
    // Fetch vendor pricing settings when component mounts
    const fetchVendorPricing = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // In a real app, fetch pricing from the database
        // Mock data retrieval with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we already have pricing settings for this vendor
        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("pricing_settings")
          .eq("user_id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.pricing_settings) {
          setVendorPricing(data.pricing_settings);
          
          // Populate form with existing settings
          form.reset({
            pricingModel: data.pricing_settings.pricingModel || "fixed",
            depositRequired: data.pricing_settings.depositRequired || false,
            depositPercentage: data.pricing_settings.depositPercentage,
            negotiable: data.pricing_settings.negotiable || false,
            discount: data.pricing_settings.discount || false,
            discountType: data.pricing_settings.discountType,
            discountValue: data.pricing_settings.discountValue,
            availabilityMode: data.pricing_settings.availabilityMode || "always",
            leadTime: data.pricing_settings.leadTime || "1_week",
          });
        }
      } catch (err) {
        console.error("Error fetching pricing settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorPricing();
  }, [user, form]);

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof pricingFormSchema>) => {
    if (!user) return;
    setLoading(true);

    try {
      // In a real implementation, save to Supabase
      await supabase
        .from("vendor_profiles")
        .update({
          pricing_settings: values,
          setup_stage: "golive",
          setup_progress: 75,
          last_active: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      toast({
        title: "Pricing settings saved",
        description: "Your pricing and availability preferences have been updated",
      });

      // Navigate to the next step after a short delay
      setTimeout(() => {
        navigate("/vendor/go-live");
      }, 1000);
    } catch (error) {
      console.error("Error saving pricing settings:", error);
      toast({
        title: "Error saving settings",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorPanelLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Pricing & Availability</h1>
            <p className="text-gray-600 mt-1">
              Step 3 of 4: Set your pricing options and availability
            </p>
          </div>

          <div className="flex items-center">
            <Progress
              value={75}
              className="h-2 w-40 mr-3"
              indicatorClassName="bg-blue-500"
            />
            <span className="text-sm font-medium">75% Complete</span>
          </div>
        </div>

        <Tabs defaultValue="pricing">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pricing">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing Options
            </TabsTrigger>
            <TabsTrigger value="availability">
              <Calendar className="h-4 w-4 mr-2" />
              Availability
            </TabsTrigger>
          </TabsList>
          
          <Card className="mt-6 border-t-0 rounded-tl-none rounded-tr-none">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="pricing">
                  <CardHeader>
                    <CardTitle>Pricing Options</CardTitle>
                    <CardDescription>
                      Configure how you want to price your services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="pricingModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Pricing Model</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pricing model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed Price</SelectItem>
                              <SelectItem value="hourly">Hourly Rate</SelectItem>
                              <SelectItem value="package">Package Pricing</SelectItem>
                              <SelectItem value="custom">Custom Quote</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This is your default pricing approach across all services
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="depositRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Require deposit for bookings
                              </FormLabel>
                              <FormDescription>
                                Request an upfront deposit to secure bookings
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {depositRequired && (
                        <FormField
                          control={form.control}
                          name="depositPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deposit Percentage</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  defaultValue={field.value?.toString()}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select percentage" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="10">10%</SelectItem>
                                    <SelectItem value="25">25%</SelectItem>
                                    <SelectItem value="50">50%</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="negotiable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Prices are negotiable
                              </FormLabel>
                              <FormDescription>
                                Allow hosts to negotiate prices with you
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Offer discounts
                              </FormLabel>
                              <FormDescription>
                                Provide discounts for certain bookings or time periods
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {discount && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="discountType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discount Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select discount type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="discountValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discount Value</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    defaultValue={field.value?.toString()}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select value" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5">5 {form.watch("discountType") === "percentage" ? "%" : "USD"}</SelectItem>
                                      <SelectItem value="10">10 {form.watch("discountType") === "percentage" ? "%" : "USD"}</SelectItem>
                                      <SelectItem value="15">15 {form.watch("discountType") === "percentage" ? "%" : "USD"}</SelectItem>
                                      <SelectItem value="20">20 {form.watch("discountType") === "percentage" ? "%" : "USD"}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="availability">
                  <CardHeader>
                    <CardTitle>Availability Settings</CardTitle>
                    <CardDescription>
                      Configure when you're available for bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="availabilityMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability Mode</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="always">Always Available</SelectItem>
                              <SelectItem value="specific_days">Specific Days Only</SelectItem>
                              <SelectItem value="by_request">By Request Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How you want to manage your availability
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leadTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Lead Time</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lead time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="same_day">Same Day</SelectItem>
                              <SelectItem value="1_day">1 Day Before</SelectItem>
                              <SelectItem value="2_3_days">2-3 Days Before</SelectItem>
                              <SelectItem value="1_week">1 Week Before</SelectItem>
                              <SelectItem value="2_weeks">2 Weeks Before</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How far in advance bookings must be made
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border rounded-lg p-6 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-6 w-6 text-blue-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Calendar Integration
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 mb-4">
                            Connect your external calendar to manage your availability
                            and avoid double-bookings.
                          </p>
                          <Button variant="outline">
                            Connect Calendar
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Availability Calendar</h4>
                        <p className="text-sm text-blue-700">
                          After completing onboarding, you'll be able to set up a
                          detailed availability calendar with specific dates, times,
                          and blackout periods.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>

                <CardFooter className="flex justify-between border-t pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/vendor/services")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Services
                  </Button>
                  <Button
                    type="submit"
                    className="bg-venu-orange hover:bg-venu-dark-orange"
                    disabled={loading}
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>
                        Save and Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Pricing Tips</h3>
                  <p className="text-sm text-green-700">
                    Offering flexible pricing options can help attract more bookings
                    and accommodate different types of events.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">Availability Tips</h3>
                  <p className="text-sm text-blue-700">
                    Being clear about your availability helps set client expectations
                    and reduces last-minute scheduling conflicts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Brush className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-800 mb-1">Customization</h3>
                  <p className="text-sm text-purple-700">
                    You can always customize these settings later based on
                    specific events or seasons.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorPanelLayout>
  );
}

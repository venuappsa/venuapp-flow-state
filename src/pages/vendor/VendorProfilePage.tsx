
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Upload, UserRound, CheckCircle, ChevronRight } from "lucide-react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

// Business categories for dropdown
const BUSINESS_CATEGORIES = [
  { id: "food", name: "Food & Beverages" },
  { id: "decoration", name: "Decoration & Design" },
  { id: "entertainment", name: "Entertainment" },
  { id: "equipment", name: "Equipment Rental" },
  { id: "photo", name: "Photography & Video" },
  { id: "venue", name: "Venue Services" },
  { id: "planning", name: "Event Planning" },
  { id: "staffing", name: "Staffing Solutions" },
  { id: "other", name: "Other Services" },
];

// Form schema for validation
const profileFormSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessCategory: z.string().min(1, "Please select a business category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(6, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  zipcode: z.string().min(3, "Postal/Zip code is required"),
  country: z.string().min(2, "Country is required"),
  website: z.string().url("Must be a valid URL").or(z.string().length(0)),
});

export default function VendorProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [vendorProfile, setVendorProfile] = useState<any>(null);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      businessName: "",
      businessCategory: "",
      description: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      website: "",
    },
  });

  useEffect(() => {
    // Fetch vendor profile data when component mounts
    const fetchVendorProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching vendor profile:", error);
          return;
        }

        if (data) {
          setVendorProfile(data);
          setLogoUrl(data.logo_url || null);
          
          // Populate form with existing data
          form.reset({
            businessName: data.business_name || "",
            businessCategory: data.business_category || "",
            description: data.description || "",
            contactName: data.contact_name || "",
            contactEmail: data.contact_email || "",
            contactPhone: data.contact_phone || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zipcode: data.zipcode || "",
            country: data.country || "",
            website: data.website || "",
          });
        }
      } catch (err) {
        console.error("Error in fetch operation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [user, form]);

  // Handle logo upload
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    if (!user) return;

    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_logo_${Date.now()}.${fileExt}`;
      const filePath = `vendor_logos/${fileName}`;

      // Upload to Supabase Storage (mock for now)
      // In a real implementation, you would upload to Supabase Storage
      // const { error: uploadError } = await supabase.storage
      //   .from("vendor_assets")
      //   .upload(filePath, file);

      // if (uploadError) throw uploadError;

      // Mock a successful upload with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock URL to the uploaded file
      const mockUrl = `https://example.com/mock-storage/${filePath}`;
      setLogoUrl(mockUrl);
      
      toast({
        title: "Logo uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Logo upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;
    setLoading(true);

    try {
      // Update vendor profile in the database
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          business_name: values.businessName,
          business_category: values.businessCategory,
          description: values.description,
          contact_name: values.contactName,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone,
          address: values.address,
          city: values.city,
          state: values.state,
          zipcode: values.zipcode,
          country: values.country,
          website: values.website,
          logo_url: logoUrl,
          setup_stage: "services", // Move to the next onboarding step
          setup_progress: 25, // Update progress percentage
          last_active: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your business profile has been saved",
      });

      // Navigate to the next step after a short delay
      setTimeout(() => {
        navigate("/vendor/services");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
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
            <h1 className="text-2xl md:text-3xl font-bold">Business Profile</h1>
            <p className="text-gray-600 mt-1">
              Step 1 of 4: Complete your business profile
            </p>
          </div>

          <div className="flex items-center">
            <Progress
              value={25}
              className="h-2 w-40 mr-3"
              indicatorClassName="bg-blue-500"
            />
            <span className="text-sm font-medium">25% Complete</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Add your business details to help hosts understand your services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Business Logo */}
                <div className="space-y-4">
                  <div className="font-medium">Business Logo</div>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-lg border flex items-center justify-center bg-gray-50">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Business Logo"
                          className="h-full w-full object-contain rounded-lg"
                        />
                      ) : (
                        <UserRound className="h-12 w-12 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        type="button"
                        className="relative"
                        disabled={uploading}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload Logo"}
                      </Button>
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended: Square image, at least 300x300 pixels
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="font-medium">Business Details</h3>

                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Business Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BUSINESS_CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business and services..."
                            className="resize-none min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 20 characters. Include your specialties, experience, and what makes your services unique.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="contact@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Phone Number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-medium">Business Location</h3>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Postal Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Website */}
                <div className="space-y-4">
                  <h3 className="font-medium">Online Presence</h3>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include your website URL if you have one
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Important</h4>
                    <p className="text-sm text-orange-700">
                      Your profile information will be visible to hosts on the platform. 
                      Make sure all details are accurate and professional.
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/vendor/dashboard")}
            >
              Back to Dashboard
            </Button>
            <Button
              className="bg-venu-orange hover:bg-venu-dark-orange"
              onClick={form.handleSubmit(onSubmit)}
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
        </Card>
      </div>
    </VendorPanelLayout>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { VendorService } from "@/types/vendor";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  services: z.array(
    z.object({
      title: z.string().min(2, {
        message: "Service title must be at least 2 characters.",
      }),
      description: z.string().optional(),
      category: z.string().optional(),
      duration: z.string().optional(),
      price: z.number().min(0, {
        message: "Price must be a positive number.",
      }),
      price_unit: z.string().default("per_event"),
    })
  ),
});

export default function VendorServicesPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<VendorService[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [
        {
          title: "",
          description: "",
          category: "",
          duration: "",
          price: 0,
          price_unit: "per_event",
        },
      ],
    },
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      // Since we don't have a vendor_services table yet, we'll use mock data
      const mockServices: VendorService[] = [
        {
          id: "1",
          vendor_id: user.id,
          title: "Full Event Catering",
          description: "Complete food service for your event including appetizers, main course, and desserts",
          category: "Food",
          duration: "Full day",
          price: 2500,
          price_unit: "per_event",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
          vendor_id: user.id,
          title: "Appetizers Only",
          description: "Selection of premium appetizers for your guests",
          category: "Food",
          duration: "3 hours",
          price: 1200,
          price_unit: "per_event",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Check if there are any stored services in localStorage
      const storedServices = localStorage.getItem("vendorServices");
      if (storedServices) {
        try {
          const parsedServices = JSON.parse(storedServices);
          setServices(parsedServices);
          form.reset({ services: parsedServices });
        } catch (error) {
          console.error("Error parsing stored services", error);
          setServices(mockServices);
          form.reset({ services: mockServices });
        }
      } else {
        setServices(mockServices);
        form.reset({ services: mockServices });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    }
  };

  const addService = () => {
    form.setValue("services", [
      ...form.getValues().services,
      {
        title: "",
        description: "",
        category: "",
        duration: "",
        price: 0,
        price_unit: "per_event",
      },
    ]);
  };

  const removeService = (index: number) => {
    const updatedServices = [...form.getValues().services];
    updatedServices.splice(index, 1);
    form.setValue("services", updatedServices);
  };

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    try {
      setSaving(true);

      // Since we don't have a vendor_services table yet, we'll store data in localStorage
      const servicesToSave = values.services.map((service, index) => ({
        id: services[index]?.id || `temp-${Date.now()}-${index}`,
        vendor_id: user.id,
        ...service,
        created_at: services[index]?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Save to localStorage as a temporary solution
      localStorage.setItem("vendorServices", JSON.stringify(servicesToSave));

      try {
        // Update vendor profile with only existing fields
        await supabase
          .from("vendor_profiles")
          .update({
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
      } catch (error) {
        console.error("Error with supabase update:", error);
      }

      // Store in localStorage as fallback
      localStorage.setItem("vendorSetupProgress", "75");
      localStorage.setItem("vendorSetupStage", "services");

      toast({
        title: "Services saved",
        description: "Your services have been updated successfully",
      });

      navigate("/vendor/pricing");
    } catch (error: any) {
      console.error("Error saving services:", error);
      toast({
        title: "Error",
        description: "Failed to save services",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <VendorPanelLayout>
      <div className="container max-w-4xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">List Your Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <div>
                      {field.value.map((service, index) => (
                        <div key={index} className="space-y-4 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Service #{index + 1}</h3>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeService(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Catering Service"
                                  {...form.register(`services.${index}.title`)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="100"
                                  {...form.register(`services.${index}.price`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Food & Beverage"
                                  {...form.register(`services.${index}.category`)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="2 hours"
                                  {...form.register(`services.${index}.duration`)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </div>

                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Detailed description of the service"
                                {...form.register(`services.${index}.description`)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addService}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </div>
                  )}
                />

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Services"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </VendorPanelLayout>
  );
}

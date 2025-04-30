import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
  FormDescription,
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
      const { data, error } = await supabase
        .from("vendor_services")
        .select("*")
        .eq("vendor_id", user.id);

      if (error) {
        throw error;
      }

      // Initialize form with existing services
      if (data && data.length > 0) {
        form.reset({ services: data as any });
        setServices(data as VendorService[]);
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

      // Delete existing services
      const { error: deleteError } = await supabase
        .from("vendor_services")
        .delete()
        .eq("vendor_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new services
      const servicesToInsert = values.services.map((service) => ({
        ...service,
        vendor_id: user.id,
      }));

      const { error: insertError } = await supabase
        .from("vendor_services")
        .insert(servicesToInsert);

      if (insertError) {
        throw insertError;
      }

      await updateSetupStage();

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

  const updateSetupStage = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          setup_progress: 75,
          setup_stage: "services"
        })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating setup stage:", error);
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


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "../auth/AuthLayout";

const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

export default function VendorSignupPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      // Check if vendor profile exists
      const { data: existingProfile } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("vendor_profiles")
          .update({
            business_name: formData.businessName,
            contact_name: formData.contactName,
            contact_email: formData.email,
            contact_phone: formData.phone
          })
          .eq("user_id", user.id);
        
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from("vendor_profiles")
          .insert({
            user_id: user.id,
            business_name: formData.businessName,
            contact_name: formData.contactName,
            contact_email: formData.email,
            contact_phone: formData.phone,
            status: "pending"
          });
        
        if (error) throw error;
      }
      
      toast({
        title: "Profile created!",
        description: "Your vendor profile has been created successfully."
      });
      
      // Add user to vendor role (using 'merchant' as the valid role type)
      await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          role: "merchant"
        });
        
      // Store setup progress in localStorage
      localStorage.setItem("vendorSetupProgress", "10");
      localStorage.setItem("vendorSetupStage", "welcome");
      
      navigate("/vendor/welcome");
    } catch (error: any) {
      console.error("Error creating vendor profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create vendor profile.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container relative flex flex-col items-center justify-center self-center">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create Vendor Profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your business details to get started
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
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
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Contact Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting} type="submit" className="w-full">
                  {isSubmitting ? "Submitting..." : "Create Profile"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

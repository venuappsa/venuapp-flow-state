
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BookOpen, Phone, Mail } from "lucide-react";

export default function VendorSupportPage() {
  return (
    <VendorPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Vendor Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-venu-orange" />
                Live Chat Support
              </CardTitle>
              <CardDescription>
                Connect with our support team instantly for immediate assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Available Monday to Friday, 9AM - 5PM
              </p>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-venu-orange" />
                Knowledge Base
              </CardTitle>
              <CardDescription>
                Browse our comprehensive guides and FAQs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Find answers to common questions and learn how to use all features
              </p>
              <Button variant="outline" className="w-full">Browse Articles</Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Reach out to our dedicated vendor support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-venu-orange" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-venu-orange" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">vendor-support@venuapp.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorPanelLayout>
  );
}


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black">
            Get in <span className="text-venu-orange">Touch</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions or ready to enhance your event experience? Our team is here to help.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">I am a...</label>
                  <select id="role" className="w-full rounded-md border border-input bg-transparent px-3 py-2">
                    <option value="">Please select</option>
                    <option value="user">Customer</option>
                    <option value="host">Host / Event Organizer</option>
                    <option value="merchant">Merchant / Vendor</option>
                    <option value="fetchman">Potential Fetchman</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" placeholder="Enter your message" rows={4} />
                </div>
                
                <Button type="submit" className="w-full bg-venu-orange hover:bg-venu-orange/90">Send Message</Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-3">Download our app to get started</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download size={18} />
                    <span>Download for iOS</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download size={18} />
                    <span>Download for Android</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;

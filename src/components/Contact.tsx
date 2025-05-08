
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format email content
      const emailContent = `
        Name: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Role: ${formData.role}
        Message: ${formData.message}
      `;

      // Send to server (using fetch to send to an email service)
      const response = await fetch("https://formsubmit.co/ajax/hello@venuapp.co.za", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: "Contact Form Submission - Venuapp",
          message: emailContent,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          role: "",
          message: ""
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black">
            Get in <span className="text-venu-orange">Touch</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
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
              <form className="space-y-4" onSubmit={handleSubmit} aria-labelledby="contact-form-title">
                <h3 id="contact-form-title" className="sr-only">Contact form</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      placeholder="Enter your first name" 
                      value={formData.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                      required
                      aria-label="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Enter your last name" 
                      value={formData.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                      required
                      aria-label="Last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    aria-label="Email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input 
                    id="phone" 
                    name="phone"
                    type="tel" 
                    placeholder="Enter your phone number" 
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                    aria-label="Phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">I am a...</label>
                  <select 
                    id="role" 
                    name="role"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                    value={formData.role}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    aria-label="Your role"
                  >
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
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder="Enter your message" 
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    aria-label="Your message"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-venu-orange hover:bg-venu-orange/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200 text-left">
                <p className="text-sm text-gray-600 mb-3">Download our app to get started</p>
                <div className="flex flex-col sm:flex-row justify-start gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download size={18} />
                    <span>Download for iOS (Coming Soon)</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download size={18} />
                    <span>Download for Android (Coming Soon)</span>
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

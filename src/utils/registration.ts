
import { toast } from "@/components/ui/use-toast";

export const handleRegister = async (role: string) => {
  try {
    const subject = `New ${role.charAt(0).toUpperCase() + role.slice(1)} Registration Interest`;
    const message = `New registration interest for role: ${role}`;
    
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: '4673c925-f918-401c-8e5c-9c503fa9e3a6',
        subject,
        from_name: 'Venuapp Registration',
        to: 'hello@venuapp.co.za',
        message,
      }),
    });

    toast({
      title: "Registration Interest Received",
      description: "We'll be in touch with you soon!",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to submit registration. Please try again.",
      variant: "destructive",
    });
  }
};


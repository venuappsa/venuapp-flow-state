
import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';

interface TawkToChatProps {
  propertyId?: string;
  widgetId?: string;
}

const TawkToChat = ({
  propertyId = '6590e65d07843602b800e518', // Replace with your actual Tawk.to Property ID
  widgetId = '1hllb4nln'  // Replace with your actual Widget ID
}: TawkToChatProps) => {
  const { user } = useUser();
  
  useEffect(() => {
    // Remove any existing Tawk.to script
    const existingScript = document.getElementById('tawkto-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Create and insert the new script
    const script = document.createElement('script');
    script.id = 'tawkto-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Append the script to the body
    document.body.appendChild(script);
    
    // Set visitor information if user is logged in
    if (window.Tawk_API && user) {
      window.Tawk_API.onLoad = function() {
        window.Tawk_API.setAttributes({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          id: user.id || '',
        }, function(error) {
          if (error) {
            console.error('Error setting Tawk.to visitor attributes:', error);
          }
        });
      };
    }
    
    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      if (document.getElementById('tawkto-script')) {
        document.getElementById('tawkto-script')?.remove();
      }
      
      // Remove Tawk_API and Tawk_LoadStart from the window object
      if (window.Tawk_API) {
        window.Tawk_API = undefined;
        window.Tawk_LoadStart = undefined;
      }
    };
  }, [propertyId, widgetId, user]);
  
  // No DOM elements needed, this is just for script injection
  return null;
};

export default TawkToChat;

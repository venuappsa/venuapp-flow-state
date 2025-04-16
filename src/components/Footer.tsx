
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Download } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-venu-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/868a71af-ddc3-4870-a5a0-a5720b9dc63f.png" 
                alt="Venuapp Logo" 
                className="h-14 w-auto mr-2" 
              />
              <span className="text-white text-xl font-bold">Venuapp</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Revolutionizing South Africa's live events and nightlife experience with queue-free, in-seat delivery of food, drinks, and merchandise.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.facebook.com/profile.php?id=61575012653427" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-venu-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/venuappsa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-venu-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://x.com/venuappsa" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-venu-orange transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/venuapp-south-africa/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-venu-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@venuappontiktok" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-venu-orange transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5"
                >
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                  <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                  <path d="M15 8v8a4 4 0 0 1-4 4"/>
                  <line x1="15" y1="4" x2="15" y2="12"/>
                </svg>
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800 hover:border-gray-600 flex items-center gap-2">
                <Download size={18} />
                <span>App Store (Coming Soon)</span>
              </Button>
              <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800 hover:border-gray-600 flex items-center gap-2">
                <Download size={18} />
                <span>Google Play (Coming Soon)</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">For Customers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">For Event Hosts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">For Merchants</a></li>
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">For Fetchmen</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-venu-orange transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">Press</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-venu-orange transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-venu-orange transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Venuapp. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-venu-orange transition-colors text-sm">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-venu-orange transition-colors text-sm">
                Status
              </a>
              <a href="#" className="text-gray-400 hover:text-venu-orange transition-colors text-sm">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

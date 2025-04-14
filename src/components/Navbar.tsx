
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, User, Building, ShoppingCart, Truck } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <img 
                className="h-12 w-auto" 
                src="/lovable-uploads/00295b81-909c-4b6d-b67d-6638afdd5ba3.png" 
                alt="Venuapp Logo" 
              />
              <span className="ml-2 text-2xl font-bold text-venu-black">Venuapp</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#about" className="text-venu-black hover:text-venu-orange px-3 py-2 text-sm font-medium transition-colors">About</a>
            
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-venu-black hover:text-venu-orange px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  <span>Features</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white rounded-md shadow-lg p-1 border border-gray-200 min-w-[200px]">
                  <DropdownMenuItem className="py-2">
                    <a href="#features" className="w-full flex justify-between">Main Features</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2">
                    <a href="#roles?role=user" className="w-full flex items-center">
                      <User className="mr-2 h-4 w-4 text-venu-orange" />
                      <span>For Customers</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2">
                    <a href="#roles?role=host" className="w-full flex items-center">
                      <Building className="mr-2 h-4 w-4 text-venu-orange" />
                      <span>For Event Hosts</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2">
                    <a href="#roles?role=merchant" className="w-full flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4 text-venu-orange" />
                      <span>For Merchants</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2">
                    <a href="#roles?role=fetchman" className="w-full flex items-center">
                      <Truck className="mr-2 h-4 w-4 text-venu-orange" />
                      <span>For Fetchmen</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <a href="#pricing" className="text-venu-black hover:text-venu-orange px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
            <a href="#contact" className="text-venu-black hover:text-venu-orange px-3 py-2 text-sm font-medium transition-colors">Contact</a>
            <Button className="ml-4 bg-venu-orange text-white hover:bg-venu-orange/90">
              <a href="/login">Login</a>
            </Button>
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-venu-black hover:text-venu-orange focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-venu-black hover:text-venu-orange">About</a>
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-venu-black hover:text-venu-orange">Features</a>
            
            {/* Mobile submenu for user roles */}
            <div className="pl-4 border-l-2 border-gray-200 space-y-1 mt-2">
              <a href="#roles?role=user" className="block px-3 py-2 rounded-md text-sm font-medium text-venu-black hover:text-venu-orange flex items-center">
                <User className="mr-2 h-4 w-4 text-venu-orange" />
                <span>For Customers</span>
              </a>
              <a href="#roles?role=host" className="block px-3 py-2 rounded-md text-sm font-medium text-venu-black hover:text-venu-orange flex items-center">
                <Building className="mr-2 h-4 w-4 text-venu-orange" />
                <span>For Event Hosts</span>
              </a>
              <a href="#roles?role=merchant" className="block px-3 py-2 rounded-md text-sm font-medium text-venu-black hover:text-venu-orange flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4 text-venu-orange" />
                <span>For Merchants</span>
              </a>
              <a href="#roles?role=fetchman" className="block px-3 py-2 rounded-md text-sm font-medium text-venu-black hover:text-venu-orange flex items-center">
                <Truck className="mr-2 h-4 w-4 text-venu-orange" />
                <span>For Fetchmen</span>
              </a>
            </div>
            
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-venu-black hover:text-venu-orange">Pricing</a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-venu-black hover:text-venu-orange">Contact</a>
            <Button className="w-full mt-3 bg-venu-orange text-white hover:bg-venu-orange/90">
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface MobileNavMenuProps {
  onNavLink: (sectionId: string) => (e: React.MouseEvent) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function MobileNavMenu({ onNavLink, isOpen, setIsOpen }: MobileNavMenuProps) {
  const { user } = useUser();
  const navigate = useNavigate();

  const [featuresOpen, setFeaturesOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
    setFeaturesOpen(false);
  }

  // Make dropdowns touch-friendly
  return (
    <div>
      <button
        className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 focus:outline-none sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <Menu size={24} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex sm:hidden">
          <nav className="w-5/6 max-w-xs bg-white h-full shadow-xl p-6 flex flex-col animate-slide-in-right relative z-[100]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={(e) => {
                  closeMenu();
                  onNavLink("about")(e);
                }}
                className="text-left text-gray-700 hover:text-black px-2 py-2 rounded transition-colors font-medium bg-transparent"
                style={{ background: "none", border: "none" }}
              >
                About
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-black px-2 py-2 rounded transition-colors font-medium bg-transparent"
                  style={{ background: "none", border: "none" }}
                >
                  <span>Features</span>
                  <ChevronDown
                    size={20}
                    className={`ml-1 transform transition-transform ${
                      featuresOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                {featuresOpen && (
                  <div className="bg-gray-50 rounded-md mt-1 p-2 flex flex-col gap-2">
                    <Link
                      to="/features/customer"
                      onClick={closeMenu}
                      className="text-gray-700 hover:text-black px-3 py-2 rounded transition-colors text-sm"
                    >
                      Customer
                    </Link>
                    <Link
                      to="/features/merchant"
                      onClick={closeMenu}
                      className="text-gray-700 hover:text-black px-3 py-2 rounded transition-colors text-sm"
                    >
                      Merchant
                    </Link>
                    <Link
                      to="/features/fetchman"
                      onClick={closeMenu}
                      className="text-gray-700 hover:text-black px-3 py-2 rounded transition-colors text-sm"
                    >
                      Fetchman
                    </Link>
                    <Link
                      to="/features/host"
                      onClick={closeMenu}
                      className="text-gray-700 hover:text-black px-3 py-2 rounded transition-colors text-sm"
                    >
                      Host
                    </Link>
                  </div>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  closeMenu();
                  onNavLink("pricing")(e);
                }}
                className="text-left text-gray-700 hover:text-black px-2 py-2 rounded transition-colors font-medium bg-transparent"
                style={{ background: "none", border: "none" }}
              >
                Pricing
              </button>
              
              <button
                onClick={(e) => {
                  closeMenu();
                  onNavLink("contact")(e);
                }}
                className="text-left text-gray-700 hover:text-black px-2 py-2 rounded transition-colors font-medium bg-transparent"
                style={{ background: "none", border: "none" }}
              >
                Contact
              </button>
              
              <Link
                to="/subscribe"
                onClick={closeMenu}
                className="text-gray-700 hover:text-black px-2 py-2 rounded transition-colors font-medium"
              >
                Subscribe
              </Link>
              
              {!user && (
                <Link
                  to="/auth"
                  onClick={closeMenu}
                  className="bg-venu-orange text-white px-4 py-2 rounded hover:bg-venu-dark-orange transition-colors text-center mt-2"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

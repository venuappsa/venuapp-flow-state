
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu } from "lucide-react";
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
              className="absolute top-4 right-4 p-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <span className="text-lg font-bold">&times;</span>
            </button>
            <div className="flex flex-col gap-2 mt-8 [&>*]:text-left">
              <button
                className="text-gray-700 hover:text-black px-3 py-2 rounded text-base font-medium text-left"
                onClick={e => {
                  onNavLink("about")(e);
                  closeMenu();
                }}
              >
                About
              </button>
              <div>
                <button
                  className="flex items-center w-full text-gray-700 hover:text-black px-3 py-2 rounded text-base font-medium text-left"
                  onClick={() => setFeaturesOpen(f => !f)}
                  type="button"
                  aria-expanded={featuresOpen}
                  aria-controls="features-submenu"
                >
                  Features <ChevronDown className="ml-1" size={16} />
                </button>
                {featuresOpen && (
                  <div id="features-submenu" className="pl-4 flex flex-col gap-1 mt-1">
                    <Link
                      to="/customer"
                      onClick={closeMenu}
                      className="block px-2 py-2 text-gray-700 hover:text-venu-orange rounded text-sm"
                    >
                      Customer
                    </Link>
                    <Link
                      to="/merchant"
                      onClick={closeMenu}
                      className="block px-2 py-2 text-gray-700 hover:text-venu-orange rounded text-sm"
                    >
                      Merchant
                    </Link>
                    <Link
                      to="/fetchman"
                      onClick={closeMenu}
                      className="block px-2 py-2 text-gray-700 hover:text-venu-orange rounded text-sm"
                    >
                      Fetchman
                    </Link>
                    <Link
                      to="/host"
                      onClick={closeMenu}
                      className="block px-2 py-2 text-gray-700 hover:text-venu-orange rounded text-sm"
                    >
                      Host
                    </Link>
                  </div>
                )}
              </div>
              <button
                className="text-gray-700 hover:text-black px-3 py-2 rounded text-base font-medium text-left"
                onClick={e => {
                  onNavLink("pricing")(e);
                  closeMenu();
                }}
              >
                Pricing
              </button>
              <button
                className="text-gray-700 hover:text-black px-3 py-2 rounded text-base font-medium text-left"
                onClick={e => {
                  onNavLink("contact")(e);
                  closeMenu();
                }}
              >
                Contact
              </button>
              <Link
                to="/subscribe"
                onClick={closeMenu}
                className="block px-3 py-2 rounded text-base text-gray-700 hover:text-black font-medium"
              >
                Subscribe
              </Link>
              {!user && (
                <Button
                  asChild
                  className="w-full mt-3 text-base"
                  variant="secondary"
                  onClick={closeMenu}
                >
                  <Link to="/auth">Login</Link>
                </Button>
              )}
              {user && (
                <Button
                  variant="outline"
                  onClick={() => {
                    closeMenu();
                    navigate("/auth");
                  }}
                  className="w-full mt-3 text-base"
                >
                  Logout
                </Button>
              )}
            </div>
          </nav>
          {/* Click overlay to close */}
          <div
            className="flex-1"
            onClick={closeMenu}
            aria-label="Close menu overlay"
            tabIndex={-1}
          />
        </div>
      )}
    </div>
  );
}


import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecurePanelButton from "@/components/SecurePanelButton";
import { useUser } from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HostHeader() {
  const { user } = useUser();
  
  const displayName = user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.email?.split("@")[0] || 
    "Host";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16 flex items-center px-4">
      <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-venu-orange">
            Venuapp Host
          </h1>
          <span className="bg-venu-orange/10 text-venu-orange text-xs px-2 py-1 rounded">
            Host
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 text-sm">
                <h3 className="font-medium mb-2">Notifications</h3>
                <p className="text-gray-500">No new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <SecurePanelButton showWelcome />
        </div>
      </div>
    </header>
  );
}

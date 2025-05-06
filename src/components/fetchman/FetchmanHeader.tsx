
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";
import SecurePanelButton from "@/components/SecurePanelButton";
import { Link } from "react-router-dom"; 

export default function FetchmanHeader() {
  const { user } = useUser();
  
  const displayName = user?.user_metadata?.name || 
    user?.email?.split("@")[0] || 
    "Fetchman";

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-medium text-xl flex items-center">
            <span className="hidden md:inline text-venu-orange">Venu</span>
            <span className="md:inline">Fetchman</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            <span className="text-sm text-gray-500 mr-2">Welcome, {displayName}</span>
            {/* Admin deep link for user management - only visible for admins */}
            {user?.app_metadata?.roles?.includes("admin") && (
              <Link to={`/admin/users?userId=${user.id}`}>
                <Button variant="ghost" size="sm" className="text-xs">
                  Manage Account
                </Button>
              </Link>
            )}
          </div>
          <Separator orientation="vertical" className="hidden md:inline h-6" />
          <SecurePanelButton />
        </div>
      </div>
    </header>
  );
}

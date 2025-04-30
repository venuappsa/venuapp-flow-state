
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col items-center mb-6">
        <Link to="/">
          <img
            src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
            alt="Venuapp Logo"
            className="h-16 w-16 object-contain"
          />
        </Link>
        <h1 className="text-2xl font-bold mt-2 text-venu-orange">Venuapp</h1>
      </div>

      <Outlet />

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Venuapp. All rights reserved.</p>
      </div>
    </div>
  );
}

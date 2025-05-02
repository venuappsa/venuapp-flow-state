
import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        {title && <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>}
        {description && <p className="text-gray-500 text-center mb-6">{description}</p>}
        {children}
      </div>
    </div>
  );
}

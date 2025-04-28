
import React from "react";

interface RedirectLoaderOverlayProps {
  message?: string;
}

const RedirectLoaderOverlay: React.FC<RedirectLoaderOverlayProps> = ({
  message = "Redirecting you to your panel...",
}) => (
  <div className="fixed inset-0 z-[1000] w-screen h-screen bg-gray-50 flex items-center justify-center transition-opacity duration-300 ease-in-out animate-in fade-in">
    <div className="flex flex-col items-center gap-4">
      <span className="animate-spin rounded-full border-4 border-venu-orange border-t-transparent w-12 h-12 mb-4" />
      <span className="text-gray-400 text-xl font-semibold">
        {message}
      </span>
    </div>
  </div>
);

export default RedirectLoaderOverlay;

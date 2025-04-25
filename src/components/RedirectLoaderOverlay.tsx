
import React from "react";

/**
 * Shows a full-page overlay loader used during redirects.
 * @param message - The main loading message.
 */
const RedirectLoaderOverlay = ({
  message = "Redirecting you to your panel...",
}: {
  message?: string;
}) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 transition-none">
    <span className="animate-spin rounded-full border-4 border-venu-orange border-t-transparent w-12 h-12 mb-6" />
    <span className="text-venu-orange mb-2 font-bold text-xl">{message}</span>
    <span className="text-gray-500">Please wait</span>
  </div>
);

export default RedirectLoaderOverlay;

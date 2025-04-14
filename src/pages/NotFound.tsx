
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4 sm:px-6 lg:px-8 max-w-md">
        <h1 className="text-6xl font-extrabold text-venu-orange mb-6">404</h1>
        <p className="text-2xl font-bold text-venu-black mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button className="bg-venu-orange hover:bg-venu-orange/90 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

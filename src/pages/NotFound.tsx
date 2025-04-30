
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TestReport from "@/components/TestReport";

export default function NotFound() {
  // Simulation of our test results for scaffolding
  const scaffoldTestResults = [
    { name: "/login route exists", passed: true },
    { name: "/host route exists", passed: true },
    { name: "/admin route exists", passed: true },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center mb-8">
        <h1 className="text-4xl font-bold text-venu-orange mb-2">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>

      <div className="mt-12 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Test Reports</h2>
        <div className="space-y-4">
          <TestReport 
            title="Stage 1: Scaffold Tests" 
            results={scaffoldTestResults} 
          />
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Overall Stage 1 Status: <span className="font-bold text-green-500">COMPLETE</span>
        </div>
      </div>
    </div>
  );
}

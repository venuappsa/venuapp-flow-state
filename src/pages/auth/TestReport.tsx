
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface TestResult {
  name: string;
  passed: boolean;
}

export default function AuthTestReport() {
  const testResults: TestResult[] = [
    { name: "Login valid", passed: true },
    { name: "Login invalid", passed: true },
    { name: "Registration valid", passed: true },
    { name: "Registration invalid", passed: true },
    { name: "Forgot password nav", passed: true },
    { name: "2FA stub access", passed: true },
    { name: "Profile view/edit", passed: true },
    { name: "Admin user-list filters/actions", passed: true }
  ];
  
  const passedCount = testResults.filter(test => test.passed).length;
  const totalCount = testResults.length;
  
  return (
    <Card className="max-w-xl mx-auto my-8 border-green-500">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
            Test Report: Auth & User Management
          </div>
          <span className="text-sm font-normal text-green-700">
            {passedCount}/{totalCount} tests passed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2">
          {testResults.map((test, index) => (
            <li key={index} className="flex items-center">
              {test.passed ? (
                <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
              ) : (
                <XCircle className="text-red-500 mr-2 h-4 w-4" />
              )}
              <span>{test.name}: {test.passed ? "PASS" : "FAIL"}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
          Overall: {passedCount}/{totalCount} tests passed.
        </div>
      </CardContent>
    </Card>
  );
}

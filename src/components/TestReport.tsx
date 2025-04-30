
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface TestResult {
  name: string;
  passed: boolean;
}

interface TestReportProps {
  title: string;
  results: TestResult[];
}

export default function TestReport({ title, results }: TestReportProps) {
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <Card className={allPassed ? "border-green-500" : "border-red-500"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          {title}
          <span className="ml-auto text-sm">
            {passedCount}/{totalCount} tests passed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {results.map((result, index) => (
            <li key={index} className="flex items-center gap-2">
              {result.passed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>{result.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { useRouteError } from "react-router-dom";
import { ErrorFallbackUI } from "@/components/ErrorFallbackUI";

export default function ErrorPage() {
  const error = useRouteError() as Error;
  
  const resetError = () => {
    window.location.href = "/";
  };
  
  return <ErrorFallbackUI error={error} resetError={resetError} />;
}


/**
 * Helper function to determine where to redirect a user based on their roles
 * This function prioritizes admin > host > vendor > customer roles
 * @param roles Array of user roles
 * @returns The path to redirect the user to
 */
export const getRedirectPageForRoles = (roles: string[]): string => {
  console.log("getRedirectPageForRoles called with roles:", roles);
  
  if (!Array.isArray(roles) || roles.length === 0) {
    console.log("No roles provided or invalid roles format, defaulting to /");
    return "/";
  }

  // Role priority: admin > host > vendor > customer
  if (roles.includes("admin")) {
    console.log("Admin role found, redirecting to admin dashboard");
    return "/admin/dashboard";
  }
  
  if (roles.includes("host")) {
    console.log("Host role found, redirecting to host dashboard");
    return "/host/dashboard";
  }
  
  if (roles.includes("merchant")) {
    console.log("Merchant role found, redirecting to vendor dashboard");
    return "/vendor/dashboard";
  }
  
  if (roles.includes("customer")) {
    console.log("Customer role found, redirecting to homepage");
    return "/";
  }
  
  // Default fallback
  console.log("No matching roles found, defaulting to homepage");
  return "/";
};


import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SidebarContextType {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  
  return (
    <SidebarContext.Provider 
      value={{ 
        isMobileMenuOpen, 
        setMobileMenuOpen,
        isCollapsed,
        setCollapsed
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  
  return context;
}

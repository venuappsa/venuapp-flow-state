
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  toggleCollapsed: () => void;
  toggleMobileMenu: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  
  // Save the collapsed state to localStorage
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState) {
      setCollapsed(savedCollapsedState === 'true');
    }
  }, []);
  
  // Update localStorage when collapsed state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);
  
  // Close mobile menu when route changes or on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  // Toggle functions for easier access
  const toggleCollapsed = () => setCollapsed(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  
  return (
    <SidebarContext.Provider 
      value={{ 
        isMobileMenuOpen, 
        setMobileMenuOpen,
        isCollapsed,
        setCollapsed,
        toggleCollapsed,
        toggleMobileMenu
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

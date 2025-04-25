
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useState } from "react";
import {
  Users,
  Activity,
  TrendingUp,
  User,
  Calendar,
  DollarSign,
  Truck,
  ChartBar,
  Bell,
  Settings,
} from "lucide-react";

const sections = [
  { key: "dashboard", label: "Dashboard & Oversight", icon: TrendingUp },
  { key: "host_vendor", label: "Host & Vendor Management", icon: Users },
  { key: "events", label: "Event & Invitation Tracking", icon: Calendar },
  { key: "billing", label: "Billing & Subscriptions", icon: DollarSign },
  { key: "payment", label: "Payment & Payout Control", icon: DollarSign },
  { key: "fetchman", label: "Fetchman Management", icon: Truck },
  { key: "reporting", label: "Reporting & Analytics", icon: ChartBar },
  { key: "notifications", label: "Notifications & CMS", icon: Bell },
  { key: "settings", label: "Platform Settings", icon: Settings },
];

type Props = {
  selected: string;
  onSelect: (key: string) => void;
};

export default function AdminSidebar({ selected, onSelect }: Props) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => (
                <SidebarMenuItem key={section.key}>
                  <SidebarMenuButton
                    isActive={selected === section.key}
                    onClick={() => onSelect(section.key)}
                  >
                    <section.icon />
                    <span>{section.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

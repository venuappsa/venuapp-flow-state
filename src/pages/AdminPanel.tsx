import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Dashboard & Oversight",
  host_vendor: "Host & Vendor Management",
  events: "Event & Invitation Tracking",
  billing: "Billing & Subscriptions",
  payment: "Payment & Payout Control",
  fetchman: "Fetchman Management",
  reporting: "Reporting & Analytics",
  notifications: "Notifications & CMS",
  settings: "Platform Settings",
};

export default function AdminPanel() {
  const { user } = useUser();
  const { data: roles, isLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("dashboard");

  useEffect(() => {
    if (!user) return navigate("/auth");
    if (!isLoading && !roles?.includes("admin")) navigate("/");
  }, [user, roles, isLoading, navigate]);

  if (!user || isLoading || !roles) return <p>Loading...</p>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar selected={selected} onSelect={setSelected} />
        <SidebarInset>
          <div className="p-8 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">
              {SECTION_LABELS[selected] || "Admin Panel"}
            </h1>
            <div className="bg-white shadow rounded p-6 min-h-[300px]">
              {selected === "dashboard" && <div>
                <p className="text-gray-600">High-level stats dashboard.</p>
                {/* Placeholder: Later, show users by role, events, revenue, etc. */}
              </div>}
              {selected === "host_vendor" && <div>
                <p className="text-gray-600">Host, Vendor, and Fetchman management section.</p>
              </div>}
              {selected === "events" && <div>
                <p className="text-gray-600">Event & Invitation tracking tools.</p>
              </div>}
              {selected === "billing" && <div>
                <p className="text-gray-600">Billing & Subscription management.</p>
              </div>}
              {selected === "payment" && <div>
                <p className="text-gray-600">Payment & payout controls.</p>
              </div>}
              {selected === "fetchman" && <div>
                <p className="text-gray-600">Fetchman (delivery staff) management.</p>
              </div>}
              {selected === "reporting" && <div>
                <p className="text-gray-600">Reporting & analytics tools.</p>
              </div>}
              {selected === "notifications" && <div>
                <p className="text-gray-600">Push announcements, CMS management.</p>
              </div>}
              {selected === "settings" && <div>
                <p className="text-gray-600">Platform settings and configuration controls.</p>
              </div>}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

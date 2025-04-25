
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import LogoutButton from "@/components/LogoutButton";
import AdminDashboard from "@/components/AdminDashboard";

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

const ADMIN_TASKS = [
  "View platform analytics and monitor real-time stats",
  "Manage hosts, vendors, and fetchman accounts",
  "Track event creation and invitations",
  "Handle billing, subscriptions, and payment controls",
  "Oversee fetchman management and payouts",
  "Review reports and analytics",
  "Send announcements and manage notifications",
  "Change system/platform settings",
];

export default function AdminPanel() {
  const { user } = useUser();
  const { data: roles, isLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("dashboard");
  // Helper to improve jump/flicker on initial load
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait till loading is complete before redirect
    if (isLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!roles?.includes("admin")) {
      navigate("/");
      return;
    }
    setReady(true); // Now safe to render
  }, [user, roles, isLoading, navigate]);

  if (!ready) return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <span className="animate-spin rounded-full border-2 border-venu-orange border-t-transparent w-8 h-8 mb-2" />
        <span className="text-gray-400 text-base font-semibold">Loading your admin portal...</span>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar selected={selected} onSelect={setSelected} />
        <SidebarInset>
          <div className="p-8 flex flex-col gap-8">
            {/* HEADER with logo and text */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                alt="Venuapp Logo"
                className="h-12 w-12 object-contain"
                style={{ borderRadius: "8px" }}
              />
              <span className="text-[2rem] md:text-[2.2rem] font-extrabold text-venu-orange tracking-tight">Venuapp</span>
              <span className="ml-2 px-2 py-1 rounded-full bg-venu-orange/10 text-venu-orange text-xs font-bold hidden sm:inline">Admin</span>
              <div className="flex-1" />
              <LogoutButton />
            </div>
            {/* Welcome Block: show on Dashboard section */}
            {selected === "dashboard" && (
              <div className="rounded-lg bg-white shadow p-6 mb-4 flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to your Admin Panel</h2>
                <p className="text-gray-600">As an <span className="text-venu-orange font-bold">admin</span>, you have access to the following actions:</p>
                <ul className="list-disc pl-6 text-gray-700 grid gap-1">
                  {ADMIN_TASKS.map((task, i) => (
                    <li key={i} className="">{task}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-white shadow rounded p-6 min-h-[300px]">
              {selected === "dashboard" && <AdminDashboard />}
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

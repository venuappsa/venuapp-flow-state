import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import LogoutButton from "@/components/LogoutButton";
import AdminDashboard from "@/components/AdminDashboard";

// Section names mapped (kept)
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

// Updated: SideFrame component (Notice Board only, no tabs or images)
function AdminSideFrame() {
  return (
    <div className="w-full md:w-[410px] bg-gradient-to-br from-[#FFF3E4] via-[#E5DEFF] to-[#D3E4FD] rounded-2xl shadow-lg border border-[#f0e6ff] flex flex-col min-h-[330px] p-0 overflow-hidden animate-fade-in">
      <div className="flex px-4 pt-4 gap-2">
        <div className="text-lg font-bold text-venu-orange/90 drop-shadow">
          Notice Board
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex-1 min-h-[220px] px-4 pb-4 flex items-center justify-center transition-all duration-300">
        <div className="w-full animate-fade-in">
          <ul className="text-base text-gray-900 list-disc ml-6 space-y-2">
            <li>⚡ Scheduled platform update: Sat 7pm</li>
            <li>🎉 New feature: Invite analytics now live</li>
            <li>🔐 Please set up 2FA for improved security</li>
            <li>❓ Questions? Contact support@venuapp.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useUser();
  const { data: roles, isLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("dashboard");
  // Helper: avoid flicker/jump by blocking ALL painting until ready
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only allow rendering if role is truly verified
    if (isLoading) return; // Block painting
    if (!user) {
      setReady(false);
      navigate("/auth", { replace: true });
      return;
    }
    if (!roles?.includes("admin")) {
      setReady(false);
      navigate("/", { replace: true });
      return;
    }
    setReady(true);
  }, [user, roles, isLoading, navigate]);

  // Strict: block ALL rendering (including app bg) until ready to completely prevent layout jump
  if (!ready)
    return (
      <div className="fixed inset-0 z-[1000] w-screen h-screen bg-gray-50 flex items-center justify-center transition-none">
        <div className="flex flex-col items-center gap-4">
          <span className="animate-spin rounded-full border-4 border-venu-orange border-t-transparent w-12 h-12 mb-4" />
          <span className="text-gray-400 text-xl font-semibold">
            Loading your admin portal...
          </span>
        </div>
      </div>
    );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar selected={selected} onSelect={setSelected} />
        <SidebarInset>
          <div className="p-8 flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-3">
              <img
                src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                alt="Venuapp Logo"
                className="h-14 w-14 object-contain drop-shadow"
                style={{ borderRadius: "10px" }}
              />
              <span className="text-[2.4rem] md:text-[2.5rem] font-extrabold text-venu-orange tracking-tight drop-shadow">
                Venuapp
              </span>
              <span className="ml-2 px-3 py-1 rounded-full bg-venu-orange/10 text-venu-orange text-sm font-bold hidden sm:inline">
                Admin
              </span>
              <div className="flex-1" />
              <LogoutButton />
            </div>
            {/* Welcome & Features Block: dashboard only */}
            {selected === "dashboard" && (
              <div className="rounded-2xl bg-white shadow-xl p-0 mb-4 flex flex-col items-stretch gap-0 md:flex-row md:gap-10">
                {/* Left: Task List */}
                <div className="flex-1 min-w-[230px] p-8 flex flex-col justify-center">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
                    Welcome to your Admin Panel
                  </h2>
                  <p className="text-gray-700 mb-3 text-base">
                    As an <span className="text-venu-orange font-bold">admin</span>, you have access to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-800 grid gap-2 text-base font-medium mb-2">
                    {ADMIN_TASKS.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </div>
                {/* Right: Wider Side Frame */}
                <div className="flex-shrink-0 flex items-center justify-center md:pr-8 pb-6 md:pb-0 w-full md:w-auto">
                  <AdminSideFrame />
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-2xl p-8 min-h-[300px]">
              {/* Section content */}
              {selected === "dashboard" && <AdminDashboard />}
              {selected === "host_vendor" && (
                <div>
                  <p className="text-gray-600">
                    Host, Vendor, and Fetchman management section.
                  </p>
                </div>
              )}
              {selected === "events" && (
                <div>
                  <p className="text-gray-600">Event & Invitation tracking tools.</p>
                </div>
              )}
              {selected === "billing" && (
                <div>
                  <p className="text-gray-600">Billing & Subscription management.</p>
                </div>
              )}
              {selected === "payment" && (
                <div>
                  <p className="text-gray-600">Payment & payout controls.</p>
                </div>
              )}
              {selected === "fetchman" && (
                <div>
                  <p className="text-gray-600">Fetchman (delivery staff) management.</p>
                </div>
              )}
              {selected === "reporting" && (
                <div>
                  <p className="text-gray-600">Reporting & analytics tools.</p>
                </div>
              )}
              {selected === "notifications" && (
                <div>
                  <p className="text-gray-600">Push announcements, CMS management.</p>
                </div>
              )}
              {selected === "settings" && (
                <div>
                  <p className="text-gray-600">Platform settings and configuration controls.</p>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}


import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import LogoutButton from "@/components/LogoutButton";
import AdminDashboard from "@/components/AdminDashboard";

// Section names mapped
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

// New: SideFrame component (local for now)
function AdminSideFrame() {
  const [tab, setTab] = useState<"image" | "notice">("image");
  return (
    <div className="w-full md:w-[310px] bg-gray-50 rounded-lg shadow border border-gray-100 flex flex-col">
      <div className="flex px-3 pt-2 gap-2">
        <button
          onClick={() => setTab("image")}
          className={`px-3 py-1 rounded-t-lg text-xs font-medium ${
            tab === "image"
              ? "bg-venu-orange text-white"
              : "bg-white text-gray-500 hover:bg-orange-100"
          } transition-colors`}
        >
          Picture
        </button>
        <button
          onClick={() => setTab("notice")}
          className={`px-3 py-1 rounded-t-lg text-xs font-medium ${
            tab === "notice"
              ? "bg-venu-orange text-white"
              : "bg-white text-gray-500 hover:bg-orange-100"
          } transition-colors`}
        >
          Notice Board
        </button>
        <div className="flex-1" />
      </div>
      <div className="flex-1 min-h-[180px] px-3 pb-3 flex items-center justify-center">
        {tab === "image" ? (
          <img
            src="/lovable-uploads/photo-1488590528505-98d2b5aba04b.jpg"
            alt="Admin Side Visual"
            className="rounded w-full h-48 object-cover shadow"
            style={{ maxWidth: 260 }}
          />
        ) : (
          <div className="w-full">
            <div className="text-sm font-semibold mb-1 text-venu-orange">
              Notice Board
            </div>
            <ul className="text-xs text-gray-800 list-disc ml-5 space-y-1">
              <li>⚡ Scheduled platform update: Sat 7pm</li>
              <li>🎉 New feature: Invite analytics live</li>
              <li>📣 Announce: Setup 2FA for security</li>
              <li>Questions? Contact support@venuapp.com</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useUser();
  const { data: roles, isLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("dashboard");
  // Helper: avoid flicker/jump by blocking first paint until ready
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoading) return; // Wait to verify role before painting ANYTHING
    // Block until user/role known, then either set ready or redirect
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (!roles?.includes("admin")) {
      navigate("/", { replace: true });
      return;
    }
    setReady(true); // Only now is it ok to render panel
  }, [user, roles, isLoading, navigate]);

  // Fix: block ALL rendering (including app bg) until ready so there's NO jump
  if (!ready)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 fixed inset-0 z-[1000] transition-none">
        <div className="flex flex-col items-center gap-2">
          <span className="animate-spin rounded-full border-2 border-venu-orange border-t-transparent w-8 h-8 mb-2" />
          <span className="text-gray-400 text-base font-semibold">
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
          <div className="p-8 flex flex-col gap-8">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                alt="Venuapp Logo"
                className="h-12 w-12 object-contain"
                style={{ borderRadius: "8px" }}
              />
              <span className="text-[2rem] md:text-[2.2rem] font-extrabold text-venu-orange tracking-tight">
                Venuapp
              </span>
              <span className="ml-2 px-2 py-1 rounded-full bg-venu-orange/10 text-venu-orange text-xs font-bold hidden sm:inline">
                Admin
              </span>
              <div className="flex-1" />
              <LogoutButton />
            </div>
            {/* Welcome & Features Block: only on dashboard */}
            {selected === "dashboard" && (
              <div className="rounded-lg bg-white shadow p-0 mb-4 flex flex-col items-stretch gap-0 md:flex-row md:gap-8">
                {/* Left: Task List */}
                <div className="flex-1 min-w-[196px] p-6 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to your Admin Panel
                  </h2>
                  <p className="text-gray-600 mb-2">
                    As an <span className="text-venu-orange font-bold">admin</span>, you have access to the following actions:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 grid gap-1 mb-2">
                    {ADMIN_TASKS.map((task, i) => (
                      <li key={i} className="">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Right: Side Frame */}
                <div className="flex-shrink-0 flex items-center justify-center md:pr-6 pb-4 md:pb-0">
                  <AdminSideFrame />
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded p-6 min-h-[300px]">
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


import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import SecurePanelButton from "@/components/SecurePanelButton";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";

export default function HostPanel() {
  return (
    <AuthTransitionWrapper requireAuth allowedRoles={["host"]}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Host Panel</h1>
          <SecurePanelButton />
        </div>
        <p>Welcome, host! (Put venue management here)</p>
      </div>
    </AuthTransitionWrapper>
  );
}

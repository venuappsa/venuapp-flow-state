
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SecurePanelButton from "@/components/SecurePanelButton";

export default function HostPanel() {
  const { user } = useUser();
  const { data: roles, isLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/auth");
    if (!isLoading && !roles?.includes("host")) navigate("/");
  }, [user, roles, isLoading, navigate]);

  if (!user || isLoading || !roles) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Host Panel</h1>
        <SecurePanelButton />
      </div>
      <p>Welcome, host! (Put venue management here)</p>
    </div>
  );
}

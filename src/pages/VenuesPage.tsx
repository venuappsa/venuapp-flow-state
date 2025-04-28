
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import VenuesTab from "@/components/host/VenuesTab";

export default function VenuesPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <VenuesTab />
      </div>
    </HostPanelLayout>
  );
}

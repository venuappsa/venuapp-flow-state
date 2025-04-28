
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import VendorsTab from "@/components/host/VendorsTab";

export default function VendorsPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <VendorsTab />
      </div>
    </HostPanelLayout>
  );
}

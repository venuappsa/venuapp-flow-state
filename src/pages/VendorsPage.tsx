
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import VendorCRM from "@/components/host/VendorCRM";

export default function VendorsPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <VendorCRM />
      </div>
    </HostPanelLayout>
  );
}

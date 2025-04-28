
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import MerchantManagement from "@/components/host/MerchantManagement";

export default function MerchantsPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <MerchantManagement />
      </div>
    </HostPanelLayout>
  );
}

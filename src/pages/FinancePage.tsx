
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import FinanceTab from "@/components/host/FinanceTab";

export default function FinancePage() {
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <FinanceTab />
      </div>
    </HostPanelLayout>
  );
}

import { ReferenciasClient } from "@/components/reference-form/referencias-client";
import { SiteHeader } from "@/components/ui/site-header";

export default function ReferenciasPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader currentPath="referencias" />
      <ReferenciasClient />
    </div>
  );
}

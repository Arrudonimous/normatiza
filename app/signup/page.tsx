import { redirect } from "next/navigation";
import { AuthPageClient } from "@/components/auth/auth-page-client";
import { SiteHeader } from "@/components/ui/site-header";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/conta");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader currentPath="home" />
      <AuthPageClient defaultMode="signup" />
    </div>
  );
}

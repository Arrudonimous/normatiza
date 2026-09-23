import { redirect } from "next/navigation";
import { AuthPageClient } from "@/components/auth/auth-page-client";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/conta");

  return <AuthPageClient defaultMode="login" />;
}

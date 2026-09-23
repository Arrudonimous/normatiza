import { AiCheckerClient } from "@/components/ai-check/ai-checker-client";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getActivePackWithQuota } from "@/lib/db/packs";

export const metadata = {
  title: "Verificador de IA",
  description: "Cole um trecho do seu trabalho e veja a chance de ele parecer gerado por IA.",
};

export default async function VerificadorIaPage() {
  const user = await getCurrentUser();
  const hasFullAccess = user
    ? user.isAdmin || Boolean(await getActivePackWithQuota(user.id))
    : false;

  return <AiCheckerClient loggedIn={Boolean(user)} hasFullAccess={hasFullAccess} />;
}

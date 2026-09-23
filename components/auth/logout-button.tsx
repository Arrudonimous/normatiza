"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className="hover:text-ink">
      Sair
    </button>
  );
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { HeaderNav } from "./header-nav";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-lg text-ink">
          Normatiza<span className="text-red">.</span>
        </Link>
        <HeaderNav user={user ? { email: user.email } : null} />
      </div>
    </header>
  );
}

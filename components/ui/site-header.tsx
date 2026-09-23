import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { LogoutButton } from "../auth/logout-button";

export async function SiteHeader({ currentPath }: { currentPath: "referencias" | "editor" }) {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg text-ink">
          Normatiza<span className="text-red">.</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm">
            <NavLink href="/referencias" active={currentPath === "referencias"}>
              Referências
            </NavLink>
            <NavLink href="/editor" active={currentPath === "editor"}>
              Editor
            </NavLink>
          </nav>
          {user && (
            <div className="flex items-center gap-3 text-sm text-ink-muted">
              <span>{user.email}</span>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`border-b-2 pb-1 transition-colors ${
        active
          ? "border-red font-medium text-ink"
          : "border-transparent text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

import Link from "next/link";

export function SiteHeader({ currentPath }: { currentPath: "referencias" | "editor" }) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg text-ink">
          Normatiza<span className="text-red">.</span>
        </Link>
        <nav className="flex gap-6 text-sm">
          <NavLink href="/referencias" active={currentPath === "referencias"}>
            Referências
          </NavLink>
          <NavLink href="/editor" active={currentPath === "editor"}>
            Editor
          </NavLink>
        </nav>
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

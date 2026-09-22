import Link from "next/link";

export function SiteHeader({ currentPath }: { currentPath: "referencias" | "editor" }) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg text-ink">
          Normatiza<span className="text-red">.</span>
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link
            href="/referencias"
            className={currentPath === "referencias" ? "text-ink" : "text-ink-muted hover:text-ink"}
          >
            Referências
          </Link>
          <Link
            href="/editor"
            className={currentPath === "editor" ? "text-ink" : "text-ink-muted hover:text-ink"}
          >
            Editor
          </Link>
        </nav>
      </div>
    </header>
  );
}

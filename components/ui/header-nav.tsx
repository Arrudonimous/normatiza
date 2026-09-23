"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../auth/logout-button";

export function HeaderNav({ user }: { user: { email: string } | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex h-9 items-center">
      <nav className="hidden h-9 items-center gap-7 text-sm sm:flex">
        <NavLinks user={user} />
      </nav>

      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center border border-rule px-3 text-sm sm:hidden"
      >
        {open ? "Fechar" : "Menu"}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 flex w-56 flex-col gap-4 border border-rule bg-paper-raised p-4 text-sm sm:hidden">
          <NavLinks user={user} stacked onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function NavLinks({
  user,
  stacked = false,
  onNavigate,
}: {
  user: { email: string } | null;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <NavLink href="/referencias" active={pathname.startsWith("/referencias")} onClick={onNavigate}>
        Referências
      </NavLink>
      <NavLink href="/editor" active={pathname.startsWith("/editor")} onClick={onNavigate}>
        Editor
      </NavLink>

      {user ? (
        <>
          <NavLink href="/conta" active={pathname.startsWith("/conta")} onClick={onNavigate}>
            Minha conta
          </NavLink>
          <span className={`text-ink-muted ${stacked ? "" : "hidden sm:inline"}`}>{user.email}</span>
          <LogoutButton />
        </>
      ) : (
        <div className={`flex items-center gap-4 ${stacked ? "mt-1 flex-col items-stretch gap-3" : ""}`}>
          <Link
            href="/login"
            onClick={onNavigate}
            className={`flex h-9 items-center text-ink-muted hover:text-ink ${stacked ? "justify-center border border-rule px-3" : ""}`}
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            onClick={onNavigate}
            className="flex h-9 items-center justify-center bg-ink px-4 text-sm font-medium text-paper-raised transition-colors hover:bg-red"
          >
            Criar conta
          </Link>
        </div>
      )}
    </>
  );
}

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex h-9 items-center border-b-2 transition-colors ${
        active
          ? "border-red font-medium text-ink"
          : "border-transparent text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "../auth/logout-button";
import { secondaryButtonClass } from "./field";

type PathKey = "home" | "referencias" | "editor" | "conta";

export function HeaderNav({
  user,
  currentPath,
}: {
  user: { email: string } | null;
  currentPath: PathKey;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <nav className="hidden items-center gap-6 text-sm sm:flex">
        <NavLinks user={user} currentPath={currentPath} />
      </nav>

      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
        className="border border-rule px-3 py-1.5 text-sm sm:hidden"
      >
        {open ? "Fechar" : "Menu"}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 flex w-56 flex-col gap-4 border border-rule bg-paper-raised p-4 text-sm sm:hidden">
          <NavLinks user={user} currentPath={currentPath} stacked onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function NavLinks({
  user,
  currentPath,
  stacked = false,
  onNavigate,
}: {
  user: { email: string } | null;
  currentPath: PathKey;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <NavLink href="/referencias" active={currentPath === "referencias"} onClick={onNavigate}>
        Referências
      </NavLink>
      <NavLink href="/editor" active={currentPath === "editor"} onClick={onNavigate}>
        Editor
      </NavLink>

      {user ? (
        <>
          <NavLink href="/conta" active={currentPath === "conta"} onClick={onNavigate}>
            Minha conta
          </NavLink>
          <span className={`text-ink-muted ${stacked ? "" : "hidden sm:inline"}`}>{user.email}</span>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login" onClick={onNavigate} className="text-ink-muted hover:text-ink">
            Entrar
          </Link>
          <Link
            href="/signup"
            onClick={onNavigate}
            className={`${secondaryButtonClass} ${stacked ? "text-center" : ""}`}
          >
            Criar conta
          </Link>
        </>
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

import type { ReactNode } from "react";

export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 text-sm ${className ?? ""}`}>
      <span className="font-medium text-ink-muted">{label}</span>
      {children}
      {error && <span className="text-xs text-red">{error}</span>}
    </label>
  );
}

export const inputClass =
  "h-10 rounded-none border border-rule bg-paper-raised px-3 text-sm text-ink outline-none focus:border-ink focus:ring-1 focus:ring-ink";

export const primaryButtonClass =
  "bg-red px-4 py-2.5 text-sm font-medium text-paper-raised shadow-[3px_3px_0_var(--ink)] transition-[box-shadow,transform,background-color] duration-100 ease-out hover:translate-x-px hover:translate-y-px hover:bg-red-dark hover:shadow-[2px_2px_0_var(--ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-red disabled:opacity-50 disabled:shadow-[3px_3px_0_var(--ink)]";

export const secondaryButtonClass =
  "border border-rule px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-ink hover:text-ink";

export const panelClass = "border border-rule bg-paper-raised p-5";

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
    <label className={`flex flex-col gap-1.5 text-sm ${className ?? ""}`}>
      <span className="font-medium text-ink-muted">{label}</span>
      {children}
      {error && <span className="text-xs text-red">{error}</span>}
    </label>
  );
}

export const inputClass =
  "rounded-none border border-rule bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-ink";

export const primaryButtonClass =
  "bg-red px-4 py-2.5 text-sm font-medium text-paper-raised hover:bg-red-dark disabled:opacity-50";

export const secondaryButtonClass =
  "border border-rule px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-ink hover:text-ink";

export const panelClass = "border border-rule bg-paper-raised p-5";

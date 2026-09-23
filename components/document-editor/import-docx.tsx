"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { secondaryButtonClass } from "../ui/field";
import type { DocumentBlock } from "@/lib/document-model";

export function ImportDocx({
  onImported,
}: {
  onImported: (blocks: DocumentBlock[], warnings: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import-docx", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não deu pra importar o arquivo.");
      onImported(data.blocks, data.warnings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não deu pra importar o arquivo.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          className="hidden"
          id="import-docx-input"
          disabled={loading}
        />
        <label
          htmlFor="import-docx-input"
          className={`w-fit cursor-pointer ${secondaryButtonClass} ${loading ? "pointer-events-none opacity-50" : ""}`}
        >
          {loading ? "Importando..." : "Importar .docx existente"}
        </label>
        <span className="text-xs text-ink-muted">
          Melhor esforço: revise o texto depois de importar.
        </span>
      </div>
      {error && <p className="text-xs text-red">{error}</p>}
    </div>
  );
}

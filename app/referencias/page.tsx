"use client";

import { useState } from "react";
import { ReferenceForm } from "@/components/reference-form/reference-form";
import { ReferenceList } from "@/components/reference-form/reference-list";
import type { Reference } from "@/lib/abnt/types";

export default function ReferenciasPage() {
  const [references, setReferences] = useState<Reference[]>([]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Gerador de referências ABNT</h1>
        <p className="mt-1 text-sm text-slate-600">
          Preencha os dados da fonte e a gente formata certinho, na ordem alfabética e com o
          título em negrito conforme a norma.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ReferenceForm onAdd={(ref) => setReferences((prev) => [...prev, ref])} />
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-slate-700">
            Referências adicionadas ({references.length})
          </h2>
          <ReferenceList
            references={references}
            onRemove={(id) => setReferences((prev) => prev.filter((r) => r.id !== id))}
          />
        </div>
      </div>
    </main>
  );
}

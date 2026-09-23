"use client";

import { useState } from "react";
import { ReferenceForm } from "@/components/reference-form/reference-form";
import { ReferenceList } from "@/components/reference-form/reference-list";
import { SiteHeader } from "@/components/ui/site-header";
import type { Reference } from "@/lib/abnt/types";

export default function ReferenciasPage() {
  const [references, setReferences] = useState<Reference[]>([]);

  return (
    <div className="min-h-screen">
      <SiteHeader currentPath="referencias" />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <header>
          <h1 className="font-serif text-2xl text-ink">Gerador de referências ABNT</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Preencha os dados da fonte e a gente formata certinho, na ordem alfabética e com o
            título em negrito conforme a norma.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ReferenceForm onAdd={(ref) => setReferences((prev) => [...prev, ref])} />
          <div className="flex flex-col gap-3 lg:border-l lg:border-rule lg:pl-8">
            <h2 className="text-sm font-medium text-ink-muted">
              Referências adicionadas ({references.length})
            </h2>
            <ReferenceList
              references={references}
              onRemove={(id) => setReferences((prev) => prev.filter((r) => r.id !== id))}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

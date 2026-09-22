"use client";

import type { DocumentMetadata } from "@/lib/document-model";
import { Field, inputClass } from "../ui/field";

export function MetadataForm({
  metadata,
  onChange,
}: {
  metadata: DocumentMetadata;
  onChange: (metadata: DocumentMetadata) => void;
}) {
  function set<K extends keyof DocumentMetadata>(key: K, value: DocumentMetadata[K]) {
    onChange({ ...metadata, [key]: value });
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-5">
      <Field label="Título do trabalho" className="col-span-2">
        <input
          className={inputClass}
          value={metadata.titulo}
          onChange={(e) => set("titulo", e.target.value)}
        />
      </Field>
      <Field label="Instituição">
        <input
          className={inputClass}
          value={metadata.instituicao}
          onChange={(e) => set("instituicao", e.target.value)}
        />
      </Field>
      <Field label="Curso">
        <input
          className={inputClass}
          value={metadata.curso}
          onChange={(e) => set("curso", e.target.value)}
        />
      </Field>
      <Field label="Autor">
        <input
          className={inputClass}
          value={metadata.autor}
          onChange={(e) => set("autor", e.target.value)}
        />
      </Field>
      <Field label="Orientador(a) (opcional)">
        <input
          className={inputClass}
          value={metadata.orientador ?? ""}
          onChange={(e) => set("orientador", e.target.value)}
        />
      </Field>
      <Field label="Cidade">
        <input
          className={inputClass}
          value={metadata.cidade}
          onChange={(e) => set("cidade", e.target.value)}
        />
      </Field>
      <Field label="Ano">
        <input
          className={inputClass}
          value={metadata.ano}
          onChange={(e) => set("ano", e.target.value)}
        />
      </Field>
    </div>
  );
}

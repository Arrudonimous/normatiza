"use client";

import { useState } from "react";
import { MetadataForm } from "@/components/document-editor/metadata-form";
import { SummaryPreview } from "@/components/document-editor/summary-preview";
import { TiptapEditor } from "@/components/document-editor/tiptap-editor";
import { ReferenceForm } from "@/components/reference-form/reference-form";
import { ReferenceList } from "@/components/reference-form/reference-list";
import { blocksToTiptapJson } from "@/lib/editor/tiptap-json";
import { emptyDocumentMetadata, type DocumentBlock } from "@/lib/document-model";
import type { Reference } from "@/lib/abnt/types";

export default function EditorPage() {
  const [metadata, setMetadata] = useState(emptyDocumentMetadata());
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);
  // Calculado só uma vez: o Tiptap é a fonte de verdade depois de montado, então isso
  // nunca deve ser recomputado a partir de `blocks` a cada render (ver TiptapEditor).
  const [initialEditorContent] = useState(() => blocksToTiptapJson([]));
  const [references, setReferences] = useState<Reference[]>([]);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const saveRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, metadata, blocks, references }),
      });
      if (!saveRes.ok) throw new Error("Não deu pra salvar o documento.");
      const { documentId: savedId } = await saveRes.json();
      setDocumentId(savedId);

      const paymentRes = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: savedId }),
      });
      if (!paymentRes.ok) throw new Error("Não deu pra gerar o link de pagamento.");
      const { checkoutUrl } = await paymentRes.json();

      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
      setExporting(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Editor do documento</h1>
        <p className="mt-1 text-sm text-slate-600">
          Monte o trabalho, adicione as referências e exporte o .docx pronto, com capa, folha
          de rosto, sumário e formatação ABNT aplicada.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <MetadataForm metadata={metadata} onChange={setMetadata} />
          <TiptapEditor initialContent={initialEditorContent} onChange={setBlocks} />

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-slate-700">Referências</h2>
            <ReferenceForm onAdd={(ref) => setReferences((prev) => [...prev, ref])} />
            <ReferenceList
              references={references}
              onRemove={(id) => setReferences((prev) => prev.filter((r) => r.id !== id))}
            />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-medium text-slate-700">Sumário</h2>
            <SummaryPreview blocks={blocks} />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-5">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {exporting ? "Preparando pagamento..." : "Exportar documento completo"}
            </button>
            <p className="text-xs text-slate-500">
              Você será redirecionado pro pagamento. Depois de confirmado, o .docx fica
              disponível pra download.
            </p>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </aside>
      </div>
    </main>
  );
}

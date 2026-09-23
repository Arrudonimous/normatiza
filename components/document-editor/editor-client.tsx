"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AiCheckPanel } from "@/components/document-editor/ai-check-panel";
import { ImportDocx } from "@/components/document-editor/import-docx";
import { MetadataForm } from "@/components/document-editor/metadata-form";
import { PricingChoice } from "@/components/document-editor/pricing-choice";
import { SummaryPreview } from "@/components/document-editor/summary-preview";
import { TiptapEditor } from "@/components/document-editor/tiptap-editor";
import { ReferenceForm } from "@/components/reference-form/reference-form";
import { ReferenceList } from "@/components/reference-form/reference-list";
import { panelClass, primaryButtonClass } from "@/components/ui/field";
import type { CurrentUser } from "@/lib/auth/client";
import { blocksToTiptapJson } from "@/lib/editor/tiptap-json";
import { emptyDocumentMetadata, type DocumentBlock } from "@/lib/document-model";
import type { Reference } from "@/lib/abnt/types";

interface PendingPrices {
  avulso: number;
  pacote: number;
  pacoteDocumentos: number;
}

interface InitialDocument {
  id: string;
  metadata: ReturnType<typeof emptyDocumentMetadata>;
  blocks: DocumentBlock[];
  references: Reference[];
}

export function EditorClient({
  initialUser,
  initialDocument,
}: {
  initialUser: CurrentUser | null;
  initialDocument?: InitialDocument | null;
}) {
  const router = useRouter();
  const [metadata, setMetadata] = useState(initialDocument?.metadata ?? emptyDocumentMetadata());
  const [blocks, setBlocks] = useState<DocumentBlock[]>(initialDocument?.blocks ?? []);
  // O Tiptap é a fonte de verdade depois de montado (ver TiptapEditor), então isso só
  // é recalculado quando `editorVersion` muda, ou seja, quando uma importação de
  // .docx substitui o conteúdo e força o editor a remontar do zero.
  const [editorContent, setEditorContent] = useState(() =>
    blocksToTiptapJson(initialDocument?.blocks ?? []),
  );
  const [editorVersion, setEditorVersion] = useState(0);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [references, setReferences] = useState<Reference[]>(initialDocument?.references ?? []);
  const [documentId, setDocumentId] = useState<string | null>(initialDocument?.id ?? null);

  const [user, setUser] = useState<CurrentUser | null>(initialUser);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [pendingPrices, setPendingPrices] = useState<PendingPrices | null>(null);
  const [payingKind, setPayingKind] = useState<"avulso" | "pacote" | null>(null);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImported(importedBlocks: DocumentBlock[], warnings: string[]) {
    setBlocks(importedBlocks);
    setEditorContent(blocksToTiptapJson(importedBlocks));
    setEditorVersion((v) => v + 1);
    setImportWarnings(warnings);
  }

  async function requestExport(docId: string, kind?: "avulso" | "pacote") {
    const res = await fetch("/api/payments/create-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: docId, ...(kind ? { kind } : {}) }),
    });

    if (res.status === 401) {
      setShowAuthPanel(true);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Não deu pra gerar o link de pagamento.");
    }

    const data = await res.json();
    if (data.freeWithPack) {
      setDownloadToken(data.downloadToken);
      return;
    }
    if (data.needsPayment) {
      setPendingPrices(data.prices);
      return;
    }
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  }

  async function handleExport() {
    setExporting(true);
    setError(null);
    setPendingPrices(null);
    setDownloadToken(null);
    try {
      const saveRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, metadata, blocks, references }),
      });
      if (!saveRes.ok) throw new Error("Não deu pra salvar o documento.");
      const { documentId: savedId } = await saveRes.json();
      setDocumentId(savedId);

      await requestExport(savedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setExporting(false);
    }
  }

  async function handleChoosePricing(kind: "avulso" | "pacote") {
    if (!documentId) return;
    setPayingKind(kind);
    setError(null);
    try {
      await requestExport(documentId, kind);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setPayingKind(null);
    }
  }

  function handleAuthenticated(authUser: CurrentUser) {
    setUser(authUser);
    setShowAuthPanel(false);
    router.refresh(); // atualiza o header (Server Component) com o e-mail logado
    handleExport();
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="font-serif text-2xl text-ink">Editor do documento</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Monte o trabalho, adicione as referências e exporte o .docx pronto, com capa, folha
          de rosto, sumário e formatação ABNT aplicada.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <MetadataForm metadata={metadata} onChange={setMetadata} />
          <ImportDocx onImported={handleImported} />
          {importWarnings.length > 0 && (
            <ul className="border border-l-4 border-rule border-l-red bg-paper-raised py-3 pl-4 pr-3 text-xs text-ink-muted">
              {importWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          <TiptapEditor key={editorVersion} initialContent={editorContent} onChange={setBlocks} />

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-ink-muted">Referências</h2>
            <ReferenceForm onAdd={(ref) => setReferences((prev) => [...prev, ref])} />
            <ReferenceList
              references={references}
              onRemove={(id) => setReferences((prev) => prev.filter((r) => r.id !== id))}
            />
          </div>
        </div>

        <aside className="flex flex-col gap-6 lg:border-l lg:border-rule lg:pl-8">
          <div className={panelClass}>
            <h2 className="mb-3 text-sm font-medium text-ink-muted">Sumário</h2>
            <SummaryPreview blocks={blocks} />
          </div>

          {user && <AiCheckPanel blocks={blocks} />}

          {downloadToken ? (
            <div className={`flex flex-col gap-2 ${panelClass}`}>
              <p className="text-sm text-ink">Pronto. Seu documento está liberado.</p>
              <a
                href={`/api/export/download?token=${downloadToken}`}
                className={`text-center ${primaryButtonClass}`}
              >
                Baixar documento formatado
              </a>
            </div>
          ) : showAuthPanel ? (
            <AuthPanel
              onAuthenticated={handleAuthenticated}
              message="Entre ou crie uma conta pra continuar. O que você já escreveu continua aqui."
            />
          ) : pendingPrices ? (
            <PricingChoice
              avulso={pendingPrices.avulso}
              pacote={pendingPrices.pacote}
              pacoteDocumentos={pendingPrices.pacoteDocumentos}
              onChoose={handleChoosePricing}
              loading={payingKind !== null}
            />
          ) : (
            <div className={`flex flex-col gap-2 ${panelClass}`}>
              <button onClick={handleExport} disabled={exporting} className={primaryButtonClass}>
                {exporting ? "Só um instante..." : "Exportar documento completo"}
              </button>
              <p className="text-xs text-ink-muted">
                {user
                  ? "Se você tiver cota de pacote, libera na hora. Senão, escolhe pagar avulso ou por pacote."
                  : "Você precisa estar logado pra exportar. Pode criar a conta na hora."}
              </p>
            </div>
          )}

          {error && <p className="text-xs text-red">{error}</p>}
        </aside>
      </div>
    </main>
  );
}

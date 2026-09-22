"use client";

import { useRef, useState } from "react";
import { formatReference, segmentsToHtml, segmentsToPlainText } from "@/lib/abnt/format-reference";
import { sortReferences } from "@/lib/abnt/sort-references";
import { REFERENCE_TYPE_LABELS, type Reference } from "@/lib/abnt/types";
import { secondaryButtonClass } from "../ui/field";

export function ReferenceList({
  references,
  onRemove,
}: {
  references: Reference[];
  onRemove: (id: string) => void;
}) {
  const sorted = sortReferences(references);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Suas referências formatadas vão aparecer aqui conforme você for adicionando.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((ref) => (
        <ReferenceItem key={ref.id} reference={ref} onRemove={() => onRemove(ref.id)} />
      ))}
    </ul>
  );
}

function ReferenceItem({
  reference,
  onRemove,
}: {
  reference: Reference;
  onRemove: () => void;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const textRef = useRef<HTMLParagraphElement>(null);
  const segments = formatReference(reference);
  const html = segmentsToHtml(segments);
  const plain = segmentsToPlainText(segments);

  async function copy() {
    try {
      const item = new ClipboardItem({
        "text/plain": new Blob([plain], { type: "text/plain" }),
        "text/html": new Blob([html], { type: "text/html" }),
      });
      await navigator.clipboard.write([item]);
      setCopyState("copied");
    } catch {
      try {
        await navigator.clipboard.writeText(plain);
        setCopyState("copied");
      } catch {
        // Sem permissão de clipboard: seleciona o texto pra copiar manualmente (Ctrl+C).
        selectText();
        setCopyState("failed");
      }
    }
    setTimeout(() => setCopyState("idle"), 2000);
  }

  function selectText() {
    const node = textRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  return (
    <li className="flex items-start justify-between gap-4 border border-rule bg-paper-raised p-4">
      <div>
        <span className="mb-1 block text-xs text-ink-muted">
          {REFERENCE_TYPE_LABELS[reference.type]}
        </span>
        <p
          ref={textRef}
          className="text-sm leading-relaxed text-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {copyState === "failed" && (
          <p className="mt-1 text-xs text-red">
            Não deu pra copiar automaticamente. Selecionamos o texto, use Ctrl+C.
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <button onClick={copy} className={secondaryButtonClass}>
          {copyState === "copied" ? "Copiado!" : "Copiar"}
        </button>
        <button onClick={onRemove} className={secondaryButtonClass}>
          Remover
        </button>
      </div>
    </li>
  );
}

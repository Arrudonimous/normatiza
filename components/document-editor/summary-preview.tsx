import type { DocumentBlock } from "@/lib/document-model";

export function SummaryPreview({ blocks }: { blocks: DocumentBlock[] }) {
  const headings = blocks.filter((b): b is Extract<DocumentBlock, { type: "heading" }> => b.type === "heading");

  if (headings.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        O sumário é gerado automaticamente conforme você adiciona títulos no editor.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {headings.map((h, i) => (
        <li
          key={i}
          className="text-sm text-slate-700"
          style={{ paddingLeft: `${(h.level - 1) * 16}px` }}
        >
          {h.text || <span className="text-slate-400">(sem título)</span>}
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
import { tiptapJsonToBlocks } from "@/lib/editor/tiptap-json";
import type { DocumentBlock } from "@/lib/document-model";

/**
 * Restringe a citação longa a um ou mais parágrafos (em vez do "block+" padrão do
 * Tiptap, que aceita qualquer bloco, inclusive títulos aninhados). Sem essa restrição,
 * alternar pra "Título" com o cursor dentro da citação cria um título aninhado que o
 * conversor pra blocos (lib/editor/tiptap-json.ts) não reconhece, perdendo conteúdo.
 * Com "paragraph+" o Enter duplo padrão do ProseMirror pra sair de um bloco (parágrafo
 * vazio + Enter de novo) continua funcionando normalmente.
 */
const CitationBlockquote = Blockquote.extend({
  content: "paragraph+",
});

/**
 * `initialContent` só é usado na criação do editor (é a fonte de verdade durante a
 * digitação é o próprio Tiptap). Pra carregar um conteúdo diferente depois de montado
 * (ex.: depois de importar um .docx), o componente pai deve forçar a remontagem com
 * uma prop `key` diferente, em vez de reaplicar o conteúdo via effect — isso evita o
 * loop clássico de reset que apaga o texto a cada tecla digitada.
 */
export function TiptapEditor({
  initialContent,
  onChange,
}: {
  initialContent: JSONContent;
  onChange: (blocks: DocumentBlock[]) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
        code: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        horizontalRule: false,
        blockquote: false,
        heading: { levels: [1, 2, 3] },
      }),
      CitationBlockquote,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(tiptapJsonToBlocks(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: "min-h-[320px] rounded-md border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          Título 1
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          Título 2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          Título 3
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Parágrafo
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Citação longa
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <p className="text-xs text-slate-400">
        Dentro da citação longa, aperte Enter duas vezes numa linha vazia pra sair dela e
        voltar ao texto normal.
      </p>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium ${
        active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

import {
  AlignmentType,
  Document,
  Header,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  TableOfContents,
  TextRun,
} from "docx";
import { ABNT_DOCUMENT_RULES } from "../abnt/constants";
import { formatReference } from "../abnt/format-reference";
import { sortReferences } from "../abnt/sort-references";
import type { Reference } from "../abnt/types";
import type { DocumentBlock, DocumentMetadata, InternalDocument } from "../document-model";

function cmToTwip(cm: number): number {
  return Math.round(cm * 566.929);
}

const FONT = ABNT_DOCUMENT_RULES.fontFamily;
const FONT_SIZE = ABNT_DOCUMENT_RULES.fontSizePt * 2; // docx usa meios-pontos
const QUOTE_FONT_SIZE = ABNT_DOCUMENT_RULES.longQuoteFontSizePt * 2;
const LINE_1_5 = { line: 360, lineRule: "auto" as const };
const LINE_SINGLE = { line: 240, lineRule: "auto" as const };
const PAGE_MARGIN = {
  top: cmToTwip(ABNT_DOCUMENT_RULES.marginTopCm),
  bottom: cmToTwip(ABNT_DOCUMENT_RULES.marginBottomCm),
  left: cmToTwip(ABNT_DOCUMENT_RULES.marginLeftCm),
  right: cmToTwip(ABNT_DOCUMENT_RULES.marginRightCm),
};

interface RunStyle {
  bold?: boolean;
  size?: number;
}

function run(text: string, extra: RunStyle = {}) {
  return new TextRun({ text, font: FONT, size: FONT_SIZE, ...extra });
}

function centered(text: string, extra: RunStyle = {}) {
  return new Paragraph({ alignment: AlignmentType.CENTER, children: [run(text, extra)] });
}

function blank() {
  return new Paragraph({ children: [] });
}

function blockToParagraph(block: DocumentBlock): Paragraph {
  if (block.type === "heading") {
    const headingLevel =
      block.level === 1 ? HeadingLevel.HEADING_1 : block.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
    return new Paragraph({
      heading: headingLevel,
      spacing: LINE_1_5,
      children: [run(block.text, { bold: true })],
    });
  }

  if (block.type === "quote") {
    return new Paragraph({
      spacing: LINE_SINGLE,
      indent: { left: cmToTwip(ABNT_DOCUMENT_RULES.longQuoteIndentCm) },
      alignment: AlignmentType.JUSTIFIED,
      children: [run(block.text, { size: QUOTE_FONT_SIZE })],
    });
  }

  return new Paragraph({
    spacing: LINE_1_5,
    indent: { firstLine: cmToTwip(1.25) },
    alignment: AlignmentType.JUSTIFIED,
    children: [run(block.text)],
  });
}

function referenceParagraph(reference: Reference): Paragraph {
  const segments = formatReference(reference);
  return new Paragraph({
    spacing: { ...LINE_SINGLE, after: 200 },
    children: segments.map((s) => run(s.text, { bold: s.bold })),
  });
}

function buildCover(meta: DocumentMetadata): Paragraph[] {
  return [
    centered(meta.instituicao.toUpperCase()),
    ...Array.from({ length: 6 }, blank),
    centered(meta.autor),
    ...Array.from({ length: 10 }, blank),
    centered(meta.titulo.toUpperCase(), { bold: true }),
    ...Array.from({ length: 10 }, blank),
    centered(meta.cidade),
    centered(meta.ano),
  ];
}

function buildTitlePage(meta: DocumentMetadata): Paragraph[] {
  const naturezaText = `Trabalho apresentado ao curso de ${meta.curso} da ${meta.instituicao} como parte dos requisitos do curso.`;

  return [
    centered(meta.autor),
    ...Array.from({ length: 6 }, blank),
    centered(meta.titulo.toUpperCase(), { bold: true }),
    ...Array.from({ length: 4 }, blank),
    new Paragraph({
      indent: { left: cmToTwip(8) },
      spacing: LINE_SINGLE,
      alignment: AlignmentType.LEFT,
      children: [run(naturezaText)],
    }),
    ...(meta.orientador
      ? [
          new Paragraph({
            indent: { left: cmToTwip(8) },
            spacing: LINE_SINGLE,
            alignment: AlignmentType.LEFT,
            children: [run(`Orientador(a): ${meta.orientador}`)],
          }),
        ]
      : []),
    ...Array.from({ length: 8 }, blank),
    centered(meta.cidade),
    centered(meta.ano),
  ];
}

export async function generateDocx(document: InternalDocument): Promise<Buffer> {
  const sortedReferences = sortReferences(document.references);

  const preTextualSection = {
    properties: { page: { margin: PAGE_MARGIN } },
    children: [
      ...buildCover(document.metadata),
      new Paragraph({ children: [], pageBreakBefore: true }),
      ...buildTitlePage(document.metadata),
      new Paragraph({
        pageBreakBefore: true,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        children: [run("SUMÁRIO", { bold: true })],
      }),
      new TableOfContents("Sumário", { hyperlink: true, headingStyleRange: "1-3" }),
    ],
  };

  const bodyParagraphs = document.blocks.map(blockToParagraph);

  const referencesParagraphs = [
    new Paragraph({
      pageBreakBefore: true,
      heading: HeadingLevel.HEADING_1,
      children: [run("REFERÊNCIAS", { bold: true })],
    }),
    ...sortedReferences.map(referenceParagraph),
  ];

  const textualSection = {
    properties: { page: { margin: PAGE_MARGIN } },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: FONT_SIZE })],
          }),
        ],
      }),
    },
    children: [...bodyParagraphs, ...referencesParagraphs],
  };

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: FONT_SIZE } },
      },
    },
    sections: [preTextualSection, textualSection],
  });

  return Packer.toBuffer(doc);
}

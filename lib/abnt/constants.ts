/** Regras de formatação ABNT (NBR 14724) aplicadas na exportação do documento final. */
export const ABNT_DOCUMENT_RULES = {
  fontFamily: "Times New Roman",
  fontSizePt: 12,
  lineSpacing: 1.5,
  marginTopCm: 3,
  marginLeftCm: 3,
  marginBottomCm: 2,
  marginRightCm: 2,
  longQuoteMinChars: 3, // linhas; citação com mais de 3 linhas vira bloco recuado
  longQuoteIndentCm: 4,
  longQuoteFontSizePt: 10,
  longQuoteLineSpacing: 1,
} as const;

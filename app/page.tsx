import Link from "next/link";
import { primaryButtonClass } from "@/components/ui/field";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <section className="border-b border-rule">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold tracking-wide text-red">
                PARA TCC, ARTIGO E TRABALHO ACADÊMICO
              </span>

              <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                Formatação ABNT sem perder um dia inteiro nisso
              </h1>

              <p className="mt-6 max-w-[54ch] text-lg leading-[1.6] text-ink-muted">
                Gere referências corretas pra livro, artigo, site, capítulo, TCC ou legislação.
                Monte o trabalho no editor ou importe um .docx que você já começou, e receba de
                volta um arquivo com capa, sumário automático e a formatação ABNT aplicada.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link href="/referencias" className={primaryButtonClass}>
                  Gerar referências de graça
                </Link>
                <Link href="/editor" className="text-sm text-ink-muted underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-ink">
                  Já tenho um documento pra importar
                </Link>
              </div>

              <p className="mt-6 text-sm text-ink-muted">
                Sem cartão pra começar. Você só paga na hora de exportar o arquivo final.
              </p>
            </div>

            <DocumentMockup />
          </div>
        </section>

        <section className="border-b border-rule bg-paper-raised">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="text-xs font-semibold tracking-wide text-red">Como funciona</span>
            <h2 className="mt-2 max-w-[40ch] font-serif text-2xl text-ink sm:text-3xl">
              Três passos, do rascunho ao arquivo pronto pra entregar
            </h2>

            <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-3">
              <Step n={1} title="Gere as referências">
                Preencha os dados de cada fonte e receba o texto formatado, ordenado
                alfabeticamente e com o título em negrito, do jeito que a norma pede.
              </Step>
              <Step n={2} title="Monte o documento">
                Escreva no editor ou importe um .docx que já começou. A capa, a folha de rosto
                e o sumário são gerados automaticamente a partir do que você escrever.
              </Step>
              <Step n={3} title="Baixe formatado">
                Pague só na hora de exportar o resultado final: um .docx pronto pra entregar,
                com a formatação ABNT já aplicada.
              </Step>
            </ol>
          </div>
        </section>

        <section className="border-b border-rule">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <ChecklistMockup />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-xs font-semibold tracking-wide text-red">O que sai no arquivo</span>
              <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
                Tudo que o professor cobra na formatação, sem você contar linha por linha
              </h2>
              <ul className="mt-8 flex flex-col gap-4 text-ink-muted">
                <ChecklistItem>Capa e folha de rosto com os dados da instituição, curso e orientador</ChecklistItem>
                <ChecklistItem>Sumário automático, gerado a partir dos títulos que você escreveu</ChecklistItem>
                <ChecklistItem>Margens 3-2-3-2 cm, espaçamento 1,5 e fonte no tamanho certo</ChecklistItem>
                <ChecklistItem>Numeração de página a partir da introdução, como a norma exige</ChecklistItem>
                <ChecklistItem>Referências ordenadas e formatadas por tipo de fonte</ChecklistItem>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-paper-raised">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="text-xs font-semibold tracking-wide text-red">Preço</span>
            <h2 className="mt-2 max-w-[44ch] font-serif text-2xl text-ink sm:text-3xl">
              Grátis até o preview. Você paga só pra baixar
            </h2>
            <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-ink-muted">
              O gerador de referências, o editor e a importação de .docx não custam nada e não
              pedem conta. Você só cria uma conta e paga na hora de baixar o documento pronto.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <PriceCard
                label="Avulso"
                price="R$ 9,90"
                description="Libera o download de um documento. Bom pra quem só tem um trabalho pra entregar esse semestre."
              />
              <PriceCard
                label="Pacote de 3"
                price="R$ 14,90"
                description="Libera 3 documentos dentro de 30 dias. Não é assinatura com cobrança automática: quando o prazo ou os documentos acabam, é só comprar outro pacote."
                highlight
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <span className="font-serif text-lg text-ink">
              Normatiza<span className="text-red">.</span>
            </span>
            <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-ink-muted">
              Formatação ABNT pra trabalhos acadêmicos, feita por Diego Arruda.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold tracking-wide text-ink-muted">Produto</span>
            <Link href="/referencias" className="text-ink-muted hover:text-ink">
              Gerador de referências
            </Link>
            <Link href="/editor" className="text-ink-muted hover:text-ink">
              Editor de documento
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold tracking-wide text-ink-muted">Empresa</span>
            <Link href="/termos" className="text-ink-muted hover:text-ink">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-ink-muted hover:text-ink">
              Privacidade
            </Link>
            <a href="mailto:arrudadiego45@gmail.com" className="text-ink-muted hover:text-ink">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li>
      <span className="font-serif text-3xl text-red">{n}</span>
      <h3 className="mt-3 font-serif text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{children}</p>
    </li>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed">
      <span aria-hidden className="mt-1 text-red">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function PriceCard({
  label,
  price,
  description,
  highlight = false,
}: {
  label: string;
  price: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border p-8 ${
        highlight ? "border-red bg-paper" : "border-rule bg-paper"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-xs font-semibold tracking-wide ${highlight ? "text-red" : "text-ink-muted"}`}>
          {label}
        </h3>
        {highlight && (
          <span className="bg-red px-2 py-0.5 text-[10px] font-semibold tracking-wide text-paper-raised">
            MAIS ESCOLHIDO
          </span>
        )}
      </div>
      <p className="mt-3 font-serif text-4xl text-ink">{price}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{description}</p>
    </div>
  );
}

function DocumentMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 border border-rule bg-paper-raised"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-5 top-8 hidden text-[10px] text-red sm:block"
        style={{ writingMode: "vertical-rl" }}
      >
        3 cm
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 top-8 hidden text-[10px] text-red sm:block"
        style={{ writingMode: "vertical-rl" }}
      >
        2 cm
      </span>
      <div className="relative border border-rule bg-paper-raised p-8">
        <div className="absolute -right-3 top-6 bg-red px-2 py-1 text-[10px] font-semibold tracking-wide text-paper-raised">
          ABNT
        </div>

        <div className="flex flex-col items-center gap-1 border-b border-dashed border-rule pb-6 text-center">
          <span className="text-[9px] tracking-wide text-ink-muted">UNIVERSIDADE FEDERAL EXEMPLO</span>
          <span className="text-[9px] tracking-wide text-ink-muted">CURSO DE ENGENHARIA DE SOFTWARE</span>
          <div className="mt-6 h-2 w-40 bg-ink/80" />
          <div className="mt-2 h-2 w-28 bg-ink/80" />
          <span className="mt-6 font-serif text-sm text-ink">Maria Fernandes</span>
          <span className="mt-8 text-[9px] tracking-wide text-ink-muted">SÃO PAULO</span>
          <span className="text-[9px] tracking-wide text-ink-muted">2026</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wide text-red">SUMÁRIO</span>
          <SumarioLine label="1 INTRODUÇÃO" page="8" />
          <SumarioLine label="2 REFERENCIAL TEÓRICO" page="11" />
          <SumarioLine label="3 METODOLOGIA" page="19" />
          <SumarioLine label="REFERÊNCIAS" page="27" />
        </div>
      </div>
    </div>
  );
}

function SumarioLine({ label, page }: { label: string; page: string }) {
  return (
    <div className="flex items-baseline gap-2 text-xs text-ink">
      <span className="whitespace-nowrap">{label}</span>
      <span className="flex-1 border-b border-dotted border-rule" />
      <span className="text-ink-muted">{page}</span>
    </div>
  );
}

function ChecklistMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm border border-rule bg-paper-raised p-8">
      <span className="text-xs font-semibold tracking-wide text-red">REFERÊNCIAS</span>
      <div className="mt-4 flex flex-col gap-4 border-l-4 border-l-red pl-4">
        <p className="font-serif text-sm leading-relaxed text-ink">
          SILVA, João. <span className="font-bold">A engenharia de software na prática.</span> São
          Paulo: Editora Acadêmica, 2024.
        </p>
      </div>
      <div className="mt-5 flex flex-col gap-4 border-l-4 border-l-rule pl-4">
        <p className="font-serif text-sm leading-relaxed text-ink-muted">
          COSTA, Ana. <span className="font-bold">Padrões de arquitetura web.</span> Revista
          Brasileira de Computação, v. 12, n. 3, 2023.
        </p>
      </div>
    </div>
  );
}

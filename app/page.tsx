import Link from "next/link";
import { primaryButtonClass } from "@/components/ui/field";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8">
        <span className="font-serif text-lg text-ink">
          Normatiza<span className="text-red">.</span>
        </span>
        <Link href="/referencias" className="text-sm text-ink-muted hover:text-ink">
          Gerador de referências
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:py-24">
        {/* Guia de margem: a mesma regra de 3cm/2cm que o produto aplica no documento
            final, usada aqui como elemento visual em vez de decoração genérica. */}
        <div className="relative border-y border-rule/0 sm:border-l-2 sm:border-r sm:border-dashed sm:border-rule sm:pl-8 sm:pr-6">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 top-0 hidden -translate-x-full text-xs text-red sm:block"
            style={{ writingMode: "vertical-rl" }}
          >
            3 cm
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2 top-0 hidden translate-x-full text-xs text-red sm:block"
            style={{ writingMode: "vertical-rl" }}
          >
            2 cm
          </span>

          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Formatação ABNT sem perder um dia inteiro nisso
          </h1>

          <p className="mt-6 max-w-[62ch] text-justify font-serif text-lg leading-[1.6] text-ink">
            Gere referências bibliográficas corretas pra livro, artigo, site, capítulo, TCC
            ou legislação, na ordem certa e com o título em negrito. Monte o trabalho inteiro
            no editor ou importe um .docx que você já começou, e receba o documento pronto
            com capa, sumário e a formatação aplicada. Este parágrafo, aliás, já está em Times
            New Roman e espaçamento 1,5: é assim que o seu trabalho vai sair.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/referencias" className={primaryButtonClass}>
              Gerar referências de graça
            </Link>
            <span className="text-sm text-ink-muted">
              Grátis. Você só paga na hora de exportar o documento final.
            </span>
          </div>
        </div>

        <section className="mt-16 border border-rule bg-paper-raised px-6 py-12 sm:px-10 sm:py-14">
          <span className="text-xs font-semibold tracking-wide text-red">Como funciona</span>
          <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            Três passos, do rascunho ao arquivo pronto
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <Step n={1} title="Gere as referências">
              Preencha os dados de cada fonte e receba o texto formatado, ordenado e com o
              título em negrito, do jeito que a norma pede.
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
        </section>

        <section className="mt-12 border border-rule bg-paper-raised px-6 py-12 sm:px-10 sm:py-14">
          <span className="text-xs font-semibold tracking-wide text-red">Preço</span>
          <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            O que é grátis, o que é pago
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-ink-muted">
                Sem custo, sem conta
              </h3>
              <ul className="mt-4 flex flex-col gap-3 text-ink">
                <li>Gerador de referências ABNT, ilimitado</li>
                <li>Editor de documento com o resultado inteiro visível na tela</li>
                <li>Importação de um .docx que você já começou</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-ink-muted">
                Na hora de exportar
              </h3>
              <ul className="mt-4 flex flex-col gap-3 text-ink">
                <li>O .docx final, pronto pra entregar</li>
                <li>Capa, folha de rosto e sumário aplicados no arquivo</li>
                <li>Pagamento avulso, só quando você exporta</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-6 py-10 text-sm text-ink-muted">
        Normatiza
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

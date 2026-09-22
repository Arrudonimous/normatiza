import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-24">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-slate-500">Normatiza</span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            Formatação ABNT sem perder um dia inteiro nisso
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            Gere referências bibliográficas corretas pra livro, artigo, site, capítulo, TCC ou
            legislação, na ordem certa e com o título em negrito. Monte o trabalho inteiro no
            editor ou importe um .docx que você já começou, e receba o documento pronto com capa,
            sumário e formatação aplicada.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/referencias"
            className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Gerar referências de graça
          </Link>
        </div>

        <p className="text-sm text-slate-500">
          O gerador de referências e o editor são gratuitos. Você só paga na hora de exportar o
          documento final em .docx.
        </p>
      </main>
    </div>
  );
}

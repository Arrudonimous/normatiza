import { SiteHeader } from "@/components/ui/site-header";

export const metadata = {
  title: "Política de Privacidade",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader currentPath="home" />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-serif text-3xl text-ink">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-ink-muted">Última atualização: 23 de setembro de 2026.</p>

        <div className="mt-10 flex flex-col gap-8 font-serif text-base leading-[1.6] text-ink">
          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">Quem somos</h2>
            <p className="mt-2 text-justify">
              O Normatiza é operado por Diego Arruda, pessoa física, com sede no Brasil. Pra
              qualquer dúvida sobre esta política ou sobre os dados que guardamos, escreva pra{" "}
              <a href="mailto:arrudadiego45@gmail.com" className="text-red hover:underline">
                arrudadiego45@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Quais dados coletamos
            </h2>
            <p className="mt-2 text-justify">
              Pra criar uma conta, guardamos seu e-mail e a sua senha (nunca em texto puro, ela
              passa por um processo de hash antes de ser salva, então nem nós conseguimos ler a
              senha original). Pra gerar seus documentos, guardamos o conteúdo que você escreve
              no editor ou importa de um .docx: título do trabalho, instituição, curso, autor,
              orientador, cidade, ano, o texto do documento e as referências bibliográficas.
              Quando você paga por uma exportação, a InfinityPay processa o pagamento e nos avisa
              se foi aprovado; não guardamos dado de cartão nem informação financeira sua, isso
              fica só com a InfinityPay.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Por que coletamos
            </h2>
            <p className="mt-2 text-justify">
              Usamos esses dados só pra fazer o Normatiza funcionar: autenticar seu login, salvar
              seu documento entre uma sessão e outra, gerar o arquivo .docx formatado e confirmar
              o pagamento de uma exportação. Não vendemos nem alugamos seus dados pra ninguém, e
              não usamos o conteúdo dos seus documentos pra nenhum outro fim.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Com quem seus dados são compartilhados
            </h2>
            <p className="mt-2 text-justify">
              O banco de dados fica hospedado na Neon, a aplicação roda na Vercel, e os
              pagamentos são processados pela InfinityPay. Cada um desses serviços só recebe o
              que precisa pra fazer sua parte (Neon guarda os dados, Vercel serve o site,
              InfinityPay processa o pagamento). Não compartilhamos seus dados com ninguém além
              disso.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">Cookies</h2>
            <p className="mt-2 text-justify">
              Usamos só um cookie, estritamente necessário pra manter você logado depois que
              entra na conta. Não usamos cookie de rastreamento nem de publicidade.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Seus direitos
            </h2>
            <p className="mt-2 text-justify">
              Você pode pedir a qualquer momento pra ver quais dados temos sobre você, corrigir
              alguma informação errada, ou apagar sua conta e os documentos associados a ela. É só
              mandar um e-mail pra{" "}
              <a href="mailto:arrudadiego45@gmail.com" className="text-red hover:underline">
                arrudadiego45@gmail.com
              </a>{" "}
              pedindo. Respondemos em até 15 dias.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Por quanto tempo guardamos seus dados
            </h2>
            <p className="mt-2 text-justify">
              Guardamos seus dados enquanto sua conta existir. Se você pedir a exclusão da conta,
              apagamos seu e-mail, senha e documentos salvos, exceto o que formos obrigados a
              manter por lei (como registro de pagamento, exigido pela legislação fiscal
              brasileira).
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">Segurança</h2>
            <p className="mt-2 text-justify">
              O site inteiro roda em HTTPS, sua senha é guardada com hash (bcrypt) em vez de texto
              puro, e o cookie de sessão é assinado e não pode ser lido nem alterado pelo
              navegador.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Mudanças nesta política
            </h2>
            <p className="mt-2 text-justify">
              Se mudarmos algo relevante aqui, atualizamos a data no topo desta página. Vale a
              pena dar uma olhada de vez em quando.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

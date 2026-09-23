import { SiteHeader } from "@/components/ui/site-header";

export const metadata = {
  title: "Termos de Uso",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader currentPath="home" />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-serif text-3xl text-ink">Termos de Uso</h1>
        <p className="mt-2 text-sm text-ink-muted">Última atualização: 23 de setembro de 2026.</p>

        <div className="mt-10 flex flex-col gap-8 font-serif text-base leading-[1.6] text-ink">
          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">O serviço</h2>
            <p className="mt-2 text-justify">
              O Normatiza é operado por Diego Arruda, pessoa física, com sede no Brasil, e ajuda
              você a formatar referências bibliográficas e documentos acadêmicos de acordo com as
              normas ABNT. O gerador de referências, o editor de documento e a importação de .docx
              são gratuitos. Você paga só na hora de exportar o documento final em .docx.
              Dúvidas: {" "}
              <a href="mailto:arrudadiego45@gmail.com" className="text-red hover:underline">
                arrudadiego45@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">Sua conta</h2>
            <p className="mt-2 text-justify">
              Pra exportar um documento, você precisa criar uma conta com e-mail e senha. Você é
              responsável por manter sua senha em sigilo e por tudo que acontecer usando sua
              conta. Se desconfiar que alguém mais teve acesso a ela, troque a senha e nos avise.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Preço e formas de pagamento
            </h2>
            <p className="mt-2 text-justify">
              Você pode liberar o download de um jeito avulso, por R$ 9,90, que libera só aquele
              documento. Ou pode comprar o pacote, por R$ 14,90, que libera 3 documentos dentro de
              30 dias a partir da compra. O pacote não é uma assinatura com cobrança automática:
              quando os 30 dias passam, ou quando os 3 documentos acabam antes disso, é preciso
              comprar um novo pacote pra continuar exportando. Os pagamentos são processados pela
              InfinityPay.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Cancelamento e reembolso
            </h2>
            <p className="mt-2 text-justify">
              De acordo com o Código de Defesa do Consumidor, você tem até 7 dias corridos depois
              da compra pra desistir e pedir reembolso integral, contanto que ainda não tenha
              baixado o documento gerado com aquele pagamento. Depois que o arquivo é baixado,
              entendemos que o serviço já foi entregue e utilizado, então esse prazo não se aplica
              mais àquela compra específica. Pra pedir reembolso dentro do prazo, escreva pra{" "}
              <a href="mailto:arrudadiego45@gmail.com" className="text-red hover:underline">
                arrudadiego45@gmail.com
              </a>{" "}
              com o e-mail usado na compra.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              O que você escreve continua seu
            </h2>
            <p className="mt-2 text-justify">
              O conteúdo dos seus documentos (o texto, as referências, os metadados que você
              preenche) continua seu. O Normatiza não reivindica nenhum direito sobre o que você
              escreve, só guarda essa informação pra você conseguir continuar editando depois e
              pra gerar o arquivo final.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Uso aceitável
            </h2>
            <p className="mt-2 text-justify">
              Não use o Normatiza pra tentar acessar dados de outros usuários, sobrecarregar o
              sistema de propósito, ou qualquer outra coisa que atrapalhe o funcionamento do
              serviço pra você ou pra outras pessoas.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              O que o Normatiza não garante
            </h2>
            <p className="mt-2 text-justify">
              O Normatiza aplica as regras de formatação da ABNT do jeito que interpretamos a
              norma, mas isso não substitui a revisão do seu orientador ou das exigências
              específicas da sua instituição, que podem variar. Revise o documento antes de
              entregar. Também não garantimos que a importação de um .docx existente reconheça
              perfeitamente toda a estrutura do arquivo original: é uma conversão de melhor
              esforço, e vale revisar o resultado antes de exportar.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Mudanças nestes termos
            </h2>
            <p className="mt-2 text-justify">
              Se mudarmos algo relevante aqui, atualizamos a data no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-red">
              Legislação aplicável
            </h2>
            <p className="mt-2 text-justify">
              Estes termos são regidos pela legislação brasileira, e qualquer questão relacionada
              a eles deve ser resolvida no foro do domicílio do usuário, conforme prevê o Código
              de Defesa do Consumidor.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

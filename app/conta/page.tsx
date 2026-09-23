import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/ui/site-header";
import { panelClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/field";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getDocumentsByUser } from "@/lib/db/documents";
import { getLatestPackForUser } from "@/lib/db/packs";

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  exported: "Exportado",
};

export default async function ContaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/conta");

  const [pack, documents] = await Promise.all([
    getLatestPackForUser(user.id),
    getDocumentsByUser(user.id),
  ]);

  const now = new Date();
  const packActive = pack && pack.expiresAt > now && pack.documentsUsed < pack.documentsLimit;
  const daysLeft = pack ? Math.max(0, Math.ceil((pack.expiresAt.getTime() - now.getTime()) / 86_400_000)) : 0;

  return (
    <div className="min-h-screen">
      <SiteHeader currentPath="conta" />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
        <header>
          <h1 className="font-serif text-2xl text-ink">Minha conta</h1>
          <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
        </header>

        <section className={panelClass}>
          <h2 className="text-sm font-medium text-ink-muted">Pacote</h2>
          {!pack && (
            <p className="mt-3 text-sm text-ink">
              Você ainda não comprou nenhum pacote. Ele libera 3 documentos por 30 dias.
            </p>
          )}
          {pack && packActive && (
            <p className="mt-3 text-sm text-ink">
              Pacote ativo: {pack.documentsUsed} de {pack.documentsLimit} documentos usados.
              Vale até {formatDate(pack.expiresAt)} ({daysLeft} {daysLeft === 1 ? "dia" : "dias"}).
            </p>
          )}
          {pack && !packActive && (
            <p className="mt-3 text-sm text-ink">
              Seu último pacote ({pack.documentsUsed} de {pack.documentsLimit} usados) não vale mais
              a partir de {formatDate(pack.expiresAt)}.
            </p>
          )}
          {(!pack || !packActive) && (
            <Link href="/editor" className={`mt-4 inline-block ${secondaryButtonClass}`}>
              Ir pro editor
            </Link>
          )}
        </section>

        <section>
          <h2 className="text-sm font-medium text-ink-muted">Seus documentos</h2>
          {documents.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">
              Você ainda não salvou nenhum documento.{" "}
              <Link href="/editor" className="text-red hover:underline">
                Começar um agora
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-4 border border-l-4 border-rule border-l-red bg-paper-raised py-3 pl-4 pr-4"
                >
                  <div>
                    <p className="font-serif text-base text-ink">{doc.title || "Documento sem título"}</p>
                    <p className="text-xs text-ink-muted">
                      {STATUS_LABEL[doc.status] ?? doc.status}, atualizado em {formatDate(doc.updatedAt)}
                    </p>
                  </div>
                  <Link href={`/editor?id=${doc.id}`} className={primaryButtonClass}>
                    Continuar editando
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

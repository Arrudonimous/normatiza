"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "checking" | "pending" | "approved" | "rejected" | "not_found" | "error";

export default function ExportSuccessPage() {
  return (
    <Suspense>
      <ExportSuccessContent />
    </Suspense>
  );
}

function ExportSuccessContent() {
  const searchParams = useSearchParams();
  const orderNsu = searchParams.get("order_nsu");
  const [status, setStatus] = useState<Status>(orderNsu ? "checking" : "error");
  const [downloadToken, setDownloadToken] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNsu) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/payments/status?order_nsu=${orderNsu}`);
        if (!res.ok) {
          if (!cancelled) setStatus("not_found");
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        if (data.status === "approved" && data.downloadToken) {
          setDownloadToken(data.downloadToken);
          setStatus("approved");
          return;
        }
        if (data.status === "rejected") {
          setStatus("rejected");
          return;
        }
        setStatus("pending");
        timer = setTimeout(poll, 2000);
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderNsu]);

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-24 text-center">
      {(status === "checking" || status === "pending") && (
        <>
          <h1 className="font-serif text-xl text-ink">Confirmando seu pagamento...</h1>
          <p className="text-sm text-ink-muted">
            Isso costuma levar só alguns segundos. Não feche essa página.
          </p>
        </>
      )}

      {status === "approved" && downloadToken && (
        <>
          <h1 className="font-serif text-xl text-ink">Pagamento confirmado</h1>
          <a
            href={`/api/export/download?token=${downloadToken}`}
            className="mx-auto bg-red px-5 py-3 text-sm font-medium text-paper-raised hover:bg-red-dark"
          >
            Baixar documento formatado
          </a>
        </>
      )}

      {status === "rejected" && (
        <h1 className="font-serif text-xl text-ink">
          O pagamento não foi aprovado. Tente novamente.
        </h1>
      )}

      {(status === "not_found" || status === "error") && (
        <h1 className="font-serif text-xl text-ink">
          Não conseguimos localizar esse pagamento. Entre em contato se o valor foi cobrado.
        </h1>
      )}
    </main>
  );
}

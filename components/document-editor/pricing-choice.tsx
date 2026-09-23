import { panelClass, primaryButtonClass, secondaryButtonClass } from "../ui/field";

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PricingChoice({
  avulso,
  pacote,
  pacoteDocumentos,
  onChoose,
  loading,
}: {
  avulso: number;
  pacote: number;
  pacoteDocumentos: number;
  onChoose: (kind: "avulso" | "pacote") => void;
  loading: boolean;
}) {
  return (
    <div className={`flex flex-col gap-4 ${panelClass}`}>
      <p className="text-sm text-ink">Como você quer liberar o download desse documento?</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2 border border-rule p-4">
          <span className="text-xs font-semibold tracking-wide text-ink-muted">Só esse documento</span>
          <span className="font-serif text-2xl text-ink">R$ {formatBRL(avulso)}</span>
          <button
            type="button"
            disabled={loading}
            onClick={() => onChoose("avulso")}
            className={secondaryButtonClass}
          >
            Pagar avulso
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 border border-l-4 border-rule border-l-red p-4">
          <span className="text-xs font-semibold tracking-wide text-red">
            {pacoteDocumentos} documentos em 30 dias
          </span>
          <span className="font-serif text-2xl text-ink">R$ {formatBRL(pacote)}</span>
          <button
            type="button"
            disabled={loading}
            onClick={() => onChoose("pacote")}
            className={primaryButtonClass}
          >
            {loading ? "Preparando..." : "Comprar pacote"}
          </button>
        </div>
      </div>

      <p className="text-xs text-ink-muted">
        O pacote não é uma assinatura com cobrança automática: ele libera {pacoteDocumentos} documentos
        por 30 dias, e depois disso (ou se a cota acabar antes) é só comprar de novo.
      </p>
    </div>
  );
}

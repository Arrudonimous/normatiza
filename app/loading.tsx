export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <div className="loading-stamp h-10 w-10 bg-red" aria-hidden />
      <span className="text-sm text-ink-muted">Carregando</span>
    </div>
  );
}

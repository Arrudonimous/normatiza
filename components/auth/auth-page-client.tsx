"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPanel } from "./auth-panel";

export function AuthPageClient({ defaultMode }: { defaultMode: "login" | "signup" }) {
  return (
    <Suspense>
      <AuthPageContent defaultMode={defaultMode} />
    </Suspense>
  );
}

function AuthPageContent({ defaultMode }: { defaultMode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/conta";

  function handleAuthenticated() {
    router.push(next);
    router.refresh();
  }

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="mb-6 text-center font-serif text-2xl text-ink">
        {defaultMode === "signup" ? "Criar sua conta" : "Entrar na sua conta"}
      </h1>
      <AuthPanel onAuthenticated={handleAuthenticated} defaultMode={defaultMode} />
    </main>
  );
}

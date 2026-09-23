"use client";

import { useState } from "react";
import { Field, inputClass, panelClass, primaryButtonClass } from "../ui/field";
import { login, signup, type CurrentUser } from "@/lib/auth/client";

export function AuthPanel({
  onAuthenticated,
  message,
}: {
  onAuthenticated: (user: CurrentUser) => void;
  message?: string;
}) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = mode === "signup" ? await signup(email, password) : await login(email, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={panelClass}>
      {message && <p className="mb-4 text-sm text-ink">{message}</p>}
      <div className="mb-4 flex gap-4 border-b border-rule text-sm">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`border-b-2 pb-2 ${mode === "signup" ? "border-red font-medium text-ink" : "border-transparent text-ink-muted"}`}
        >
          Criar conta
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`border-b-2 pb-2 ${mode === "login" ? "border-red font-medium text-ink" : "border-transparent text-ink-muted"}`}
        >
          Já tenho conta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="E-mail">
          <input
            type="email"
            required
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Senha">
          <input
            type="password"
            required
            minLength={8}
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        {error && <p className="text-xs text-red">{error}</p>}
        <button type="submit" disabled={loading} className={`self-start ${primaryButtonClass}`}>
          {loading ? "Só um instante..." : mode === "signup" ? "Criar conta e continuar" : "Entrar e continuar"}
        </button>
      </form>
    </div>
  );
}

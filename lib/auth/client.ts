export interface CurrentUser {
  id: string;
  email: string;
}

interface AuthResponse {
  user?: CurrentUser;
  error?: string;
}

async function postAuth(path: string, body: unknown): Promise<CurrentUser> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as AuthResponse;
  if (!res.ok || !data.user) throw new Error(data.error ?? "Algo deu errado.");
  return data.user;
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const res = await fetch("/api/auth/me");
  const data = (await res.json()) as AuthResponse;
  return data.user ?? null;
}

export function signup(email: string, password: string): Promise<CurrentUser> {
  return postAuth("/api/auth/signup", { email, password });
}

export function login(email: string, password: string): Promise<CurrentUser> {
  return postAuth("/api/auth/login", { email, password });
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

import { cookies } from "next/headers";
import { getUserById } from "../db/users";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = await getUserById(session.userId);
  return user ?? null;
}

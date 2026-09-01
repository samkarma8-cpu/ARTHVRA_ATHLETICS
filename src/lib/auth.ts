import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { AUTH_COOKIE_NAME, ADMIN_ROLE } from "./constants";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "changeme-in-production-arthvra-athletics-secret-2026"
);

export interface SessionPayload {
  userId: string;
  role: string;
  email: string;
  name: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      role: payload.role as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

/** Read and verify the session from the request cookies (Server Component / Route Handler). */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Get the full user record for the current session, or null. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user || !user.isActive) return null;
  return user;
}

/** Require a logged-in customer or admin. Returns the user or null. */
export async function requireUser() {
  return getCurrentUser();
}

/** Require an admin user. Returns the admin user or null. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== ADMIN_ROLE) return null;
  return user;
}

/** Verify a session payload's role is admin (for server-side checks). */
export function isAdmin(session: SessionPayload | null): boolean {
  return session?.role === ADMIN_ROLE;
}

export async function destroySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

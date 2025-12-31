import { jwtVerify } from "jose";

export type AdminSession = {
  sub: string;
  username: string;
};

export async function verifyAdminSessionEdge(token: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const sub = payload.sub;
    const username = payload.username;

    if (typeof sub !== "string" || typeof username !== "string") return null;
    return { sub, username } satisfies AdminSession;
  } catch {
    return null;
  }
}

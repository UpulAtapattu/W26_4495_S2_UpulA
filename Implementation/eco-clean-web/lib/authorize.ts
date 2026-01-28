import { getAuthSession } from "@/lib/session";

export async function requireRole(roles: string[]) {
  const session = await getAuthSession();

  if (!session || !roles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}

//await requireRole(["ADMIN"]);

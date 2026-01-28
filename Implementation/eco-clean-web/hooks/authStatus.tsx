"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export function AuthStatus() {
  const { data: session } = useSession();

  if (!session) {
    return <button onClick={() => signIn()}>Login</button>;
  }

  return (
    <>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Logout</button>
    </>
  );
}

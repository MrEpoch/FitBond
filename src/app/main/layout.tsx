import { getCurrentSession } from "@/lib/sessionTokens";
import { redirect } from "next/navigation";
import React from "react";

export default async function layout({ children }) {
  const { session, user } = await getCurrentSession();

  if (session === null) {
    return redirect("/auth/login");
  }
  if (!user.emailVerified) {
    return redirect("/auth/verify-email");
  }
  if (!user.registered2FA) {
    return redirect("/auth/2fa/setup");
  }

  if (!session.twoFactorVerified) {
    return redirect("/auth/2fa");
  }

  return <>{children}</>;
}

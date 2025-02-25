import { RecoveryCodeForm } from "@/components/auth/RecoveryCodeForm";
import {
  EmailUpdateForm,
  PasswordUpdateForm,
} from "@/components/auth/UpdateForm";
import { globalGETRateLimitNext } from "@/lib/request";
import { getCurrentSession } from "@/lib/sessionTokens";
import { getUserRecoveryCode } from "@/lib/user";
import { MuseoModerno } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const museoModerno = MuseoModerno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-museo-moderno",
});

export default async function Page() {
  if (!(await globalGETRateLimitNext())) {
    return <div>Too many requests</div>;
  }
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect("/auth/login");
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect("/auth/2fa");
  }
  let recoveryCode: string | null = null;
  if (user.registered2FA) {
    recoveryCode = await getUserRecoveryCode(user.id);
  }

  return (
    <div className="max-w-container">
      <h1 className="text-3xl">Settings</h1>
      <div className="flex flex-col py-8 gap-4">
        <h2 className="text-2xl">Change e-mail</h2>
        <p>Your e-mail: {user.email}</p>
        <EmailUpdateForm />
      </div>
      <hr className="my-8 h-0.5 w-full border-0 bg-main-200" />
      <div className="flex flex-col py-8 gap-4">
        <h2 className="text-2xl">Change password</h2>
        <PasswordUpdateForm />
      </div>
      <hr className="my-8 h-0.5 w-full border-0 bg-main-200" />
      {user.registered2FA && (
        <div className="flex flex-col py-8 gap-4">
          <h2 className="text-2xl">Update 2-factor verification</h2>
          <Link
            className={`w-fit bg-main-background-300 px-8 ${museoModerno.className} font-medium border py-1 text-main-text-100 hover:bg-transparent hover:text-black hover:border-main-100 hover:border rounded-[--radius] text-lg shadow`}
            href="/auth/2fa/setup"
          >
            Update
          </Link>
        </div>
      )}
      <hr className="my-8 h-0.5 w-full border-0 bg-main-200" />
      {recoveryCode !== null && (
        <RecoveryCodeForm recoveryCode={recoveryCode} />
      )}
    </div>
  );
}

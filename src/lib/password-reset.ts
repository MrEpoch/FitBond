import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { generateRandomOTP } from "./recovery";
import { passwordResetSessionTable, userTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { User } from "./user";
import { cookies } from "next/headers";
import { sendMail } from "./nodemailer";

export async function createPasswordResetSession(
  token: string,
  userId: string,
  email: string,
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    code: generateRandomOTP(),
    emailVerified: false,
    twoFactorVerified: false,
  };

  await db.insert(passwordResetSessionTable).values({
    id: session.id,
    userId: session.userId,
    email: session.email,
    code: session.code,
    expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
  });
  return session;
}

export async function validatePasswordResetSessionToken(
  token: string,
): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const sessionDb = await db
    .select()
    .from(passwordResetSessionTable)
    .innerJoin(userTable, eq(passwordResetSessionTable.userId, userTable.id))
    .where(eq(passwordResetSessionTable.id, sessionId));

  if (!sessionDb || sessionDb.length < 1) {
    return {
      session: null,
      user: null,
    };
  }

  const session: PasswordResetSession = {
    id: sessionDb[0].session_password_reset.id,
    userId: sessionDb[0].session_password_reset.userId,
    email: sessionDb[0].session_password_reset.email,
    expiresAt: new Date(sessionDb[0].session_password_reset.expiresAt * 1000),
    code: sessionDb[0].session_password_reset.code,
    emailVerified: Boolean(sessionDb[0].session_password_reset.emailVerified),
    twoFactorVerified: Boolean(
      sessionDb[0].session_password_reset.twoFaEnabled,
    ),
  };

  const user: User = {
    id: sessionDb[0].user.id,
    email: sessionDb[0].user.email,
    username: sessionDb[0].user.username,
    emailVerified: Boolean(sessionDb[0].user.emailVerified),
    registered2FA: Boolean(sessionDb[0].user.totpKey),
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db
      .delete(passwordResetSessionTable)
      .where(eq(passwordResetSessionTable.id, sessionId));
    return {
      session: null,
      user: null,
    };
  }

  return {
    session,
    user,
  };
}

export async function setPasswordResetSessionAsEmailVerified(
  sessionId: string,
): Promise<void> {
  await db
    .update(passwordResetSessionTable)
    .set({ emailVerified: true })
    .where(eq(passwordResetSessionTable.id, sessionId));
}

export async function setPasswordResetSessionAs2FAVerified(
  sessionId: string,
): Promise<void> {
  await db
    .update(passwordResetSessionTable)
    .set({ twoFaEnabled: true })
    .where(eq(passwordResetSessionTable.id, sessionId));
}

export async function invalidateUserPasswordResetSession(
  userId: string,
): Promise<void> {
  await db
    .delete(passwordResetSessionTable)
    .where(eq(passwordResetSessionTable.userId, userId));
}

export async function validatePasswordResetSessionRequest(): Promise<PasswordResetSessionValidationResult> {
  const cookies_val = await cookies();
  let token = cookies_val.get("session_password_reset")?.value;
  if (!token) {
    return { session: null, user: null };
  }

  const result = await validatePasswordResetSessionToken(token);
  if (result.session === null) {
    await deletePassResetSessionTokenCookie();
  }
  return result;
}

export async function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookies_val = await cookies();
  cookies_val.set("session_password_reset", token, {
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function deletePassResetSessionTokenCookie(): Promise<void> {
  const cookies_val = await cookies();
  cookies_val.set("session_password_reset", "", {
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function sendPasswordResetEmail(
  email: string,
  code: string,
): Promise<void> {
  await sendMail({
    from: process.env.MAIL_FROM as string,
    to: email,
    subject: "Password Reset",
    text: `Your reset code is ${code}`,
    html: `<p>Your reset code is ${code}</p>`,
  });
  console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
  id: string;
  userId: string;
  email: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
  twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };

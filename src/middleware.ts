// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedAccessControlAllowHeaders = [
  "Content-Type",
  "Authorization-Session",
  "Authorization-Password-Session",
  "Authorization-Email",
];

const allowedAccessControlAllowMethods = ["GET", "POST", "OPTIONS"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const res = NextResponse.next();
  const hostHeader =
    request.headers.get("Host") ?? request.headers.get("X-Forwarded-Host");

  if (hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Bad Request",
    });
  }

  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.append(
    "Access-Control-Allow-Methods",
    allowedAccessControlAllowMethods.join(","),
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    allowedAccessControlAllowHeaders.join(",").toLowerCase(),
  );

  res.headers.append("Access-Control-Allow-Credentials", "true");

  if (
    (request.url.split("/")[3].startsWith("main") ||
      request.url.split("/")[3] === "") &&
    request.cookies.get("session")?.value === null
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } else if (
    request.url.split("/")[3] === "" &&
    request.cookies.get("session")?.value !== null
  ) {
    return NextResponse.redirect(new URL("/main/dashboard", request.url));
  }

  if (request.method === "GET") {
    const token = request.cookies.get("session")?.value ?? null;
    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new session wasn't set when handling the request.
      res.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return res;
  }

  return res;
}

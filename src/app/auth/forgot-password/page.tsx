import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { globalGETRateLimitNext } from "@/lib/request";
import { Anton, MuseoModerno } from "next/font/google";
import Link from "next/link";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const museoModerno = MuseoModerno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-museo-moderno",
});

export default async function Page() {
  if (!(await globalGETRateLimitNext())) {
    return <div>Too many requests</div>;
  }
  return (
    <>
      <div className="relative flex h-full min-h-screen">
        <Link
          href="/"
          className="absolute top-5 z-10 left-5 flex items-center justify-center gap-4 text-lg font-extrabold"
        >
          <img src="/logo.png" alt="logo" className="h-32 w-auto" />
          <p
            className={`text-white text-2xl font-extrabold ${museoModerno.className}`}
          >
            FitBond
          </p>
        </Link>
        <img
          src="/healthy_food.jpg"
          alt="healthy food"
          width={1920}
          height={1080}
          className="w-full max-h-full brightness-75 h-screen hidden md:block object-cover"
        />
        <div className="w-full min-h-full flex flex-col  gap-8 items-center justify-center">
          <h1 className={`text-3xl font-bold ${anton.className}`}>
            Forgot your password?
          </h1>
          <ForgotPasswordForm />
          <Link
            className="text-sm text-gray-700 transition hover:opacity-75"
            href="/auth/login"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}

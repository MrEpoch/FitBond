"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomField from "./CustomField";
import { useRouter } from "next/navigation";
import { MuseoModerno } from "next/font/google";

const museoModerno = MuseoModerno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-museo-moderno",
});

export const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Has to be at least 3 characters" })
      .max(255, { message: "At most 255 characters" })
      .optional(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Has to be at least 8 characters" })
      .max(200, { message: "At most 200 characters" }),
    passwordConfirm: z.string().optional(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (typeof passwordConfirm === "string" && password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["passwordConfirm"],
      });
    }
  });

export function AuthForm({
  authType = "login",
}: {
  authType?: "login" | "register";
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      authType === "register"
        ? {
            email: "",
            password: "",
            passwordConfirm: "",
            username: "",
          }
        : { email: "", password: "" },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (authType === "register") {
      const user = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });
      const userResponse = await user.json();

      if (userResponse.redirect) router.push(userResponse.redirect);

      if (userResponse.success) {
        console.log("Success", userResponse);
        router.push("/auth/2fa/setup");
      }
    } else {
      const user = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const userResponse = await user.json();
      if (userResponse?.redirect === "EMAIL_NOT_VERIFIED") {
        await fetch("/api/auth/verify-email/resend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        router.push("/auth/verify-email");
      }
      if (userResponse.redirect) router.push(userResponse.redirect);
      if (userResponse.success) {
        console.log("Success", userResponse);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[500px] w-full flex flex-col items-center p-6 space-y-8"
      >
        {authType === "register" && (
          <CustomField
            control={form.control}
            className="w-full"
            name="username"
            formLabel={"Username (3-255 chars)*"}
            render={({ field }) => (
              <Input
                type="text"
                className="bg-main-background-100 shadow border border-main-accent-100"
                value={field.value}
                {...field}
              />
            )}
          />
        )}
        <CustomField
          control={form.control}
          className="w-full"
          name="email"
          formLabel={"Email*"}
          render={({ field }) => (
            <Input
              type="email"
              className="bg-main-background-100 shadow border border-main-accent-100"
              value={field.value}
              {...field}
            />
          )}
        />
        <CustomField
          control={form.control}
          name="password"
          className="w-full"
          formLabel={"Password (8-200 chars)*"}
          render={({ field }) => (
            <Input
              type="password"
              className="bg-main-background-100 shadow border border-main-accent-100"
              value={field.value}
              {...field}
            />
          )}
        />
        {authType === "register" && (
          <CustomField
            control={form.control}
            name="passwordConfirm"
            className="w-full"
            formLabel={"Password verify*"}
            render={({ field }) => (
              <Input
                type="password"
                className="bg-main-background-100 shadow border border-main-accent-100"
                value={field.value}
                {...field}
              />
            )}
          />
        )}
        <Button
          className={`bg-main-background-300 px-10 ${museoModerno.className} font-medium border py-5 text-main-text-100 hover:bg-transparent hover:text-black hover:border-main-100 hover:border rounded-[--radius] text-lg shadow`}
          type="submit"
        >
          {authType === "register" ? "Register" : "Log In"}
        </Button>
      </form>
    </Form>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Anton, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitness calorie tracker",
  description: "Tracker your calories and fitness achievements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className}`}>
        <main className="min-h-container">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

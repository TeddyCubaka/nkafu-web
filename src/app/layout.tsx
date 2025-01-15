import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/auth-guard";

const font = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Digipublic",
  description: "Digipublic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased`}>
        <main className="w-screen h-screen flex overflow-hidden">
          <AuthGuard>
              {children}
          </AuthGuard>
        </main>
      </body>
    </html>
  );
}

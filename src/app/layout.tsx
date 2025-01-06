import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/auth-guard";
import Sidebar from "@/components/commons/sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const inter_Tight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
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
      <body className={`${inter.variable} ${inter_Tight.variable} antialiased`}>
        <AuthGuard>
          <main className="w-screen h-screen flex">
            <Sidebar />
            <div className=" w-full bg-slate-200 dark:bg-[#14151f]">{children}</div>
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}

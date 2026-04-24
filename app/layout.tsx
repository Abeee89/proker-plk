import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sparky | Keajaiban Listrik",
  description: "Belajar konsep dasar listrik dengan permainan seru dan interaktif!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-nunito bg-sky-50 text-slate-800 overflow-x-hidden selection:bg-yellow-300 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}

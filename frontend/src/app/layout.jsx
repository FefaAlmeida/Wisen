import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  fallback: ["monospace"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Wisen — Conhecimento em contexto",
  description: "Aprenda com acontecimentos e acompanhe seu conhecimento.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

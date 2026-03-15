import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ACT Clothes — Moda Minimalista",
  description:
    "Tienda de ropa minimalista. Prendas esenciales de alta calidad para cada momento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-white text-neutral-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

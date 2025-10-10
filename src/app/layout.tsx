import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieBanner";
import SchemaOrg from "./seo/SchemaOrg";

// ===== Fontes =====
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===== SEO & Favicon Metadata =====
export const metadata: Metadata = {
  title: "Colégio Técnico TecMinas",
  description:
    "Curso reconhecido nacionalmente. Avance na sua carreira com flexibilidade! Pós e cursos técnicos 100% EaD.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Colégio Técnico TecMinas",
    description:
      "Cursos Técnicos e Pós-Graduação reconhecidos pelo MEC. Estude de onde estiver com o TecMinas!",
    url: "https://www.colegiotecminas.com.br",
    siteName: "TecMinas",
    images: [
      {
        url: "og.webp", // opcional: crie uma imagem 1200x630 para aparecer nos compartilhamentos
        width: 1200,
        height: 630,
        alt: "Colégio Técnico TecMinas",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  metadataBase: new URL("https://www.colegiotecminas.com.br"),
  verification: {
    google: "BYCYPG48W2Xv8t_DEWQT72TW6Qweh1U8cFw-EK9goXY", // ✅ continua funcionando
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="scroll-smooth scroll-pt-24">
      <header>
        <meta
          name="google-site-verification"
          content="pK1ocOVUJwzzdju6scROwYpzYBv0qZ5vA4DeWYtm-FM"
        />
      </header>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SchemaOrg />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}

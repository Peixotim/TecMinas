import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieBanner";
import SchemaOrg from "./seo/SchemaOrg";
import { Suspense } from "react";
import AnalyticsScripts from "@/components/AnalyticsScripts";

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
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
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
        url: "/og.webp", // Imagem recomendada para compartilhamento
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
    google: "BYCYPG48W2Xv8t_DEWQT72TW6Qweh1U8cFw-EK9goXY", // Google Search Console
  },
};

// ===== Layout Principal =====
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="scroll-smooth scroll-pt-24">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* === Google Tag Manager (NoScript) === */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* === Facebook Pixel (NoScript) === */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        {/* === Conteúdo Principal === */}
        {children}
        <SchemaOrg />
        <WhatsAppButton />
        <CookieConsent />

        {/* === Scripts de Análise === */}
        <Suspense fallback={null}>
          <AnalyticsScripts />
        </Suspense>
      </body>
    </html>
  );
}

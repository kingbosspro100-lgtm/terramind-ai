import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

import OfflineBanner from "@/app/components/ui/OfflineBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TerraMind AI",
  description: "L'intelligence agricole au service de votre exploitation.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "3VhshAtSkjUvWJIfXxaD21HM1EmzjBSb6igoy4tZSlE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B0914] text-white`}
      >
        <LanguageProvider>
          {children}
          <OfflineBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}

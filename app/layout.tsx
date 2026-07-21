import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hud",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WEB-HEAD OS — Spider-Sense HUD for GitHub",
  description: "Dynamic Spider-Man HUD inspired developer profile & real-time GitHub DevOps telemetry dashboard.",
  keywords: ["GitHub", "Developer Portfolio", "Spider-Man HUD", "DevOps Dashboard", "Next.js", "Tailwind CSS"],
  authors: [{ name: "Principal Architecture Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-suit="classic" className={`${chakraPetch.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased selection:bg-[var(--web-shooter-blue)] selection:text-white">
        {children}
      </body>
    </html>
  );
}

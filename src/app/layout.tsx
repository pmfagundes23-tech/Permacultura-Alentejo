import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Permacultura Alentejo",
  description:
    "Ferramenta de desenho em permacultura para o Alentejo: Oráculo IA, catálogo de plantas com compatibilidade por terreno, guias práticos, princípios e perfil do teu sítio.",
  manifest: "/manifest.json",
  applicationName: "Permacultura Alentejo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Perma Alentejo",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#556B2F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body className="font-sans antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

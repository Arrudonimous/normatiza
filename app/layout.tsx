import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import { SiteHeader } from "@/components/ui/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_URL = "https://normatiza.vercel.app";
const DESCRIPTION =
  "Formatação ABNT sem perder um dia inteiro nisso. Gere referências, monte o documento no editor e exporte formatado.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Normatiza",
    template: "%s | Normatiza",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Normatiza",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Normatiza",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Normatiza",
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${ptSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}

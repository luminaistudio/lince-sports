import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: { default: "Lince Sports", template: "%s | Lince Sports" }, description: "Kits e kitpacks para PES 2014 PSP.", openGraph: { siteName: "Lince Sports" } };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><header className="top"><a href="/" className="logo">LINCE<i>SPORTS</i></a></header>{children}</body></html>;
}

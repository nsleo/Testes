import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier Performance",
  description:
    "Projeto de teste high ticket com direcao editorial, animacoes suaves e performance tratada como produto.",
  openGraph: {
    title: "Atelier Performance",
    description:
      "Projeto de teste high ticket com direcao editorial, animacoes suaves e performance tratada como produto.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

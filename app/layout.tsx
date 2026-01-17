import type { Metadata } from "next";
import { Figtree, Zalando_Sans_Expanded } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const zalandoSansExpanded = Zalando_Sans_Expanded({
  variable: "--font-zalando",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hackathons Canada",
  description: "Hackathons Canada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${figtree.variable} ${zalandoSansExpanded.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

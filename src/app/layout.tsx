import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const title = "Anime Café";
const description =
  "A cozy anime café cooking game — serve pancakes and smoothies to customers before they lose patience.";

export const metadata: Metadata = {
  metadataBase: new URL("https://animecafe.vercel.app"),
  title,
  description,
  openGraph: { title, description, url: "/", siteName: title, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

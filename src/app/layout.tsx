import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Josefin_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Stylevique | Salon & Beauty Studio",
    template: "%s | Stylevique",
  },
  description:
    "Stylevique is a premium salon and beauty studio for hair, skin, makeup and mindful self-care. Explore services and book your moment.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{ className: "font-sans" }}
        />
      </body>
    </html>
  );
}

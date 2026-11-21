import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Cormorant_Garamond, Josefin_Sans, Oswald } from "next/font/google";
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

/** Heavy condensed display face for the hero and page headings. */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

/** Condensed grotesque used by the section headings. */
const oswald = Oswald({
  variable: "--font-oswald",
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
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${cormorantGaramond.variable} ${anton.variable} ${oswald.variable} h-full antialiased`}
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

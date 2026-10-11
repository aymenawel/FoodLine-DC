import type { Metadata, Viewport } from "next";
import { Cabin, Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// next/font downloads these at build time and serves them locally, so the running demo makes no font requests.
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"], style: ["normal", "italic"] });
const cabin = Cabin({ variable: "--font-cabin", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "FoodLine DC",
  description: "Text a ZIP, neighborhood or cross street to find food in Wards 7 and 8. Every request becomes a live, anonymous signal of unmet need.",
};

export const viewport: Viewport = { themeColor: "#f6ead4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${openSans.variable} ${cabin.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}

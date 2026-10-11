import type { Metadata, Viewport } from "next";
import { Cabin, Open_Sans, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// next/font downloads these at build time and serves them locally, so the running demo makes no font requests.
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"], style: ["normal", "italic"] });
const cabin = Cabin({ variable: "--font-cabin", subsets: ["latin"], weight: ["500", "700"] });
// the original dark theme's fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

// Applies the saved theme before first paint so there is no flash. Default is the light "Market" theme.
const THEME_SCRIPT = `try{var t=localStorage.getItem('foodline-theme');if(t==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`;

export const metadata: Metadata = {
  title: "FoodLine DC",
  description: "Text a ZIP, neighborhood or cross street to find food in Wards 7 and 8. Every request becomes a live, anonymous signal of unmet need.",
};

export const viewport: Viewport = { themeColor: "#f6ead4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${openSans.variable} ${cabin.variable} ${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} /></head>
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}

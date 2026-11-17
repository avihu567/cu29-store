import type { Metadata } from "next";
import { Cormorant_Garamond, Rubik } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

// Primary typeface for the whole site: soft, rounded, full Hebrew support,
// with real weights for hierarchy (300 subtitles · 400 body · 500 headings).
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600"],
});

// Accent only: the English brand line "Pure Flow. Pure Metal." (font-display).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "CU29 | נחושת טהורה לחיים בריאים",
    template: "%s | CU29",
  },
  description:
    "CU29 – בקבוקי מים, כלי הגשה ותכשיטים מנחושת טהורה 99.9%. Pure Flow. Pure Metal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${cormorant.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

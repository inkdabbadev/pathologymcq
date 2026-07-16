import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { QueryProvider } from "@/components/providers/query-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Pathology MCQ | FRCPath, NEET-SS, MD/DNB Exam Prep",
    template: "%s | Pathology MCQ",
  },
  description:
    "Image-rich pathology MCQ practice, subspecialty courses, and full-length mock tests for FRCPath, NEET-SS, INI-SS, MD/DNB and APCP trainees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink-900">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </QueryProvider>
      </body>
    </html>
  );
}

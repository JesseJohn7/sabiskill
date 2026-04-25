import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./lib/ThemeContext";
import { PWAInstaller } from "./components/PWAInstaller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sabiskill - Learn Anything",
  description: "Your personal learning platform for continuous skill development",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sabiskill",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
  },
  icons: [
    {
      rel: "icon",
      url: "/icon-192x192.png",
    },
    {
      rel: "apple-touch-icon",
      url: "/icon-192x192.png",
      sizes: "192x192",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
        <ThemeProvider>
          <PWAInstaller />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
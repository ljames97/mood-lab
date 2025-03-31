import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/AuthContext";
import ModalWrapper from "@/components/modal/ModalWrapper";
import { ThemeProvider } from "@/store/ThemeContext";
import ViewportFixProvider from "@/components/utils/appViewportFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mood Lab",
  description: "Create and collaborate on mood boards",
  icons: {
    icon: '/favicon.png'

  }
};

export default function RootLayout({
  modals,
  children,
}: Readonly<{
  modals: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
      <AuthProvider>
        <ThemeProvider>
        <ViewportFixProvider>
          <ModalWrapper modals={modals}/>
          <div className="relative">{children} </div>
          </ViewportFixProvider>
        </ThemeProvider>
      </AuthProvider>
    </body>
  </html>
  );
}

"use client";

import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import Header from "@/app/_components/Header"
import Footer from "@/app/_components/Footer"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import dynamic from "next/dynamic";

const ReduxProvider = dynamic(() => import("@/app/StoreProvider"), {
  ssr: false
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noRenderRoutes = ["/dashboard", "/iniciar-sesion", "/registrarse"];
  const shouldRender = !noRenderRoutes.some((route) =>
    pathname.startsWith(route),
  );
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {shouldRender && <Header />}
          {children}
          {shouldRender && <Footer />}
        </ReduxProvider>
      </body>
    </html>
  );
}

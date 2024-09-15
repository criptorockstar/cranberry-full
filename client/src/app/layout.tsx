"use client";

import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import Header from "@/app/_components/Header"
import Footer from "@/app/_components/Footer"
import "./globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from './theme';

const manrope = localFont({
  src: [
    {
      path: "./fonts/Manrope-ExtraBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-ExtraLight.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Light.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Medium.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Regular.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-SemiBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
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
        className={`${manrope.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {shouldRender && <Header />}
            {children}
            {shouldRender && <Footer />}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

"use client";
import { Manrope } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const manrope = Manrope({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: manrope.style.fontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});

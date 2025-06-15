import ThemeProvider from "@/context/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import "../styles/prism.css";
import "./globals.css";
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  title: "Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: "/assets/images/site-logo.svg",
  openGraph: {
    url: "https://dev-overflow-mocha.vercel.app/",
    images: [
      {
        url: "/assets/images/dark-illustration.png",
        width: 1200,
        height: 630,
        alt: "Dev Overflow platform preview image"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Flow",
    description:
      "A community-driven platform for asking and answering programming questions.",
    images: ["/assets/images/dark-illustration.png"],
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradiant",
          footerActionLink: "primary-text-gradiant hover:text-primary-500",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

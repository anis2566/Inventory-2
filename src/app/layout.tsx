import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { TRPCProvider } from "@/providers/trpc-provider";
import { ModalProvider } from "@/providers/modal-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | POS",
    default: "POS | Armanitola Library"
  },
  description: "POS Armanitola Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <TRPCProvider>
        <NuqsAdapter>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {children}
              <Toaster />
              <ModalProvider />
            </body>
          </html>
        </NuqsAdapter>
      </TRPCProvider>
    </ClerkProvider>
  );
}

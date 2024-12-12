import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import React from "react";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "Mtaani FX",
    description: "Invest in your future",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en">
        <body>
        <main  className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
        )}>
            {children}
        </main>
        </body>
        </html>
    );
}

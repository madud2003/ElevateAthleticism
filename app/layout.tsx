import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import LayoutShell from "./LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>ELEVATEATHLETISM</title>
          <meta name="description" content="ELEVATEATHLETISM — performance coaching and programmes for athletes." />
          <script
            dangerouslySetInnerHTML={{
              __html: `tailwind.config = { theme: { extend: { colors: { primary: '#7c3aed', 'primary-light': '#b794f4', 'primary-dark': '#5b21b6', secondary: '#111827', accent: '#06b6d4', background: '#ffffff', 'background-tertiary': '#f8fafc' }, borderRadius: { lg: '1rem' }, container: { center: true, padding: '1rem' }, fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] } } } }`,
            }}
          />
          <script src="https://cdn.tailwindcss.com" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
          <LayoutShell>{children}</LayoutShell>
        </body>
      </html>
    </ClerkProvider>
  );
}

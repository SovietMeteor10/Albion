import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Albion",
  description: "Strategic thinking for the future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}

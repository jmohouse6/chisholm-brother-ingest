import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Request a Painting Estimate | Chisholm Brothers Painting",
  description: "Request a painting estimate from Chisholm Brothers Painting."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

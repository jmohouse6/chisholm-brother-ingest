import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New Lead Intake | Chism Brothers",
  description:
    "Submit a new lead or estimate request for Chism Brothers Painting or Chism Commercial Painting and Contracting."
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

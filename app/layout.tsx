import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New Lead Intake | Chisholm Brothers Painting",
  description:
    "Submit a new lead or painting estimate request for Chisholm Brothers Painting."
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

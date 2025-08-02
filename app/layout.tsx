import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "./components/conditional-navbar";

export const metadata: Metadata = {
  title: "InnerSwitch - Internal Mobility Platform",
  description: "Cognizant's Internal Mobility and Talent Discovery Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}

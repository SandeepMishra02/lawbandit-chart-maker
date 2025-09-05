import "./globals.css";
import ThemeScript from "../components/ThemeScript";
import ThemeToggle from "../components/ThemeToggle";
import type { ReactNode } from "react";

export const metadata = { title: "LLM-Powered Chart Maker" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <header className="header">
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}







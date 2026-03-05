import "./globals.css";
import type { Metadata } from "next";

import AppShell from "./components/AppShell";

export const metadata: Metadata = {
  title: "Atlas - Personal Reflection Copilot",
  description: "Journal, RAG Q&A, and weekly reflection assistant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

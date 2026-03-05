import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlas - Personal Reflection Copilot",
  description: "Journal, RAG Q&A, and weekly reflection assistant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>Atlas</h1>
          <p className="muted">Personal Reflection Copilot</p>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/ask">Ask</Link>
            <Link href="/weekly">Weekly</Link>
          </nav>
          <hr />
          {children}
        </main>
      </body>
    </html>
  );
}

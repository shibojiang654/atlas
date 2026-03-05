"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpenText, BrainCircuit, Home, Plus, Settings2, Sparkles } from "lucide-react";
import { Toaster } from "sonner";

import { cn } from "@/app/lib";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/journal", label: "Journal", icon: BookOpenText },
  { href: "/ask", label: "Ask", icon: BrainCircuit },
  { href: "/weekly", label: "Weekly", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings2 }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(167,243,208,0.28),transparent_35%)]" />
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link className="text-xl font-semibold tracking-tight text-slate-900" href="/">
            Atlas
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm text-slate-600 transition hover:text-slate-900",
                    active && "text-slate-900"
                  )}
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {active ? (
                    <motion.span
                      layoutId="desktop-nav"
                      className="absolute inset-0 rounded-full bg-white shadow"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container relative py-6 md:py-8">{children}</main>

      <Link
        href="/journal#editor"
        className="fixed bottom-24 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:-translate-y-1 md:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>

      <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-3xl border border-white/60 bg-white/80 p-2 shadow-xl backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] text-slate-500",
                  active && "bg-slate-900 text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <Toaster richColors position="top-right" />
    </div>
  );
}

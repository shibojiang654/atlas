import Link from "next/link";
import { ArrowRight, BookHeart, Brain, Sparkles } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

const items = [
  { href: "/journal", title: "Journal", text: "Capture your day with mood, energy, and stress signals.", icon: BookHeart },
  { href: "/ask", title: "Ask", text: "Ask reflective questions and get grounded answers with citations.", icon: Brain },
  { href: "/weekly", title: "Weekly", text: "Review your week and generate small practical experiments.", icon: Sparkles }
];

export default function HomePage() {
  return (
    <section className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="space-y-5 p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Personal Reflection Copilot</p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Calm clarity for your inner patterns, one entry at a time.
          </h1>
          <p className="max-w-2xl text-slate-600">
            Atlas helps you journal, ask questions over your reflections, and turn weekly insights into gentle experiments.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/journal">
                Start Journaling <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/ask">Ask Atlas</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="space-y-3 p-6">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

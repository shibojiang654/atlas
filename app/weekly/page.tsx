"use client";

import React from "react";
import { Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { readApiError } from "@/app/http";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Skeleton } from "@/app/components/ui/skeleton";

const USER_ID = "demo-user";

type WeeklyResponse = {
  summary: string;
  themes: string[];
  experiments: string[];
};

export default function WeeklyPage() {
  const [weekStartISO, setWeekStartISO] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<WeeklyResponse | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!weekStartISO) {
      toast.error("Select week start first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/weekly_reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": USER_ID
        },
        body: JSON.stringify({ weekStartISO })
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      const data = (await res.json()) as WeeklyResponse;
      setResult(data);
      toast.success("Weekly report generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Weekly reflection failed.");
    } finally {
      setLoading(false);
    }
  }

  function exportReport() {
    if (!result) {
      return;
    }
    const content = [
      `Weekly reflection (${weekStartISO})`,
      "",
      `Summary:\n${result.summary}`,
      "",
      `Themes:\n- ${result.themes.join("\n- ")}`,
      "",
      `Experiments:\n1. ${result.experiments[0] || ""}\n2. ${result.experiments[1] || ""}`
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-weekly-${weekStartISO}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Weekly Reflection
          </CardTitle>
          <CardDescription>Generate a calm, structured report with themes and small experiments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full space-y-2 sm:max-w-xs">
              <label className="text-sm font-medium">Week start</label>
              <Input type="date" value={weekStartISO} onChange={(e) => setWeekStartISO(e.target.value)} />
            </div>
            <Button disabled={loading}>{loading ? "Generating..." : "Generate report"}</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {result ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Weekly Report</CardTitle>
              <Button variant="secondary" onClick={exportReport}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Summary</p>
                <p className="text-slate-700">{result.summary}</p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Themes</p>
                <div className="flex flex-wrap gap-2">
                  {result.themes.map((theme) => (
                    <Badge key={theme}>{theme}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {result.experiments.map((experiment, index) => (
                  <Card key={experiment} className="border-white/70 bg-white/70">
                    <CardContent className="space-y-2 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Experiment {index + 1}
                      </p>
                      <p className="text-sm text-slate-700">{experiment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </section>
  );
}

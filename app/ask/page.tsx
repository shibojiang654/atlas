"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

import AskBox from "@/app/components/AskBox";
import CitationCard from "@/app/components/CitationCard";
import SafetyBanner from "@/app/components/SafetyBanner";
import { readApiError } from "@/app/http";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import type { Citation } from "@/app/types";

const USER_ID = "demo-user";

type AskResponse = {
  answer: string;
  citations: Citation[];
  debug?: { retrievedCount: number };
  safety?: { flagged: boolean; message?: string };
};

function toSections(answer: string) {
  const pieces = answer
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return pieces.length > 1
    ? pieces
    : [
        "Pattern Signals",
        answer || "No answer yet.",
        "Next Gentle Step",
        "Choose one action that is easy to repeat tomorrow."
      ];
}

export default function AskPage() {
  const [loading, setLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState("");
  const [citations, setCitations] = React.useState<Citation[]>([]);
  const [safetyMessage, setSafetyMessage] = React.useState<string | null>(null);
  const [retrieved, setRetrieved] = React.useState<number>(0);

  async function handleAsk(question: string, dateRange?: { start: string; end: string }) {
    setSafetyMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": USER_ID
        },
        body: JSON.stringify({ question, dateRange })
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      const data = (await res.json()) as AskResponse;
      setAnswer(data.answer);
      setCitations(data.citations || []);
      setRetrieved(data.debug?.retrievedCount || 0);
      if (data.safety?.flagged && data.safety.message) {
        setSafetyMessage(data.safety.message);
      }
      toast.success("Answer ready");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ask request failed.");
    } finally {
      setLoading(false);
    }
  }

  const sections = toSections(answer);

  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="space-y-4">
        <AskBox onAsk={handleAsk} loading={loading} />
        {safetyMessage ? <SafetyBanner message={safetyMessage} /> : null}

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Reflection Answer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    {sections.map((section, idx) => (
                      <Card key={`${section}-${idx}`} className="border-white/70 bg-white/70">
                        <CardContent className="p-4 text-sm text-slate-700">{section}</CardContent>
                      </Card>
                    ))}
                  </div>
                  <Badge variant="outline">Retrieved context chunks: {retrieved}</Badge>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" /> Citations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {citations.length === 0 && !loading ? <p className="text-sm text-slate-500">No citations yet.</p> : null}
            {loading ? <Skeleton className="h-24 w-full" /> : null}
            {citations.map((citation) => (
              <CitationCard key={`${citation.documentId}-${citation.entryId}`} citation={citation} />
            ))}
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

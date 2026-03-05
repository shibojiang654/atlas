"use client";

import React from "react";
import AskBox from "../components/AskBox";
import CitationCard from "../components/CitationCard";
import SafetyBanner from "../components/SafetyBanner";
import { readApiError } from "../http";
import type { Citation } from "../types";

const USER_ID = "demo-user";

type AskResponse = {
  answer: string;
  citations: Citation[];
  debug?: { retrievedCount: number };
  safety?: { flagged: boolean; message?: string };
};

export default function AskPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [answer, setAnswer] = React.useState<string>("");
  const [citations, setCitations] = React.useState<Citation[]>([]);
  const [safetyMessage, setSafetyMessage] = React.useState<string | null>(null);
  const [retrieved, setRetrieved] = React.useState<number>(0);

  async function handleAsk(question: string, dateRange?: { start: string; end: string }) {
    setError(null);
    setSafetyMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": USER_ID
        },
        body: JSON.stringify({
          question,
          dateRange: dateRange
            ? {
                start: dateRange.start,
                end: dateRange.end
              }
            : undefined
        })
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ask request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <AskBox onAsk={handleAsk} loading={loading} />
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {safetyMessage ? <SafetyBanner message={safetyMessage} /> : null}
      {answer ? (
        <section className="card">
          <h3>Answer</h3>
          <p>{answer}</p>
          <p className="muted">Retrieved chunks: {retrieved}</p>
        </section>
      ) : null}
      {citations.length > 0 ? <h3>Citations</h3> : null}
      {citations.map((c) => (
        <CitationCard key={`${c.documentId}-${c.entryId}`} citation={c} />
      ))}
    </section>
  );
}

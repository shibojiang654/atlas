"use client";

import React from "react";

type Props = {
  onAsk: (question: string, dateRange?: { start: string; end: string }) => Promise<void>;
  loading: boolean;
};

export default function AskBox({ onAsk, loading }: Props) {
  const [question, setQuestion] = React.useState("");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      return;
    }
    await onAsk(
      question,
      start && end
        ? {
            start,
            end
          }
        : undefined
    );
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>Ask Atlas</h3>
      <label>
        Question
        <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What patterns do you see in how I handle stress?"
        />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <label>
          Date start (optional)
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          Date end (optional)
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>
      <button disabled={loading} type="submit">
        {loading ? "Thinking..." : "Ask"}
      </button>
    </form>
  );
}

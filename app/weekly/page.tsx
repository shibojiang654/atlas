"use client";

import React from "react";
import { readApiError } from "../http";

const USER_ID = "demo-user";

type WeeklyResponse = {
  summary: string;
  themes: string[];
  experiments: string[];
  citations?: Array<{ entryId: number; createdAt: string; snippet: string }>;
};

export default function WeeklyPage() {
  const [weekStartISO, setWeekStartISO] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<WeeklyResponse | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!weekStartISO) {
      return;
    }
    setError(null);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Weekly reflection failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <form className="card" onSubmit={submit}>
        <h3>Weekly Reflection</h3>
        <label>
          Week start
          <input type="date" value={weekStartISO} onChange={(e) => setWeekStartISO(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {result ? (
        <section className="card">
          <h3>Summary</h3>
          <p>{result.summary}</p>
          <h4>Themes</h4>
          <ul>
            {result.themes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
          <h4>Experiments</h4>
          <ol>
            {result.experiments.map((exp) => (
              <li key={exp}>{exp}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </section>
  );
}

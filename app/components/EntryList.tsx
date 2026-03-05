"use client";

import type { Entry } from "../types";

type Props = {
  entries: Entry[];
};

export default function EntryList({ entries }: Props) {
  return (
    <section className="card">
      <h3>Recent Entries</h3>
      {entries.length === 0 ? <p className="muted">No entries yet.</p> : null}
      {entries.map((entry) => (
        <article key={entry.id} style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10, marginTop: 10 }}>
          <strong>{entry.title || "Untitled"}</strong>
          <p className="muted">{new Date(entry.created_at).toLocaleString()}</p>
          <p>{entry.content_preview}</p>
        </article>
      ))}
    </section>
  );
}

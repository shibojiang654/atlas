"use client";

import React from "react";
import EntryEditor from "../components/EntryEditor";
import EntryList from "../components/EntryList";
import { readApiError } from "../http";
import type { Entry } from "../types";

const USER_ID = "demo-user";

export default function JournalPage() {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function loadEntries() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/entries_list", {
        headers: {
          "X-User-Id": USER_ID
        }
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      const data = (await res.json()) as { entries: Entry[] };
      setEntries(data.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadEntries();
  }, []);

  return (
    <section>
      <EntryEditor onCreated={loadEntries} />
      {loading ? <p className="muted">Loading entries...</p> : null}
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      <EntryList entries={entries} />
    </section>
  );
}

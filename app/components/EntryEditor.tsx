"use client";

import React from "react";
import { readApiError } from "../http";

type Props = {
  onCreated: () => Promise<void>;
};

const USER_ID = "demo-user";

export default function EntryEditor({ onCreated }: Props) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/entries_create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": USER_ID
        },
        body: JSON.stringify({ title: title || undefined, content })
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      setTitle("");
      setContent("");
      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>New Journal Entry</h3>
      <label>
        Title (optional)
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Today felt..." />
      </label>
      <label>
        Content
        <textarea
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reflection..."
        />
      </label>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      <button disabled={loading} type="submit">
        {loading ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
}

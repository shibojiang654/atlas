import type { Citation } from "../types";

export default function CitationCard({ citation }: { citation: Citation }) {
  return (
    <article className="card" style={{ padding: 12 }}>
      <p>
        <strong>Entry {citation.entryId}</strong> | Doc {citation.documentId}
      </p>
      <p className="muted">{new Date(citation.createdAt).toLocaleString()}</p>
      <p>{citation.snippet}</p>
    </article>
  );
}

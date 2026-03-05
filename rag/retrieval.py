from __future__ import annotations

import re
from typing import Any


def tokenize_keywords(question: str, max_terms: int = 8) -> list[str]:
    tokens = re.findall(r"[a-zA-Z]{4,}", question.lower())
    seen: list[str] = []
    for t in tokens:
        if t not in seen:
            seen.append(t)
        if len(seen) >= max_terms:
            break
    return seen


def build_where_clause(date_range: dict[str, str] | None) -> tuple[str, list[Any]]:
    if not date_range:
        return "", []

    clauses: list[str] = []
    params: list[Any] = []

    start = date_range.get("start")
    end = date_range.get("end")
    if start:
        clauses.append("d.created_at >= %s")
        params.append(start)
    if end:
        clauses.append("d.created_at <= %s")
        params.append(end)

    if not clauses:
        return "", []

    return " AND " + " AND ".join(clauses), params


def build_retrieval_sql(date_range: dict[str, str] | None, keyword_terms: list[str]) -> tuple[str, str]:
    date_sql, _ = build_where_clause(date_range)

    vector_sql = f"""
    SELECT d.id AS document_id, d.entry_id, d.created_at, d.chunk_text,
           (1 - (e.embedding <=> %s::vector)) AS score
    FROM documents d
    JOIN embeddings e ON e.document_id = d.id
    WHERE d.user_id = %s{date_sql}
    ORDER BY e.embedding <=> %s::vector
    LIMIT %s
    """.strip()

    keyword_predicate = " OR ".join(["d.chunk_text ILIKE %s" for _ in keyword_terms]) or "TRUE"
    keyword_sql = f"""
    SELECT d.id AS document_id, d.entry_id, d.created_at, d.chunk_text,
           0.25 AS score
    FROM documents d
    WHERE d.user_id = %s{date_sql} AND ({keyword_predicate})
    ORDER BY d.created_at DESC
    LIMIT %s
    """.strip()

    return vector_sql, keyword_sql


def _format_embedding(embedding: list[float]) -> str:
    return "[" + ",".join(f"{x:.8f}" for x in embedding) + "]"


def retrieve_hybrid(
    conn: Any,
    user_id: str,
    question: str,
    query_embedding: list[float],
    date_range: dict[str, str] | None = None,
    top_k: int = 6
) -> list[dict[str, Any]]:
    terms = tokenize_keywords(question)
    vector_sql, keyword_sql = build_retrieval_sql(date_range=date_range, keyword_terms=terms)
    date_sql, date_params = build_where_clause(date_range)

    embedding_literal = _format_embedding(query_embedding)

    vector_params = [embedding_literal, user_id, *date_params, embedding_literal, top_k]
    kw_params = [user_id, *date_params, *[f"%{t}%" for t in terms], top_k]

    results: dict[int, dict[str, Any]] = {}
    with conn.cursor() as cur:
        cur.execute(vector_sql, vector_params)
        for row in cur.fetchall():
            results[row["document_id"]] = dict(row)

        cur.execute(keyword_sql, kw_params)
        for row in cur.fetchall():
            doc_id = row["document_id"]
            if doc_id in results:
                results[doc_id]["score"] = max(results[doc_id]["score"], row["score"])
            else:
                results[doc_id] = dict(row)

    merged = list(results.values())
    merged.sort(key=lambda r: (r.get("score") or 0), reverse=True)
    return merged[:top_k]

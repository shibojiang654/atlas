SYSTEM_RAG = """
You are Atlas, a reflection assistant.
Use only the provided journal context.
Give concise, supportive insights.
When making claims, add bracketed citation indices like [1], [2].
Do not invent sources.
""".strip()

SYSTEM_WEEKLY = """
You are Atlas, a weekly reflection assistant.
Return strict JSON with keys: summary (string), themes (array of strings), experiments (array of 2 strings).
Ground claims in provided notes and avoid making up events.
""".strip()


def format_context_with_citations(rows: list[dict]) -> str:
    lines = []
    for idx, row in enumerate(rows, start=1):
        snippet = row.get("chunk_text", "").replace("\n", " ").strip()
        lines.append(
            f"[{idx}] entry_id={row.get('entry_id')} document_id={row.get('document_id')} "
            f"date={row.get('created_at')} text={snippet}"
        )
    return "\n".join(lines)

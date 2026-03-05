from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

from api._utils import get_json_body, get_user_id, response
from db.supabase import get_conn
from providers.llm_provider import generate_answer
from rag.prompts import SYSTEM_WEEKLY


def _safe_load_json(raw: str) -> dict:
    try:
        data = json.loads(raw)
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def handler(request):
    user_id = get_user_id(request)
    if not user_id:
        return response(401, {"error": "X-User-Id header is required"})

    payload = get_json_body(request)
    week_start_iso = payload.get("weekStartISO")
    if not week_start_iso:
        return response(400, {"error": "weekStartISO is required"})

    week_start = datetime.fromisoformat(week_start_iso).replace(tzinfo=timezone.utc)
    week_end = week_start + timedelta(days=7)

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, created_at, left(content, 500) AS snippet
                FROM entries
                WHERE user_id = %s
                  AND created_at >= %s
                  AND created_at < %s
                ORDER BY created_at ASC
                """,
                (user_id, week_start, week_end)
            )
            rows = cur.fetchall()

    context_lines = [
        f"entry_id={r['id']} date={r['created_at']} snippet={r['snippet']}" for r in rows
    ]
    context = "\n".join(context_lines) if context_lines else "No entries this week."

    prompt = (
        "Produce a weekly reflection using the provided notes. Include 2 practical experiments. "
        "Return strict JSON only."
    )
    raw = generate_answer(system=SYSTEM_WEEKLY, user=prompt, context=context)
    parsed = _safe_load_json(raw)

    summary = parsed.get("summary") or "No entries available to summarize for this week."
    themes = parsed.get("themes") if isinstance(parsed.get("themes"), list) else []
    experiments = parsed.get("experiments") if isinstance(parsed.get("experiments"), list) else []

    if len(experiments) < 2:
        experiments = [
            "Spend 10 minutes each evening noting one stress trigger and one helpful response.",
            "Schedule one 20-minute block this week for a low-friction reset activity (walk, stretch, journaling)."
        ]

    citations = [
        {
            "entryId": r["id"],
            "createdAt": str(r["created_at"]),
            "snippet": r["snippet"]
        }
        for r in rows[:6]
    ]

    return response(
        200,
        {
            "summary": summary,
            "themes": themes[:5],
            "experiments": experiments[:2],
            "citations": citations
        }
    )

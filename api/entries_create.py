from __future__ import annotations

from api._utils import get_json_body, get_user_id, response
from db.supabase import get_conn
from providers.embeddings_provider import embed_texts
from rag.chunking import split_into_chunks


def _vector_literal(values: list[float]) -> str:
    return "[" + ",".join(f"{v:.8f}" for v in values) + "]"


def handler(request):
    user_id = get_user_id(request)
    if not user_id:
        return response(401, {"error": "X-User-Id header is required"})

    payload = get_json_body(request)
    content = (payload.get("content") or "").strip()
    title = payload.get("title")

    if not content:
        return response(400, {"error": "content is required"})

    chunks = split_into_chunks(content)
    vectors = embed_texts(chunks) if chunks else []

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO entries (user_id, title, content)
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (user_id, title, content)
            )
            entry_id = cur.fetchone()["id"]

            for idx, chunk in enumerate(chunks):
                cur.execute(
                    """
                    INSERT INTO documents (entry_id, user_id, chunk_index, chunk_text)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                    """,
                    (entry_id, user_id, idx, chunk)
                )
                document_id = cur.fetchone()["id"]
                embedding_literal = _vector_literal(vectors[idx])
                cur.execute(
                    """
                    INSERT INTO embeddings (document_id, user_id, embedding)
                    VALUES (%s, %s, %s::vector)
                    """,
                    (document_id, user_id, embedding_literal)
                )

    return response(200, {"entryId": entry_id})

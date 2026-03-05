from __future__ import annotations

from api._utils import get_json_body, get_user_id, response
from db.supabase import get_conn
from providers.embeddings_provider import embed_texts
from providers.llm_provider import generate_answer
from rag.prompts import SYSTEM_RAG, format_context_with_citations
from rag.retrieval import retrieve_hybrid
from rag.safety import CRISIS_RESPONSE, detect_self_harm


def handler(request):
    user_id = get_user_id(request)
    if not user_id:
        return response(401, {"error": "X-User-Id header is required"})

    payload = get_json_body(request)
    question = (payload.get("question") or "").strip()
    date_range = payload.get("dateRange")

    if not question:
        return response(400, {"error": "question is required"})

    if detect_self_harm(question):
        return response(
            200,
            {
                "answer": CRISIS_RESPONSE,
                "citations": [],
                "debug": {"retrievedCount": 0},
                "safety": {"flagged": True, "message": CRISIS_RESPONSE}
            }
        )

    query_embedding = embed_texts([question])[0]

    with get_conn() as conn:
        retrieved = retrieve_hybrid(
            conn=conn,
            user_id=user_id,
            question=question,
            query_embedding=query_embedding,
            date_range=date_range,
            top_k=6
        )

    context = format_context_with_citations(retrieved)
    answer = generate_answer(system=SYSTEM_RAG, user=question, context=context)

    citations = [
        {
            "entryId": row["entry_id"],
            "documentId": row["document_id"],
            "createdAt": str(row["created_at"]),
            "snippet": row["chunk_text"][:220]
        }
        for row in retrieved
    ]

    return response(
        200,
        {
            "answer": answer,
            "citations": citations,
            "debug": {"retrievedCount": len(retrieved)},
            "safety": {"flagged": False}
        }
    )

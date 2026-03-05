from api._utils import get_user_id, response
from db.supabase import get_conn


def handler(request):
    user_id = get_user_id(request)
    if not user_id:
        return response(401, {"error": "X-User-Id header is required"})

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, title, left(content, 220) AS content_preview, created_at
                FROM entries
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 50
                """,
                (user_id,)
            )
            rows = cur.fetchall()

    return response(200, {"entries": rows})

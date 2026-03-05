from __future__ import annotations

import json
from typing import Any


def _get_header(request: Any, key: str) -> str | None:
    headers = getattr(request, "headers", None) or {}
    for k, v in headers.items():
        if k.lower() == key.lower():
            return v
    return None


def get_user_id(request: Any) -> str | None:
    return _get_header(request, "X-User-Id")


def get_json_body(request: Any) -> dict[str, Any]:
    if hasattr(request, "get_json"):
        data = request.get_json(silent=True)
        return data or {}

    if hasattr(request, "json"):
        data = request.json
        if isinstance(data, dict):
            return data

    body = getattr(request, "body", b"") or b""
    if isinstance(body, str):
        body = body.encode("utf-8")

    if not body:
        return {}

    try:
        data = json.loads(body.decode("utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def response(status: int, payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(payload, default=str)
    }

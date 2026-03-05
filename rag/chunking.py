from __future__ import annotations

from typing import List


def split_into_chunks(text: str, max_chunk_chars: int = 800, overlap_chars: int = 120) -> List[str]:
    normalized = " ".join(text.split())
    if not normalized:
        return []

    if len(normalized) <= max_chunk_chars:
        return [normalized]

    chunks: List[str] = []
    start = 0
    while start < len(normalized):
        end = min(start + max_chunk_chars, len(normalized))
        chunk = normalized[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(normalized):
            break
        start = max(0, end - overlap_chars)

    return chunks

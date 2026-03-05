from rag.chunking import split_into_chunks


def test_chunking_respects_max_chunk_size():
    text = "word " * 600
    chunks = split_into_chunks(text, max_chunk_chars=100, overlap_chars=20)

    assert len(chunks) > 1
    assert all(len(chunk) <= 100 for chunk in chunks)


def test_chunking_returns_single_chunk_for_short_text():
    chunks = split_into_chunks("short text", max_chunk_chars=100)
    assert chunks == ["short text"]

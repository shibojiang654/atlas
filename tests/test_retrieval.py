from rag.retrieval import build_retrieval_sql, build_where_clause


def test_build_where_clause_includes_date_filters():
    clause, params = build_where_clause({"start": "2026-03-01", "end": "2026-03-07"})
    assert "d.created_at >= %s" in clause
    assert "d.created_at <= %s" in clause
    assert params == ["2026-03-01", "2026-03-07"]


def test_build_retrieval_sql_includes_keyword_predicates():
    vector_sql, keyword_sql = build_retrieval_sql(None, ["stress", "sleep"])
    assert "ORDER BY e.embedding <=> %s::vector" in vector_sql
    assert "d.chunk_text ILIKE %s OR d.chunk_text ILIKE %s" in keyword_sql


def test_build_retrieval_sql_defaults_keyword_predicate_true_when_empty():
    _, keyword_sql = build_retrieval_sql(None, [])
    assert "(TRUE)" in keyword_sql

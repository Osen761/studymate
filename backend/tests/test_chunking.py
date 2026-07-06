from app.services.chunking import chunk_text


def test_chunk_text_ignores_empty_text() -> None:
    assert chunk_text(" \n\n ") == []


def test_chunk_text_uses_overlap() -> None:
    text = " ".join(f"word{i}" for i in range(80))
    chunks = chunk_text(text, chunk_size=120, overlap=20)
    assert len(chunks) > 1
    assert all(chunk.strip() for chunk in chunks)
    assert len(chunks[0]) <= 120


def test_chunk_text_rejects_invalid_overlap() -> None:
    try:
        chunk_text("hello", chunk_size=10, overlap=10)
    except ValueError as exc:
        assert "overlap" in str(exc)
    else:
        raise AssertionError("Expected ValueError")

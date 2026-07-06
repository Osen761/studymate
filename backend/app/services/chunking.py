DEFAULT_CHUNK_SIZE = 800
DEFAULT_OVERLAP = 120


def chunk_text(
    text: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")
    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("overlap must be greater than or equal to 0 and smaller than chunk_size")

    normalized = "\n".join(line.rstrip() for line in text.splitlines()).strip()
    if not normalized:
        return []

    chunks: list[str] = []
    start = 0

    while start < len(normalized):
        hard_end = min(start + chunk_size, len(normalized))
        end = hard_end

        if hard_end < len(normalized):
            readable_end = max(
                normalized.rfind("\n\n", start, hard_end),
                normalized.rfind("\n", start, hard_end),
                normalized.rfind(". ", start, hard_end),
                normalized.rfind(" ", start, hard_end),
            )
            if readable_end > start + (chunk_size // 2):
                end = readable_end + 1

        chunk = normalized[start:end].strip()
        if chunk:
            chunks.append(chunk)

        if end >= len(normalized):
            break

        start = max(0, end - overlap)
        while start < len(normalized) and normalized[start].isspace():
            start += 1

    return chunks

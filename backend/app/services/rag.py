from app.services.cortex import generate_content
from app.services.prompts import build_rag_prompt
from app.services.retrieval import build_context, retrieve_note_chunks

NO_CONTEXT_ANSWER = "I don't see that in your notes yet."


async def answer_question_from_note(
    *,
    note: dict,
    user_id: str,
    question: str,
    top_k: int,
    distance_threshold: float,
) -> dict:
    chunks = retrieve_note_chunks(
        user_id=user_id,
        note_id=note["id"],
        question=question,
        top_k=top_k,
        distance_threshold=distance_threshold,
    )
    context, sources = build_context(chunks)

    if not context:
        prompt = build_rag_prompt(question, "")
        return {
            "answer": NO_CONTEXT_ANSWER,
            "prompt": prompt,
            "context_used": None,
            "sources": [],
        }

    prompt = build_rag_prompt(question, context)
    response = await generate_content(prompt, temperature=0.2, max_output_tokens=900)
    return {
        "answer": response["text"],
        "prompt": prompt,
        "context_used": context,
        "sources": sources,
    }

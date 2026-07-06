STUDYMATE_SYSTEM_PROMPT = """You are StudyMate, a patient AI tutor.
When context is provided, answer only from the context.
If the answer is not in the context, say so honestly.
Use simple language.
Use examples when helpful.
Be concise unless asked otherwise.
Use clear Markdown formatting when it improves readability."""


def _note_header(note: dict) -> str:
    return (
        f"Title: {note.get('title')}\n"
        f"Course: {note.get('course') or 'Not provided'}\n"
        f"Topic: {note.get('topic') or 'Not provided'}"
    )


def build_summary_prompt(note: dict) -> str:
    return (
        "Summarize these study notes for a student.\n"
        "Use short sections: Big idea, Key details, What to remember.\n\n"
        f"{_note_header(note)}\n\nNotes:\n{note.get('content')}"
    )


def build_quiz_prompt(note: dict) -> str:
    return (
        "Create a short practice quiz from these notes.\n"
        "Include 5 questions, answers, and one-sentence explanations.\n\n"
        f"{_note_header(note)}\n\nNotes:\n{note.get('content')}"
    )


def build_explanation_prompt(note: dict) -> str:
    return (
        "Explain these notes simply, as if tutoring a first-year student.\n"
        "Use one helpful analogy if it fits.\n\n"
        f"{_note_header(note)}\n\nNotes:\n{note.get('content')}"
    )


def build_key_points_prompt(note: dict) -> str:
    return (
        "Extract the most important key points from these notes.\n"
        "Return concise bullets grouped by concept.\n\n"
        f"{_note_header(note)}\n\nNotes:\n{note.get('content')}"
    )


def build_rag_prompt(question: str, context: str) -> str:
    return (
        "Answer the student's question using only the context below.\n"
        "If the context does not contain the answer, say: "
        "\"I don't see that in your notes yet.\"\n\n"
        f"Question:\n{question}\n\nContext:\n{context}"
    )

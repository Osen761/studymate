from app.services.prompts import (
    STUDYMATE_SYSTEM_PROMPT,
    build_key_points_prompt,
    build_quiz_prompt,
    build_rag_prompt,
    build_summary_prompt,
)
from app.core.config import normalize_private_key


NOTE = {
    "title": "Neural Networks",
    "course": "AI Engineering",
    "topic": "Overfitting",
    "content": "Overfitting happens when a model memorizes training data.",
}


def test_system_prompt_sets_honest_context_boundary() -> None:
    assert "answer only from the context" in STUDYMATE_SYSTEM_PROMPT
    assert "say so honestly" in STUDYMATE_SYSTEM_PROMPT
    assert "Markdown formatting" in STUDYMATE_SYSTEM_PROMPT


def test_note_prompt_builders_include_note_content() -> None:
    for builder in (build_summary_prompt, build_quiz_prompt, build_key_points_prompt):
        prompt = builder(NOTE)
        assert "Neural Networks" in prompt
        assert "Overfitting happens" in prompt


def test_rag_prompt_includes_question_and_context() -> None:
    prompt = build_rag_prompt("What is overfitting?", "A model memorizes examples.")
    assert "What is overfitting?" in prompt
    assert "A model memorizes examples." in prompt


def test_normalize_private_key_removes_blank_pem_lines() -> None:
    key = '"-----BEGIN PRIVATE KEY-----\\n\\nabc123\\n\\n-----END PRIVATE KEY-----\\n"'
    assert normalize_private_key(key).splitlines() == [
        "-----BEGIN PRIVATE KEY-----",
        "abc123",
        "-----END PRIVATE KEY-----",
    ]

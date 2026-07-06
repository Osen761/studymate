from app.services.cortex import generate_content
from app.services.prompts import build_summary_prompt


async def summarize_note(note: dict) -> tuple[str, str]:
    prompt = build_summary_prompt(note)
    response = await generate_content(prompt, temperature=0.25, max_output_tokens=900)
    return prompt, response["text"]

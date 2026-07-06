from app.services.cortex import generate_content
from app.services.prompts import build_explanation_prompt


async def explain_note(note: dict) -> tuple[str, str]:
    prompt = build_explanation_prompt(note)
    response = await generate_content(prompt, temperature=0.35, max_output_tokens=1000)
    return prompt, response["text"]

from app.services.cortex import generate_content
from app.services.prompts import build_quiz_prompt


async def generate_quiz(note: dict) -> tuple[str, str]:
    prompt = build_quiz_prompt(note)
    response = await generate_content(prompt, temperature=0.45, max_output_tokens=1200)
    return prompt, response["text"]

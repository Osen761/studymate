from app.services.cortex import generate_content
from app.services.prompts import build_key_points_prompt


async def extract_key_points(note: dict) -> tuple[str, str]:
    prompt = build_key_points_prompt(note)
    response = await generate_content(prompt, temperature=0.2, max_output_tokens=900)
    return prompt, response["text"]

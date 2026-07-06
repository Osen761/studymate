from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.services.prompts import STUDYMATE_SYSTEM_PROMPT


def _extract_text(payload: dict[str, Any]) -> str:
    candidates = payload.get("candidates") or []
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts", [])
    return "".join(part.get("text", "") for part in parts).strip()


def _raise_clean_error(response: httpx.Response) -> None:
    detail_by_status = {
        401: "Invalid Cortex API key.",
        403: "Cortex rejected the request because the model is forbidden or quota is unavailable.",
        429: "Cortex rate limit reached. Please try again soon.",
    }
    if response.status_code in detail_by_status:
        raise HTTPException(status_code=response.status_code, detail=detail_by_status[response.status_code])
    if response.status_code >= 500:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Cortex or the upstream model service is temporarily unavailable.",
        )
    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Cortex request failed.",
    )


async def generate_content(
    prompt: str,
    *,
    system_prompt: str = STUDYMATE_SYSTEM_PROMPT,
    temperature: float = 0.3,
    max_output_tokens: int = 1024,
) -> dict[str, Any]:
    url = f"{settings.cortex_url.rstrip('/')}/v1/models/{settings.cortex_model}:generateContent"
    body = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_output_tokens,
        },
    }
    headers = {
        "content-type": "application/json",
        "x-api-key": settings.cortex_api_key,
    }

    try:
        async with httpx.AsyncClient(timeout=45) as client:
            response = await client.post(url, headers=headers, json=body)
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Cortex request timed out.") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Could not reach Cortex.") from exc

    if response.status_code >= 400:
        _raise_clean_error(response)

    raw = response.json()
    text = _extract_text(raw)
    if not text:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Cortex returned an empty response.")

    return {
        "text": text,
        "raw": raw,
        "usage_metadata": raw.get("usageMetadata"),
    }

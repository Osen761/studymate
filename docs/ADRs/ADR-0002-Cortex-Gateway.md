# ADR-0002: Cortex AI Gateway

## Status

Accepted

## Decision

StudyMate calls Cortex AI Gateway from the backend instead of calling Vertex AI or Gemini SDKs directly.

## Rationale

Cortex centralizes model access, keys, quota, and policy. It also keeps model secrets away from the browser.

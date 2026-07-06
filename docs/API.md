# StudyMate API

Base URL: `http://localhost:8000`

All protected endpoints require:

`Authorization: Bearer <firebase_id_token>`

## Health

`GET /health`

Returns backend status.

## Auth

`GET /api/v1/auth/me`

Verifies the Firebase token and creates `users/{uid}` on first authenticated request.

`GET /api/v1/auth/stats`

Returns `total_notes` and `total_ai_outputs`.

## Notes

`GET /api/v1/notes`

`POST /api/v1/notes`

```json
{
  "title": "Overfitting",
  "course": "AI Engineering",
  "topic": "Model evaluation",
  "content": "..."
}
```

`GET /api/v1/notes/{note_id}`

`PUT /api/v1/notes/{note_id}`

`DELETE /api/v1/notes/{note_id}`

Users can access only their own notes.

## AI

`GET /api/v1/notes/{note_id}/outputs`

`POST /api/v1/notes/{note_id}/summary`

`POST /api/v1/notes/{note_id}/quiz`

`POST /api/v1/notes/{note_id}/explanation`

`POST /api/v1/notes/{note_id}/key-points`

`POST /api/v1/notes/{note_id}/ask`

```json
{
  "question": "What is overfitting?",
  "top_k": 3,
  "distance_threshold": 0.8
}
```

The ask endpoint retrieves filtered ChromaDB chunks by `user_id` and `note_id`, builds context, calls Cortex, saves an `ai_outputs` document, and returns the answer with sources.

# ADR-0003: ChromaDB

## Status

Accepted

## Decision

Use ChromaDB `PersistentClient` with a single `studymate_notes` collection.

## Rationale

ChromaDB is simple enough for students to understand before LangChain is introduced, and persistent local storage makes restarts predictable.

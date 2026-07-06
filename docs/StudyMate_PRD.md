# StudyMate PRD

## Product

StudyMate is an AI-powered learning companion for students in the AI Engineering Track. It turns course notebooks into a working product students can study, run, and extend.

## v0.5 Goal

Deliver the first usable product version with authentication, notes, prompt engineering, Cortex integration, chunking, embeddings, ChromaDB persistence, retrieval, and RAG question answering.

## Users

- Students creating notes and asking questions from their own material.
- Instructors teaching how notebook concepts become product services.

## Core Workflows

1. A student signs in with Firebase Auth.
2. The student creates or updates a note.
3. The backend stores the note, chunks content, saves chunk metadata, and persists embeddings in ChromaDB.
4. The student requests a summary, quiz, explanation, key points, or RAG answer.
5. The backend calls Cortex and stores the AI output.

## Non-Goals

LangChain, PDF uploads, payments, admin dashboards, and direct Vertex/Gemini SDK calls are intentionally excluded from v0.5.

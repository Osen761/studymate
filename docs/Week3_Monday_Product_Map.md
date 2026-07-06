# Week 3 Monday Product Map

This map shows how the notebook concepts become StudyMate product code.

| Notebook Concept | Product Module |
| --- | --- |
| ChromaDB client | `backend/app/db/chroma.py` |
| Notebook chunking | `backend/app/services/chunking.py` |
| `ask_via_cortex` | `backend/app/services/cortex.py` |
| `ask_studymate_v5` | `backend/app/services/rag.py` |
| Product UI | `frontend/app/notes/[id]/page.tsx` and `frontend/components/ai/AIWorkspace.tsx` |

The direct implementation is intentional. LangChain arrives in the next milestone as a refactor, not as magic students must accept before seeing the underlying pieces.

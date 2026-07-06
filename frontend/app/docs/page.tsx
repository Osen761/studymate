import { Card } from "@/components/ui/Card";

const sections = [
  {
    title: "Cortex Gateway",
    body: "The browser calls FastAPI, then FastAPI calls Cortex with the backend-only CORTEX_API_KEY. StudyMate never calls Vertex AI or the Gemini SDK directly."
  },
  {
    title: "ChromaDB",
    body: "When a note is saved, the backend chunks readable text, stores chunk metadata in Firestore, and upserts matching chunk IDs into the persistent studymate_notes ChromaDB collection."
  },
  {
    title: "Notebook to Product",
    body: "Notebook functions become service modules: db/chroma.py, services/chunking.py, services/cortex.py, services/rag.py, and a usable notes workspace."
  },
  {
    title: "v0.5 Architecture",
    body: "Next.js handles auth and UI. FastAPI verifies Firebase ID tokens, owns AI logic, enforces ownership, retrieves context, saves AI outputs, and returns student-friendly responses."
  },
  {
    title: "Tomorrow",
    body: "LangChain is intentionally not included yet. It becomes the next refactor after students understand the direct implementation."
  }
];

export default function DocsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold text-teal">StudyMate docs</p>
        <h1 className="mt-2 text-3xl font-bold">How v0.5 works</h1>
        <p className="mt-2 max-w-3xl text-muted">A student-readable map of authentication, notes, chunks, embeddings, retrieval, RAG, and Cortex integration.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-xl font-bold">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{section.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

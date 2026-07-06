"use client";

import { useEffect, useState } from "react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { NoteList } from "@/components/notes/NoteList";
import { useAuth } from "@/hooks/useAuth";
import { listNotes } from "@/lib/api/notes";
import type { Note } from "@/types";

export default function NotesPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    listNotes(token)
      .then((response) => setNotes(response.notes))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load notes"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth>
      <div className="grid gap-5">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="mt-2 text-muted">Your learning source material for chunking, embeddings, and RAG.</p>
        </div>
        {loading ? <p className="rounded-lg border border-line bg-white p-5 text-muted">Loading notes...</p> : null}
        {error ? <p className="rounded-md border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p> : null}
        {!loading && !error ? <NoteList notes={notes} /> : null}
      </div>
    </RequireAuth>
  );
}

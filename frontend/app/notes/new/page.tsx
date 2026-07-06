"use client";

import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { NoteForm } from "@/components/notes/NoteForm";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { createNote } from "@/lib/api/notes";
import type { NoteInput } from "@/types";

export default function NewNotePage() {
  const { token } = useAuth();
  const router = useRouter();

  async function submit(note: NoteInput) {
    if (!token) return;
    const saved = await createNote(token, note);
    router.push(`/notes/${saved.id}`);
  }

  return (
    <RequireAuth>
      <div className="grid gap-5">
        <div>
          <h1 className="text-3xl font-bold">Create note</h1>
          <p className="mt-2 text-muted">Saving creates Firestore metadata, chunks, and ChromaDB embeddings.</p>
        </div>
        <Card>
          <NoteForm submitLabel="Save note" onSubmit={submit} />
        </Card>
      </div>
    </RequireAuth>
  );
}

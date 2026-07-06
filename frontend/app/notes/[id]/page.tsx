"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AIWorkspace } from "@/components/ai/AIWorkspace";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { listAIOutputs } from "@/lib/api/ai";
import { getNote } from "@/lib/api/notes";
import type { AIOutput, Note } from "@/types";

export default function NoteWorkspacePage() {
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [outputs, setOutputs] = useState<AIOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !params.id) return;
    setLoading(true);
    Promise.all([getNote(token, params.id), listAIOutputs(token, params.id)])
      .then(([loadedNote, loadedOutputs]) => {
        setNote(loadedNote);
        setOutputs(loadedOutputs);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load workspace"))
      .finally(() => setLoading(false));
  }, [params.id, token]);

  return (
    <RequireAuth>
      {loading ? <p className="rounded-lg border border-line bg-white p-5 text-muted">Loading note workspace...</p> : null}
      {error ? <p className="rounded-md border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p> : null}
      {!loading && note && token ? <AIWorkspace note={note} initialOutputs={outputs} token={token} /> : null}
    </RequireAuth>
  );
}

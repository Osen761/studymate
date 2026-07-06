"use client";

import { useEffect, useState } from "react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { useAuth } from "@/hooks/useAuth";
import { getStats } from "@/lib/api/auth";
import { listNotes } from "@/lib/api/notes";
import type { Note } from "@/types";

export default function DashboardPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalAIOutputs, setTotalAIOutputs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([listNotes(token), getStats(token)])
      .then(([notesResponse, stats]) => {
        setNotes(notesResponse.notes);
        setTotalAIOutputs(stats.total_ai_outputs);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load dashboard"));
  }, [token]);

  return (
    <RequireAuth>
      {error ? (
        <p className="rounded-md border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>
      ) : (
        <DashboardHome notes={notes} totalAIOutputs={totalAIOutputs} />
      )}
    </RequireAuth>
  );
}

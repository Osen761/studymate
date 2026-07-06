"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Note } from "@/types";

export function NoteList({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return notes.filter((note) =>
      [note.title, note.course, note.topic, note.content].join(" ").toLowerCase().includes(needle)
    );
  }, [notes, query]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="focus-within:ring-teal flex min-h-11 items-center gap-2 rounded-md border border-line bg-white px-3 focus-within:ring-2">
          <Search className="h-4 w-4 text-muted" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search notes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Link href="/notes/new">
          <Button>
            <Plus className="h-4 w-4" />
            New note
          </Button>
        </Link>
      </div>
      {filtered.length === 0 ? (
        <Card className="text-center">
          <h2 className="text-lg font-semibold">No notes found</h2>
          <p className="mt-2 text-sm text-muted">Create a note to unlock summaries, quizzes, explanations, and RAG answers.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`} className="focus-ring rounded-lg">
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-teal">
                <p className="text-xs font-semibold uppercase text-teal">{note.course || "General"}</p>
                <h2 className="mt-2 text-xl font-bold">{note.title}</h2>
                <p className="mt-1 text-sm text-muted">{note.topic || "No topic"}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/80">{note.content}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { FileText, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Note } from "@/types";

export function DashboardHome({ notes, totalAIOutputs }: { notes: Note[]; totalAIOutputs: number }) {
  const recent = notes.slice(0, 4);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-teal">StudyMate v0.5</p>
          <h1 className="mt-2 text-3xl font-bold">Notebook-to-product workspace</h1>
          <p className="mt-2 max-w-2xl text-muted">Create notes, chunk them into ChromaDB, and ask Cortex-powered questions from your own study context.</p>
        </div>
        <Link href="/notes/new">
          <Button>
            <Plus className="h-4 w-4" />
            Quick create note
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <FileText className="h-5 w-5 text-teal" />
          <p className="mt-3 text-3xl font-bold">{notes.length}</p>
          <p className="text-sm text-muted">Total notes</p>
        </Card>
        <Card>
          <Sparkles className="h-5 w-5 text-gold" />
          <p className="mt-3 text-3xl font-bold">{totalAIOutputs}</p>
          <p className="text-sm text-muted">Total AI outputs</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-coral">Docs</p>
          <p className="mt-3 text-sm leading-6 text-muted">Review the v0.5 architecture and the Week 3 Monday product map.</p>
          <Link className="mt-4 inline-block text-sm font-semibold text-teal" href="/docs">
            Open docs
          </Link>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-bold">Recent notes</h2>
        <div className="mt-4 grid gap-3">
          {recent.length === 0 ? (
            <p className="text-sm text-muted">No notes yet.</p>
          ) : (
            recent.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`} className="focus-ring rounded-md border border-line p-3 hover:border-teal">
                <p className="font-semibold">{note.title}</p>
                <p className="text-sm text-muted">{note.course || "General"} / {note.topic || "No topic"}</p>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

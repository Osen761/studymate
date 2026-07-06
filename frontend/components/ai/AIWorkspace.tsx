"use client";

import { Clipboard, HelpCircle, Highlighter, ListChecks, MessageSquareText, Pencil, Trash2, WandSparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { NoteForm } from "@/components/notes/NoteForm";
import { MarkdownOutput } from "@/components/ai/MarkdownOutput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteNote, updateNote } from "@/lib/api/notes";
import { askStudyMate, runAIAction } from "@/lib/api/ai";
import type { AIOutput, Note, NoteInput } from "@/types";

const actions = [
  { label: "Summarize", value: "summary", icon: WandSparkles },
  { label: "Generate Quiz", value: "quiz", icon: HelpCircle },
  { label: "Explain Simply", value: "explanation", icon: MessageSquareText },
  { label: "Extract Key Points", value: "key-points", icon: ListChecks }
] as const;

export function AIWorkspace({
  note,
  initialOutputs,
  token
}: {
  note: Note;
  initialOutputs: AIOutput[];
  token: string;
}) {
  const router = useRouter();
  const [currentNote, setCurrentNote] = useState(note);
  const [outputs, setOutputs] = useState(initialOutputs);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  async function runAction(action: (typeof actions)[number]["value"]) {
    setBusy(action);
    setError(null);
    try {
      const response = await runAIAction(token, currentNote.id, action);
      setOutputs((current) => [response.output, ...current]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI action failed");
    } finally {
      setBusy(null);
    }
  }

  async function ask() {
    if (!question.trim()) return;
    setBusy("ask");
    setError(null);
    try {
      const response = await askStudyMate(token, currentNote.id, question);
      setOutputs((current) => [response.output, ...current]);
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Question failed");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!confirm("Delete this note and its AI outputs?")) return;
    await deleteNote(token, currentNote.id);
    router.push("/notes");
  }

  async function saveEdit(payload: NoteInput) {
    const saved = await updateNote(token, currentNote.id, payload);
    setCurrentNote(saved);
    setEditing(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <section className="grid gap-4">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal">{currentNote.course || "General"} / {currentNote.topic || "Untitled topic"}</p>
              <h1 className="mt-2 text-3xl font-bold">{currentNote.title}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing((value) => !value)}>
                {editing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {editing ? "Cancel" : "Edit"}
              </Button>
              <Button variant="danger" onClick={remove}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          {editing ? (
            <div className="mt-6">
              <NoteForm initial={currentNote} submitLabel="Update note" onSubmit={saveEdit} />
            </div>
          ) : (
            <div className="mt-6 whitespace-pre-wrap rounded-md border border-line bg-paper p-4 text-sm leading-7">{currentNote.content}</div>
          )}
        </div>
        <Card>
          <h2 className="text-lg font-bold">Output History</h2>
          <div className="mt-4 grid gap-4">
            {outputs.length === 0 ? (
              <p className="text-sm text-muted">AI outputs will appear here after you run an action.</p>
            ) : (
              outputs.map((output) => <OutputCard key={output.id} output={output} />)
            )}
          </div>
        </Card>
      </section>
      <aside className="grid h-fit gap-4 rounded-lg border border-line bg-white p-5 shadow-soft">
        <h2 className="text-lg font-bold">AI Actions</h2>
        <div className="grid gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.value} variant="secondary" disabled={Boolean(busy)} onClick={() => runAction(action.value)}>
                <Icon className="h-4 w-4" />
                {busy === action.value ? "Working..." : action.label}
              </Button>
            );
          })}
        </div>
        <div className="grid gap-3 border-t border-line pt-4">
          <label className="grid gap-2 text-sm font-medium">
            Ask StudyMate
            <textarea
              className="focus-ring min-h-28 resize-y rounded-md border border-line p-3 text-sm outline-none"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="What should I understand from this note?"
            />
          </label>
          <Button disabled={Boolean(busy) || !question.trim()} onClick={ask}>
            <Highlighter className="h-4 w-4" />
            {busy === "ask" ? "Retrieving..." : "Ask"}
          </Button>
        </div>
        {error ? <p className="rounded-md border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p> : null}
      </aside>
    </div>
  );
}

function OutputCard({ output }: { output: AIOutput }) {
  async function copy() {
    await navigator.clipboard.writeText(output.output);
  }

  return (
    <article className="rounded-md border border-line p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-gold">{output.type.replace("_", " ")}</p>
        <button className="focus-ring rounded-md p-2 text-muted hover:bg-paper" onClick={copy} title="Copy output" aria-label="Copy output">
          <Clipboard className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3">
        <MarkdownOutput content={output.output} />
      </div>
      {output.sources.length > 0 ? (
        <details className="mt-4 rounded-md bg-paper p-3 text-sm">
          <summary className="cursor-pointer font-semibold">Sources used</summary>
          <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(output.sources, null, 2)}</pre>
        </details>
      ) : null}
      {output.context_used ? (
        <details className="mt-2 rounded-md bg-paper p-3 text-sm">
          <summary className="cursor-pointer font-semibold">Context used</summary>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-5">{output.context_used}</p>
        </details>
      ) : null}
    </article>
  );
}

"use client";

import { Save } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/ui/Field";
import type { Note, NoteInput } from "@/types";

export function NoteForm({
  initial,
  submitLabel,
  onSubmit
}: {
  initial?: Partial<Note>;
  submitLabel: string;
  onSubmit: (note: NoteInput) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [course, setCourse] = useState(initial?.course ?? "");
  const [topic, setTopic] = useState(initial?.topic ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ title, course, topic, content });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <Field label="Course" value={course ?? ""} onChange={(event) => setCourse(event.target.value)} />
        <Field label="Topic" value={topic ?? ""} onChange={(event) => setTopic(event.target.value)} />
      </div>
      <TextArea label="Notes" value={content} onChange={(event) => setContent(event.target.value)} required className="min-h-[420px]" />
      {error ? <p className="rounded-md border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p> : null}
      <Button disabled={saving} className="w-fit" type="submit">
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

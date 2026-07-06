import { apiFetch } from "@/lib/api/client";
import type { Note, NoteInput } from "@/types";

export async function listNotes(token: string) {
  return apiFetch<{ notes: Note[] }>("/api/v1/notes", token);
}

export async function getNote(token: string, noteId: string) {
  return apiFetch<Note>(`/api/v1/notes/${noteId}`, token);
}

export async function createNote(token: string, note: NoteInput) {
  return apiFetch<Note>("/api/v1/notes", token, {
    method: "POST",
    body: JSON.stringify(note)
  });
}

export async function updateNote(token: string, noteId: string, note: NoteInput) {
  return apiFetch<Note>(`/api/v1/notes/${noteId}`, token, {
    method: "PUT",
    body: JSON.stringify(note)
  });
}

export async function deleteNote(token: string, noteId: string) {
  return apiFetch<{ message: string }>(`/api/v1/notes/${noteId}`, token, {
    method: "DELETE"
  });
}

import { apiFetch } from "@/lib/api/client";
import type { AIOutput, AskResponse } from "@/types";

export type AIAction = "summary" | "quiz" | "explanation" | "key-points";

export async function runAIAction(token: string, noteId: string, action: AIAction) {
  return apiFetch<{ output: AIOutput }>(`/api/v1/notes/${noteId}/${action}`, token, {
    method: "POST"
  });
}

export async function askStudyMate(token: string, noteId: string, question: string) {
  return apiFetch<AskResponse>(`/api/v1/notes/${noteId}/ask`, token, {
    method: "POST",
    body: JSON.stringify({ question, top_k: 3, distance_threshold: 0.8 })
  });
}

export async function listAIOutputs(token: string, noteId: string) {
  return apiFetch<AIOutput[]>(`/api/v1/notes/${noteId}/outputs`, token);
}

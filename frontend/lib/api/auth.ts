import { apiFetch } from "@/lib/api/client";

export async function getStats(token: string) {
  return apiFetch<{ total_notes: number; total_ai_outputs: number }>("/api/v1/auth/stats", token);
}

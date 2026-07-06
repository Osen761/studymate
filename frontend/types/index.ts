export type Note = {
  id: string;
  user_id: string;
  title: string;
  course?: string | null;
  topic?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

export type NoteInput = {
  title: string;
  course?: string;
  topic?: string;
  content: string;
};

export type AIOutput = {
  id: string;
  user_id: string;
  note_id: string;
  type: "summary" | "quiz" | "explanation" | "key_points" | "answer";
  prompt: string;
  output: string;
  context_used?: string | null;
  sources: Array<Record<string, unknown>>;
  created_at: string;
};

export type AskResponse = {
  answer: string;
  context_used: string | null;
  sources: Array<Record<string, unknown>>;
  output: AIOutput;
};

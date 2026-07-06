"use client";

import { Chrome, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { loginWithEmail, loginWithGoogle, registerWithEmail } from "@/lib/auth/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-md gap-4 rounded-lg border border-line bg-white p-6 shadow-soft">
      <div>
        <h1 className="text-2xl font-bold">Enter StudyMate</h1>
        <p className="mt-1 text-sm text-muted">Your Firebase account protects notes and AI outputs.</p>
      </div>
      <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
      {error ? <p className="rounded-md border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p> : null}
      <Button disabled={loading} type="submit">
        <Mail className="h-4 w-4" />
        {mode === "login" ? "Login" : "Create account"}
      </Button>
      <Button disabled={loading} type="button" variant="secondary" onClick={google}>
        <Chrome className="h-4 w-4" />
        Continue with Google
      </Button>
      <button
        className="focus-ring rounded-md py-2 text-sm font-semibold text-teal"
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Need an account?" : "Already have an account?"}
      </button>
    </form>
  );
}

import { ArrowRight, BrainCircuit, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="grid gap-12">
      <section className="grid min-h-[70vh] content-center gap-8 py-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-teal">StudyMate v0.5</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">StudyMate</h1>
          <p className="mt-5 text-xl leading-8 text-muted">
            An AI-powered learning companion where notebook experiments become product features students can run, inspect, and extend.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button>
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="secondary">Read architecture</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <ShieldCheck className="h-6 w-6 text-teal" />
            <h2 className="mt-3 font-bold">Authenticated notes</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Firebase Auth protects every API request and the backend owns all user identity checks.</p>
          </Card>
          <Card>
            <Database className="h-6 w-6 text-coral" />
            <h2 className="mt-3 font-bold">Persistent retrieval</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Notes are chunked, stored in Firestore, embedded, and indexed in persistent ChromaDB.</p>
          </Card>
          <Card>
            <BrainCircuit className="h-6 w-6 text-gold" />
            <h2 className="mt-3 font-bold">Cortex-powered AI</h2>
            <p className="mt-2 text-sm leading-6 text-muted">The frontend never sees AI secrets. FastAPI calls Cortex and returns clean product responses.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

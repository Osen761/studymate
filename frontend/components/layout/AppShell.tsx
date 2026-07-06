"use client";

import { BookOpen, FileText, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth/client";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <BookOpen className="h-5 w-5 text-teal" />
            StudyMate
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white" href="/dashboard">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link className="focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white" href="/notes">
              <FileText className="h-4 w-4" />
              Notes
            </Link>
            <Link className="focus-ring rounded-md px-3 py-2 hover:bg-white" href="/docs">
              Docs
            </Link>
            {user ? (
              <Button variant="ghost" onClick={handleLogout} title="Sign out" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Link className="focus-ring rounded-md bg-teal px-4 py-2 font-semibold text-white" href="/login">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

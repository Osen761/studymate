"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return <div className="rounded-lg border border-line bg-white p-6 text-muted">Loading your StudyMate workspace...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

"use client";

import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getIdToken, observeAuth } from "@/lib/auth/client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  token: string | null;
  refreshToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return observeAuth(async (nextUser) => {
      setUser(nextUser);
      setToken(nextUser ? await getIdToken(nextUser) : null);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      token,
      refreshToken: async () => {
        if (!user) return null;
        const nextToken = await getIdToken(user);
        setToken(nextToken);
        return nextToken;
      }
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import type { User } from "@/types";

/**
 * Stores the access token AND refresh token in localStorage.
 * The Axios interceptor in api.ts handles silent token refresh automatically.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    authService
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, tokens } = await authService.login({ email, password });
    localStorage.setItem("access_token", tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem("refresh_token", tokens.refreshToken);
    }
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // best-effort — clear local state regardless
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

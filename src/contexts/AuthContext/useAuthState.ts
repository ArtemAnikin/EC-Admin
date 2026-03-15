import { useCallback, useMemo, useState } from 'react';
import type { User } from '@/lib/types/user';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

/** Hook holding all auth state and actions. Used by AuthProvider. */
export function useAuthState(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((u: User) => {
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      login,
      logout,
    }),
    [user, login, logout],
  );
}

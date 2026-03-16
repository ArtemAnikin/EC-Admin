import type { ReactNode } from 'react';
import { AuthContext } from './context';
import { useAuthState } from './useAuthState';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const value = useAuthState();
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

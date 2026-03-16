import { createContext } from 'react';
import type { AuthContextValue } from './useAuthState';

export const AuthContext = createContext<AuthContextValue | null>(null);

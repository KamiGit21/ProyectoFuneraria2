// web/src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';

export type User = { id: number; email: string; rol: string } | null;

interface AuthCtx {
  user: User;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Al inicio se carga el usuario del localStorage (si existe)
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

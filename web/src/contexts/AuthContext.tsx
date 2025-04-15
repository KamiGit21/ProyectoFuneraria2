import { createContext, useState, ReactNode } from 'react';

export type User = { id: number; email: string; rol: string } | null;

interface AuthCtx {
  user: User;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(JSON.parse(localStorage.getItem('usuario') || 'null'));

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

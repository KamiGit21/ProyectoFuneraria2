import { createContext, useState, ReactNode } from 'react';

interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (user: Usuario, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (usr: Usuario, tk: string) => {
    setUser(usr);
    setToken(tk);
    localStorage.setItem('token', tk);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

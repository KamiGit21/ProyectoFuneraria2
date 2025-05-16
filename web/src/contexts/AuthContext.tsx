// web/src/contexts/AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import api from '../api/axiosInstance';

export interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rol: 'ADMIN' | 'OPERADOR' | 'CLIENTE';
}

interface AuthCtx {
  user  : Usuario | null;
  token : string  | null;
  login : (u: Usuario, t: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user , setUser ] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string  | null>(null);

  // Al montar, rehidrata desde localStorage:
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) return;
    api.get<Usuario>('/auth/me', {
      headers: { Authorization: `Bearer ${t}` }
    })
    .then(r => {
      setToken(t);
      setUser(r.data);
    })
    .catch(() => {
      localStorage.removeItem('token');
    });
  }, []);

  const login = (u: Usuario, t: string) => {
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

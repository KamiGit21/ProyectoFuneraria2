// web/src/components/PrivateRoute.tsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const authCtx = useContext(AuthContext);

  if (!authCtx || !authCtx.user) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(authCtx.user.rol)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

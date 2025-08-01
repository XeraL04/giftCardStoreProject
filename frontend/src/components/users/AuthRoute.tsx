import type React from 'react';
import { useAuthStore } from '../../app/store';
// import { Navigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export function AuthRoute({children} : React.PropsWithChildren) {
  
  const user = useAuthStore(s => s.user);

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
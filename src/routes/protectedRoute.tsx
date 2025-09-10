import { useAuth } from "react-oidc-context";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();

useEffect(() => {
  if (!auth.isLoading && !auth.isAuthenticated) {
    auth.signinRedirect();
  }
}, [auth.isLoading, auth.isAuthenticated, auth]);

  if (auth.isLoading) return <div>Carregando...</div>;
  if (auth.error) return <div>Erro: {auth.error.message}</div>;
  if (!auth.isAuthenticated) return null; // enquanto redireciona

  return <>{children}</>;
}

import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) return <div>Verificando sessão...</div>;
  if (!auth.isAuthenticated) return <Navigate to="/logged-out" replace />;

  return <>{children}</>;
}

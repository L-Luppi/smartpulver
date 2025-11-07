import { useAuth } from "react-oidc-context";
import { ReactNode, useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (auth.error) return <div>Erro: {auth.error.message}</div>;
  if (!auth.isAuthenticated) return null;

  return <>{children}</>;
}

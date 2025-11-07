import { useAuth } from "react-oidc-context";
import { ReactNode, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

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

  if (auth.error)
    return <div>Erro de autenticação: {auth.error.message}</div>;

  if (!auth.isAuthenticated) return null;

  return <>{children}</>;
}

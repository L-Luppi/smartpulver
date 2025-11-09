import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const { access_token, id_token } = auth.user;
      if (access_token) localStorage.setItem("access_token", access_token);
      if (id_token) localStorage.setItem("id_token", id_token);
      navigate("/app", { replace: true });
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  if (auth.isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "center" }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Autenticando...
        </Typography>
      </Box>
    );
  }

  if (auth.error) {
    console.error("[LoginCallback] Erro:", auth.error);
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "center" }}>
        <Typography variant="h6" color="error">Erro ao autenticar</Typography>
        <Typography variant="body2">{auth.error.message}</Typography>
        <Button onClick={() => auth.signinRedirect()} variant="contained" sx={{ mt: 2 }}>
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress />
    </Box>
  );
}

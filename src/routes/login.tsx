import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🚀 Quando o login termina e o usuário está autenticado
    if (!auth.isLoading && auth.isAuthenticated && auth.user) {
      const { access_token, id_token } = auth.user;

      // Salva tokens localmente (opcional, se quiser reaproveitar em APIs)
      if (access_token) localStorage.setItem("access_token", access_token);
      if (id_token) localStorage.setItem("id_token", id_token);

      // Redireciona para a dashboard
      navigate("/app", { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, navigate]);

  // 🔄 Enquanto o Cognito troca o "code" pelo token
  if (auth.isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Autenticando, aguarde...
        </Typography>
      </Box>
    );
  }

  // ❌ Se o login falhou (token inválido, redirect errado, etc.)
  if (auth.error) {
    console.error("[LoginCallback] Erro no login:", auth.error);
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error">
          Falha na autenticação
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {auth.error.message || "Tente novamente em instantes."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => auth.signinRedirect()}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  // 💤 Se ainda não está autenticado nem carregando (ex: URL errada)
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

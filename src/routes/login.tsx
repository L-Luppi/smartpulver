import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  // 🔹 Captura a rota anterior antes do login (caso tenha sido salva)
  const from = sessionStorage.getItem("redirect_after_login") || "/app";

  // 🔹 Lida com sucesso de login
 useEffect(() => {
  if (auth.isAuthenticated && auth.user) {
    const { access_token, id_token } = auth.user;
    if (access_token) localStorage.setItem("access_token", access_token);
    if (id_token) localStorage.setItem("id_token", id_token);

    sessionStorage.removeItem("redirect_after_login");
    navigate(from, { replace: true });
  }
}, [auth.isAuthenticated, auth.user, navigate, from]);


  // 🔹 Mostra loading enquanto o callback está processando
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

  // 🔹 Trata erros de forma mais clara e amigável
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

  // 🔹 Estado final de fallback — caso algo estranho aconteça
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

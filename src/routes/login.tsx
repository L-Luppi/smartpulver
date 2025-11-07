import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  // 👇 Redireciona assim que a autenticação for concluída
  useEffect(() => {
    if (auth.isAuthenticated) {
      // Se quiser, pode salvar o token aqui, por exemplo:
      // localStorage.setItem("access_token", auth.user?.access_token);
      navigate("/app"); // redireciona
    }
  }, [auth.isAuthenticated, navigate]);

  // Enquanto está carregando o callback (usuário retornando do Cognito)
  if (auth.isLoading && !auth.isAuthenticated) {
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

  // Se houve erro no processo
  if (auth.error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="mb-4 text-red-600">Erro: {auth.error.message}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => auth.signinRedirect()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Exibe algo rápido enquanto finaliza o fluxo
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

import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      if (!auth.isAuthenticated) return;

      const idToken = auth.user?.id_token;

      try {
        const res = await fetch("https://0y96x2o50j.execute-api.sa-east-1.amazonaws.com/prod/api/v1/smart/plans", {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res)
        if (!res.ok) {
          throw new Error("Erro ao buscar planos");
        }

        const data = await res.json();

        // Exemplo: verificando se o usuário tem algum plano ativo
        const hasActiveSubscription = data?.data?.some(
          (plano: any) => plano.status === "ativo"
        );

        if (hasActiveSubscription) {
          navigate("/dashboard");
        } else {
          // window.location.href =
          //   "https://buy.stripe.com/test_4gM8wI2l7gpZ8cs7vP9IQ00";
        }
      } catch (err) {
        console.error("Erro ao verificar assinatura:", err);
        // window.location.href =
        //   "https://buy.stripe.com/test_4gM8wI2l7gpZ8cs7vP9IQ00";
      }
    };

    checkSubscription();
  }, [auth, navigate]);

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

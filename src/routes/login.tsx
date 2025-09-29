import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      if (!auth.isAuthenticated) return;

      const idToken = auth.user?.id_token;

      try {
        // 🔹 Verifica se o usuário já tem assinatura
        const res = await fetch("/stripe/webhook", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        console.log(res)
        const data = await res.json();
        console.log(data)
        if (data.hasActiveSubscription) {
          // Já tem assinatura → vai pro app
          navigate("/dashboard");
        } else {
          // Não tem assinatura → manda direto pro Payment Link do Stripe
          console.log('aqui');
          window.location.href =
            "https://buy.stripe.com/test_4gM8wI2l7gpZ8cs7vP9IQ00";
        }
      } catch (err) {
        // fallback → também manda pro Payment Link
        console.log('aqui2')
        window.location.href =
          "https://buy.stripe.com/test_4gM8wI2l7gpZ8cs7vP9IQ00";
      }
    };

    checkSubscription();
  }, [auth, navigate]);

  if (auth.isLoading) {
    return <div>Processando login...</div>;
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

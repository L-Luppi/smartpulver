import { useAuth } from "react-oidc-context";
import { ReactNode, useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();
  const [checkingSub, setCheckingSub] = useState(true);

  useEffect(() => {
    const verifyAuthAndSubscription = async () => {
      if (!auth.isLoading && !auth.isAuthenticated) {
        // 🔹 não logado → manda pro Cognito
        auth.signinRedirect();
        return;
      }

      if (auth.isAuthenticated) {
        try {
          const idToken = auth.user?.id_token;

          const res = await fetch("/me/subscription", {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          const data = await res.json();

          if (!data.hasActiveSubscription) {
            // 🔹 logado mas sem assinatura → manda pro Stripe
            window.location.href =
              "https://buy.stripe.com/test_4gM8wI2l7gpZ8cs7vP9IQ00";
          } else {
            setCheckingSub(false); // tudo ok, libera rota
          }
        } catch (err) {
          console.error("Erro ao verificar assinatura", err);
          // fallback → também manda pro checkout
          window.location.href =
            "https://buy.stripe.com/test_4gM8wI2l7gpZ8cs7vP9IQ00";
        }
      }
    };

    verifyAuthAndSubscription();
  }, [auth]);

  // carregando login ou checando assinatura
  if (auth.isLoading || checkingSub) {
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

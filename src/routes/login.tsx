import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import droneImg from "../assets/drone.png";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      if (!auth.isAuthenticated) return;

      const planId = (auth.user?.state as { planId?: string })?.planId;
      const idToken = auth.user?.id_token;

      try {
        // 🔹 Verifica se o usuário já tem assinatura
        const res = await fetch("/me/subscription", {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const data = await res.json();

        if (data.hasActiveSubscription) {
          // Já tem assinatura → vai pro app
          navigate("/dashboard");
        } else {
          // Não tem assinatura → cria checkout no Stripe
          const checkoutRes = await fetch("/create-checkout-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ priceId: planId }),
          });

          const checkoutData = await checkoutRes.json();
          if (checkoutData.url) {
            window.location.href = checkoutData.url;
          }
        }
       } catch (err) {
        console.error("Erro ao verificar assinatura:", err);
        // fallback: mesmo com erro → manda pro checkout com plano padrão
        const checkoutRes = await fetch("/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ priceId: "price_1MENSALxxxx" }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        }
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
    <div className="flex items-center justify-center h-screen">
      <img
        src={droneImg}
        alt="Redirecionando..."
        className="w-20 h-20 animate-bounce"
      />
    </div>
  );
}

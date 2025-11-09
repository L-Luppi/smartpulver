import { useEffect } from "react";

export default function LoggedOut() {
  useEffect(() => {
    // Limpa tokens locais
    localStorage.clear();
    sessionStorage.clear();

    // Monta URL do Hosted UI de login
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN; // ex: sa-east-1me5e1v85a.auth.sa-east-1.amazoncognito.com
    const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI; // ex: https://smartpulver.com.br/callback

    // Redireciona para a tela de login do Cognito
    window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

  }, []);

  return <div>Redirecionando para o login...</div>;
}

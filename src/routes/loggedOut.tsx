import { useEffect } from "react";

export default function LoggedOut() {
  useEffect(() => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const cognitoDomain = `https://${import.meta.env.VITE_COGNITO_DOMAIN}`;
    const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI; // https://smartpulver.com.br/callback

    // 👇 Redireciona para o Hosted UI de login
    window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  }, []);

  return <div>Redirecionando para o login...</div>;
}

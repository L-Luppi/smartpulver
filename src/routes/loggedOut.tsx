import { useEffect } from "react";

export default function LoggedOut() {
  useEffect(() => {
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
  const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

  window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+phone&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
}, []);

  return <div>Redirecionando para o login...</div>;
}

import { useEffect } from "react";

export default function LoggedOut() {
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();

    const domain = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

    window.location.href = `${domain}/login?client_id=${clientId}&response_type=code&scope=openid+email+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  }, []);

  return <div>Redirecionando para o login...</div>;
}

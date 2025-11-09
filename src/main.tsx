import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "react-oidc-context";

const domain = import.meta.env.VITE_COGNITO_DOMAIN;

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY, // 🔹 corrigido
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI,
  response_type: "code",
  scope: import.meta.env.VITE_COGNITO_SCOPE,
  metadata: {
    issuer: `${domain}/oauth2`,
    authorization_endpoint: `${domain}/oauth2/authorize`,
    token_endpoint: `${domain}/oauth2/token`,
    userinfo_endpoint: `${domain}/oauth2/userInfo`,
    end_session_endpoint: `${domain}/logout`,
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);

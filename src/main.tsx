import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Amplify } from "aws-amplify";
import { Provider } from "react-redux";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { store } from "./store/index.ts";
import { AuthProvider } from "react-oidc-context";

Amplify.configure(outputs);

const cognitoAuthConfig = {
  authority: "https://smartpulver.sa-east-1.amazonaws.com/sa-east-1_nR3NqOHGF",
  client_id: "487fp732b2melvfqr454o1bq97",
  redirect_uri: "https://smartpulver.com.br/",
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
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

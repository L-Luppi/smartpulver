export const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      region: import.meta.env.VITE_COGNITO_REGION,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN.replace("https://", ""),
          scopes: import.meta.env.VITE_COGNITO_SCOPES.split(" "),
          redirectSignIn: [import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN],
          redirectSignOut: [import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT],
          responseType: import.meta.env.VITE_COGNITO_RESPONSE_TYPE as "code",
        },
      },
    },
  },
};

export const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: "sa-east-1_Me5E1v85a",
      userPoolClientId: "515546nobqhqjoe80q743ob55j",
      region: "sa-east-1",
      loginWith: {
        oauth: {
          domain: "sa-east-1me5e1v85a.auth.sa-east-1.amazoncognito.com",
          scopes: ["email", "openid", "profile"],
          redirectSignIn: ["https://smartpulver.com.br/app/callback"],
          redirectSignOut: ["https://smartpulver.com.br/logged-out"],
          responseType: "code" as const,
        },
      },
    },
  },
};

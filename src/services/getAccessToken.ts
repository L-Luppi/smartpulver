import { fetchAuthSession } from "aws-amplify/auth";

async function getAccessToken() {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString(); // ou accessToken, dependendo do backend
}

export default getAccessToken;
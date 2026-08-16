import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

const domain = process.env.EXPO_PUBLIC_COGNITO_DOMAIN;
const clientId = process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID;

const discovery = {
  authorizationEndpoint: `https://${domain}/oauth2/authorize`,
  tokenEndpoint: `https://${domain}/oauth2/token`,
};

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await SecureStore.getItemAsync("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const tokenResponse = await AuthSession.refreshAsync(
    {
      clientId: clientId!,
      refreshToken,
    },
    discovery,
  );

  if (!tokenResponse.accessToken) {
    throw new Error("Cognito did not return a new access token.");
  }

  await SecureStore.setItemAsync("access_token", tokenResponse.accessToken);

  if (tokenResponse.idToken) {
    await SecureStore.setItemAsync("id_token", tokenResponse.idToken);
  }

  return tokenResponse.accessToken;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let accessToken = await SecureStore.getItemAsync("access_token");

  if (!accessToken) {
    throw new Error("No access token found.");
  }

  const createHeaders = (token: string) => ({
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  let response = await fetch(url, {
    ...options,
    headers: createHeaders(accessToken),
  });

  if (response.status !== 401) {
    return response;
  }

  accessToken = await refreshAccessToken();

  response = await fetch(url, {
    ...options,
    headers: createHeaders(accessToken),
  });

  return response;
}

import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../src/auth/AuthContext";

const domain = process.env.EXPO_PUBLIC_COGNITO_DOMAIN;
const clientId = process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID;

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "engineeringdeliveryhub",
  path: "auth/callback",
});

const discovery = {
  authorizationEndpoint: `https://${domain}/oauth2/authorize`,
  tokenEndpoint: `https://${domain}/oauth2/token`,
};

export default function SignInScreen() {
  const { markSignedIn } = useAuth();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId!,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: ["openid", "email"],
      usePKCE: true,
      extraParams: {
        prompt: "login",
      },
    },
    discovery,
  );

  const hasExchangedCode = useRef(false);

  useEffect(() => {
    async function exchangeCodeForTokens() {
      if (
        response?.type !== "success" ||
        !response.params.code ||
        !request?.codeVerifier ||
        hasExchangedCode.current
      ) {
        return;
      }

      hasExchangedCode.current = true;

      try {
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: clientId!,
            code: response.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discovery,
        );

        if (tokenResponse.accessToken) {
          await SecureStore.setItemAsync(
            "access_token",
            tokenResponse.accessToken,
          );
        }

        if (tokenResponse.idToken) {
          await SecureStore.setItemAsync("id_token", tokenResponse.idToken);
        }

        if (tokenResponse.refreshToken) {
          await SecureStore.setItemAsync(
            "refresh_token",
            tokenResponse.refreshToken,
          );
        }

        console.log("TOKEN EXCHANGE SUCCESS");
        console.log("ACCESS TOKEN STORED:", Boolean(tokenResponse.accessToken));
        console.log("ID TOKEN STORED:", Boolean(tokenResponse.idToken));
        console.log(
          "REFRESH TOKEN STORED:",
          Boolean(tokenResponse.refreshToken),
        );

        // Tell the app-wide auth state that the user is authenticated.
        markSignedIn();

        // Move to the protected home/projects screen.
        router.replace("/");
      } catch (error) {
        hasExchangedCode.current = false;
        console.error("TOKEN EXCHANGE FAILED:", error);
      }
    }

    exchangeCodeForTokens();
  }, [response, request, markSignedIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Text style={styles.subtitle}>
        Sign in with Amazon Cognito to access Engineering Delivery Hub.
      </Text>

      <Pressable
        style={styles.button}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>Sign In with Cognito</Text>
      </Pressable>

      <Text style={styles.small}>Redirect URI: {redirectUri}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#111827",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  small: {
    marginTop: 24,
    fontSize: 12,
  },
});

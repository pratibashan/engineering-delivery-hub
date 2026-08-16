import { Redirect, Stack, useSegments } from "expo-router";

import { AuthProvider, useAuth } from "../src/auth/AuthContext";

function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();

  if (isLoading) {
    return null;
  }

  const isOnSignInScreen = segments[0] === "sign-in";

  if (!isAuthenticated && !isOnSignInScreen) {
    return <Redirect href="/sign-in" />;
  }

  if (isAuthenticated && isOnSignInScreen) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          title: "Projects",
        }}
      />

      <Stack.Screen
        name="projects/[id]"
        options={{
          title: "Project Details",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

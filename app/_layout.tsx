import "react-native-url-polyfill/auto";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { tokenCache } from "../lib/clerk";

export const unstable_settings = {
  initialRouteName: "index",
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0F0F0F",
    card: "#0F0F0F",
    text: "#F0F0F0",
  },
};

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={DarkNavTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(main)" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </ClerkProvider>
  );
}

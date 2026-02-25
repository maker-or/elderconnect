import { Stack, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Colors } from "@/constants/theme";

export default function MainLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.dark.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="events" />
      <Stack.Screen name="caretakers" />
      <Stack.Screen name="card3" />
      <Stack.Screen name="reminders" />
      <Stack.Screen name="lighting" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="event/[id]" />
    </Stack>
  );
}

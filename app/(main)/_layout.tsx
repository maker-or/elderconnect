import { Stack, Redirect, useRouter } from "expo-router";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Colors } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function MainLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

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

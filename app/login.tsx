import { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Colors, Spacing, FontSize } from "@/constants/theme";
import { useLocalization } from "@/localization";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { t } = useLocalization();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("alerts.error"), t("alerts.pleaseEnterEmailPassword"));
      return;
    }
    if (!isLoaded) {
      Alert.alert(t("alerts.pleaseWait"), t("alerts.authLoading"));
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status !== "complete") {
        Alert.alert(
          t("alerts.moreStepsRequired"),
          t("alerts.completeSignInSteps"),
        );
        return;
      }

      await setActive({ session: result.createdSessionId });
      router.replace("/(main)");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("alerts.pleaseTryAgain");
      Alert.alert(t("alerts.loginFailed"), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>{t("auth.welcomeBack")}</Text>
      <Text style={styles.subtitle}>{t("auth.signInContinue")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("auth.email")}
        placeholderTextColor={Colors.dark.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder={t("auth.password")}
        placeholderTextColor={Colors.dark.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? t("auth.signingIn") : t("auth.signIn")}
        </Text>
      </TouchableOpacity>

      <Link href="/signup" asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>{t("auth.noAccountSignUp")}</Text>
        </TouchableOpacity>
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Spacing.xl,
    justifyContent: "center",
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.dark.textMuted,
    marginBottom: Spacing.xxl,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: Colors.dark.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: FontSize.base,
    fontWeight: "600",
    color: Colors.dark.background,
  },
  link: {
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  linkText: {
    fontSize: FontSize.base,
    color: Colors.dark.textMuted,
  },
});

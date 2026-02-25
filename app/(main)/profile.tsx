import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from '@expo/vector-icons';
import { SUPPORTED_LANGUAGES, useLocalization } from "@/localization";

export default function ProfileScreen() {
  const { user } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const { locale, setLocale, t } = useLocalization();

  const handleSignOut = async () => {
    await clerk.signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Feather name="chevron-left" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("common.profile")}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
        <Text style={styles.title}>{user?.fullName ?? user?.firstName ?? t("common.user")}</Text>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress ?? ""}</Text>

        <View style={styles.languageSection}>
          <Text style={styles.languageTitle}>{t("common.language")}</Text>
          <View style={styles.languageGrid}>
            {SUPPORTED_LANGUAGES.map((language) => {
              const isActive = locale === language.code;
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageButton,
                    isActive ? styles.languageButtonActive : null,
                  ]}
                  onPress={() => void setLocale(language.code)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.languageText,
                      isActive ? styles.languageTextActive : null,
                    ]}
                  >
                    {language.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>{t("common.signOut")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090909',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 32,
    fontWeight: "300",
    color: 'white',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 30,
  },
  languageSection: {
    width: "100%",
    marginBottom: 28,
  },
  languageTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageButton: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  languageButtonActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.35)",
  },
  languageText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
  },
  languageTextActive: {
    color: "white",
  },
  signOutButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: "center",
  },
  signOutText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FF453A',
  },
});

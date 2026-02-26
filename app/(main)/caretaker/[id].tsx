import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { CARETAKERS } from "@/data/caretakers";
import { useLocalization } from "@/localization";

export default function CaretakerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();

  const caretaker = CARETAKERS.find((item) => item.id === id);

  if (!caretaker) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Caretaker not found</Text>
        <TouchableOpacity style={styles.backFallbackButton} onPress={() => router.back()}>
          <Text style={styles.backFallbackButtonText}>{t("common.goBack")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backIcon}
          activeOpacity={0.8}
        >
          <Feather name="chevron-left" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleCard}>
          <Text style={styles.name}>{caretaker.name}</Text>
          <Text style={styles.role}>{caretaker.role}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{caretaker.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Specialties</Text>
            <Text style={styles.value}>{caretaker.specialties}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Experience</Text>
            <Text style={styles.value}>{caretaker.experience}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Languages</Text>
            <Text style={styles.value}>{caretaker.languages}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Availability</Text>
            <Text style={styles.value}>{caretaker.availability}</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About</Text>
          <Text style={styles.aboutText}>{caretaker.about}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
          <Text style={styles.ctaText}>Book Caretaker</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F5485",
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backIcon: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  titleCard: {
    backgroundColor: "#3183F6",
    borderRadius: 16,
    padding: 24,
    minHeight: 170,
    justifyContent: "center",
  },
  name: {
    fontSize: 40,
    fontWeight: "700",
    color: "#E5F0FE",
    letterSpacing: -1.4,
    lineHeight: 42,
    marginBottom: 10,
  },
  role: {
    fontSize: 18,
    color: "#E5F0FE",
    opacity: 0.9,
  },
  infoCard: {
    backgroundColor: "#3183F6",
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  infoRow: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: "#D2E5FF",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 18,
    color: "#E5F0FE",
    lineHeight: 24,
  },
  aboutCard: {
    backgroundColor: "#3183F6",
    borderRadius: 16,
    padding: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E5F0FE",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 17,
    color: "#E5F0FE",
    lineHeight: 26,
    opacity: 0.95,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  ctaButton: {
    backgroundColor: "#3183F6",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#E5F0FE",
  },
  errorText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
  },
  backFallbackButton: {
    marginTop: 20,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#3183F6",
    marginHorizontal: 40,
    borderRadius: 8,
  },
  backFallbackButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

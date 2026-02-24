import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EVENTS } from "@/data/events";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const event = EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const openGoogleMaps = () => {
    // If we have a dummy mapUrl we can use it, or search for the location
    const url = event.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open Google Maps", err)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
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
        {/* Top Title Card */}
        <View style={styles.titleCard}>
          <Text style={styles.cardTitle}>{event.title}</Text>
        </View>

        {/* Location & Time Card */}
        <TouchableOpacity style={styles.locationCard} onPress={openGoogleMaps} activeOpacity={0.9}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>{event.location}</Text>
            <Text style={styles.locationTime}>{event.time}</Text>
          </View>
          <Feather name="arrow-up-right" size={36} color="#FDEAE5" style={styles.iconOpacity} />
        </TouchableOpacity>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Enquiry Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.enquiryButton} activeOpacity={0.9}>
          <Text style={styles.enquiryButtonText}>enquiry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#852D1F",
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
  },
  titleCard: {
    backgroundColor: "#F65131",
    borderRadius: 16,
    padding: 24,
    paddingTop: 32,
    minHeight: 180,
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FDEAE5",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  locationCard: {
    backgroundColor: "#F65131",
    borderRadius: 16,
    padding: 20,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: "#FDEAE5",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  locationTime: {
    fontSize: 18,
    color: "#FDEAE5",
    opacity: 0.8,
  },
  iconOpacity: {
    opacity: 0.9,
  },
  descriptionContainer: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  descriptionText: {
    fontSize: 18,
    color: "#FDEAE5",
    lineHeight: 28,
    opacity: 0.9,
    fontWeight: "400",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  enquiryButton: {
    backgroundColor: "#F65131",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  enquiryButtonText: {
    fontSize: 24,
    fontWeight: "400",
    color: "#000000",
  },
  errorText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#F65131",
    marginHorizontal: 40,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

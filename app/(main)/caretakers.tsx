import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { CARETAKERS, DURATIONS } from "@/data/caretakers";
import { Colors, Spacing, FontSize } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';

export default function CaretakersScreen() {
  const router = useRouter();
  const [bookingFor, setBookingFor] = useState<(typeof CARETAKERS)[0] | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const handleBookNow = (caretaker: (typeof CARETAKERS)[0]) => {
    setBookingFor(caretaker);
    setDuration(null);
  };

  const handleConfirm = () => {
    if (!bookingFor || !duration) return;
    const label = DURATIONS.find((d) => d.id === duration)?.label ?? duration;
    Alert.alert(
      "Booked",
      `${bookingFor.name} has been booked for ${label}.`,
      [{ text: "OK", onPress: () => { setBookingFor(null); setDuration(null); } }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Feather name="chevron-left" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nurse</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={CARETAKERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleBookNow(item)}
            activeOpacity={0.9}
          >
            <Text style={styles.cardName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!bookingFor}
        transparent
        animationType="fade"
        onRequestClose={() => setBookingFor(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setBookingFor(null)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {bookingFor && (
              <>
                <Text style={styles.modalTitle}>Select duration</Text>
                <Text style={styles.modalSubtitle}>{bookingFor.name}</Text>
                {DURATIONS.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={[
                      styles.durationOption,
                      duration === d.id && styles.durationSelected,
                    ]}
                    onPress={() => setDuration(d.id)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        duration === d.id && styles.durationTextSelected,
                      ]}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.confirmButton, !duration && styles.confirmDisabled]}
                  onPress={handleConfirm}
                  disabled={!duration}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setBookingFor(null)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F5485",
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
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: "#3183F6",
    height: 300,
    borderRadius: 16,
    padding: 24,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  cardName: {
    fontSize: 42,
    fontWeight: "700",
    color: "#E5F0FE",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: "#1F5485",
    borderRadius: 12,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: "600",
    color: "white",
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: FontSize.base,
    color: "rgba(255,255,255,0.8)",
    marginBottom: Spacing.lg,
  },
  durationOption: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  durationSelected: {
    borderColor: "white",
    backgroundColor: "#3183F6",
  },
  durationText: {
    fontSize: FontSize.base,
    color: "white",
  },
  durationTextSelected: {
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#3183F6",
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  confirmDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    fontSize: FontSize.base,
    fontWeight: "600",
    color: "white",
  },
  cancelButton: {
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: FontSize.base,
    color: "rgba(255,255,255,0.8)",
  },
});

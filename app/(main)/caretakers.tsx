import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { CARETAKERS } from "@/data/caretakers";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { useLocalization } from "@/localization";

export default function CaretakersScreen() {
  const router = useRouter();
  const { t } = useLocalization();

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
        <Text style={styles.headerTitle}>{t("caretakers.title")}</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={CARETAKERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/caretaker/${item.id}`)}
            activeOpacity={0.9}
          >
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardMeta}>Age: {item.age}</Text>
            <Text style={styles.cardMeta} numberOfLines={2}>
              {item.specialties}
            </Text>
          </TouchableOpacity>
        )}
      />
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
    marginBottom: 14,
  },
  cardMeta: {
    fontSize: 18,
    color: "#E5F0FE",
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 4,
  },
});

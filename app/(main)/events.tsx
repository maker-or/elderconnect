import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { EVENTS } from "@/data/events";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { useLocalization } from "@/localization";

export default function EventsScreen() {
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
        <Text style={styles.headerTitle}>{t("events.title")}</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={EVENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/event/${item.id}`)}
            activeOpacity={0.9}
          >
            <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
            <View style={styles.cardLocationContainer}>
              <Feather name="map" size={24} color="#FDEAE5" style={styles.iconOpacity} />
              <Text style={styles.cardLocationText}>{t(item.locationKey)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#852D1F",
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
    backgroundColor: "#F65131",
    height: 300,
    borderRadius: 16,
    padding: 24,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FDEAE5",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  cardLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconOpacity: {
    opacity: 0.8,
  },
  cardLocationText: {
    fontSize: 20,
    color: "#FDEAE5",
    fontWeight: '400',
    opacity: 0.8,
  },
});

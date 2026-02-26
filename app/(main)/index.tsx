import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalization } from "@/localization";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLocalization();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("home.services")}</Text>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
        >
          <View style={styles.profilePic} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Event */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#F65131" }]}
          onPress={() => router.push("/events")}
          activeOpacity={0.9}
        >
          <View style={[styles.innerBox, { backgroundColor: "#852D1F" }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#FCDAD5" }]}>
              <Feather name="map" size={32} color="#F65131" />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardTitle}>{t("home.event")}</Text>
          </View>
        </TouchableOpacity>

        {/* Card 2: Nurse */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#3183F6" }]}
          onPress={() => router.push("/caretakers")}
          activeOpacity={0.9}
        >
          <View style={[styles.innerBox, { backgroundColor: "#1F5485" }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#BBD9FC" }]}>
              <MaterialCommunityIcons
                name="hand-heart-outline"
                size={36}
                color="#3183F6"
              />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardTitle}>{t("home.nurse")}</Text>
          </View>
        </TouchableOpacity>

        {/* Card 3: Activate */}
        {/*<TouchableOpacity
          style={[styles.card, { backgroundColor: "#1F852B" }]}
          onPress={() => router.push("/card3")}
          activeOpacity={0.9}
        >
          <View style={[styles.innerBox, { backgroundColor: "#B4F631" }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#E6FBBF" }]} />
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardTitle}>{t("home.activate")}</Text>
          </View>
        </TouchableOpacity>*/}

        {/* Card 4: Reminder */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#9331F6" }]}
          onPress={() => router.push("/reminders")}
          activeOpacity={0.9}
        >
          <View style={[styles.innerBox, { backgroundColor: "#661F85" }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#E6CCFF" }]}>
              <Feather name="bell" size={32} color="#9331F6" />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardTitle}>{t("home.reminder")}</Text>
          </View>
        </TouchableOpacity>

        {/* Card 5: Lighting */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#F6B831" }]}
          onPress={() => router.push({ pathname: "/lighting" as never })}
          activeOpacity={0.9}
        >
          <View style={[styles.innerBox, { backgroundColor: "#BA841F" }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#F8E2B1" }]}>
              <Feather name="zap" size={32} color="#BA841F" />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={[styles.cardTitle, { color: "#5B3C09" }]}>
              {t("home.lighting")}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090909",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: -0.5,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#d1d1d6",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    height: 380,
    borderRadius: 14,
    padding: 3,
    paddingBottom: 0,
  },
  innerBox: {
    flex: 1,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cardFooter: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  cardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: -0.3,
  },
});

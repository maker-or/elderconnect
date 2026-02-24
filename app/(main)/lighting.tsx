import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Gyroscope } from "expo-sensors";
import { CameraView, useCameraPermissions } from "expo-camera";

const SHAKE_THRESHOLD = 9.5;
const SHAKE_DEBOUNCE_MS = 1000;
const SHAKE_PEAK_WINDOW_MS = 650;

export default function LightingScreen() {
  const router = useRouter();
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isShakeEnabled, setIsShakeEnabled] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const lastShakeAtRef = useRef(0);
  const peakCountRef = useRef(0);
  const lastPeakAtRef = useRef(0);

  const hasPermission = cameraPermission?.granted ?? false;

  const requestPermissionIfNeeded = useCallback(async () => {
    if (hasPermission) return true;
    const result = await requestCameraPermission();
    return result.granted;
  }, [hasPermission, requestCameraPermission]);

  const toggleTorch = useCallback(async () => {
    const granted = await requestPermissionIfNeeded();
    if (!granted) {
      Alert.alert(
        "Camera permission required",
        "Allow camera access so we can control the flashlight."
      );
      return;
    }
    setIsTorchOn((prev) => !prev);
  }, [requestPermissionIfNeeded]);

  useEffect(() => {
    Gyroscope.setUpdateInterval(160);
    const subscription = Gyroscope.addListener(async ({ x, y, z }) => {
      if (!isShakeEnabled) return;

      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (magnitude < SHAKE_THRESHOLD || now - lastShakeAtRef.current < SHAKE_DEBOUNCE_MS) {
        return;
      }

      if (now - lastPeakAtRef.current > SHAKE_PEAK_WINDOW_MS) {
        peakCountRef.current = 0;
      }
      peakCountRef.current += 1;
      lastPeakAtRef.current = now;

      // Require multiple hard peaks so tiny movement doesn't trigger it.
      if (peakCountRef.current < 2) {
        return;
      }

      lastShakeAtRef.current = now;
      peakCountRef.current = 0;
      await toggleTorch();
    });

    return () => {
      subscription.remove();
    };
  }, [isShakeEnabled, toggleTorch]);

  const toggleLabel = useMemo(
    () => (isShakeEnabled ? "Toggle to turn OFF" : "Toggle to turn ON"),
    [isShakeEnabled]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={32} color="#F8E4B9" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Feather name="zap" size={44} color="#BA841F" />
          </View>
        </View>

        <Text style={styles.instructions}>
          Shake the mobile to turn off and on the flashlight
        </Text>

        <Pressable
          onPress={() => setIsShakeEnabled((prev) => !prev)}
          style={styles.toggleTrack}
        >
          <View style={[styles.toggleThumb, isShakeEnabled ? styles.toggleThumbOn : null]} />
        </Pressable>

        <Text style={styles.toggleText}>{toggleLabel}</Text>
      </ScrollView>

      {/* Keep a tiny mounted CameraView so torch can be controlled natively. */}
      <View style={styles.hiddenCamera}>
        <CameraView enableTorch={isTorchOn} style={StyleSheet.absoluteFill} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BA841F",
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 20,
  },
  heroCard: {
    height: 300,
    borderRadius: 16,
    backgroundColor: "#F6B831",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F8E4B9",
    justifyContent: "center",
    alignItems: "center",
  },
  instructions: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.5,
    color: "#F8E4B9",
    fontWeight: "500",
    textAlign: "center",
  },
  toggleTrack: {
    width: 120,
    height: 56,
    borderRadius: 30,
    backgroundColor: "#F6B831",
    padding: 6,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  toggleThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#B38428",
  },
  toggleThumbOn: {
    alignSelf: "flex-end",
  },
  toggleText: {
    alignSelf: "center",
    color: "#F8E4B9",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -1.2,
    fontWeight: "500",
    textAlign: "center",
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});

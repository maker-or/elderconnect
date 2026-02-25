import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { useLocalization } from "@/localization";

export default function Card3Screen() {
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
                <Text style={styles.headerTitle}>{t("card3.title")}</Text>
                <View style={{ width: 44 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                    <Text style={styles.cardTitle}>{t("card3.resourceItem1")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                    <Text style={styles.cardTitle}>{t("card3.resourceItem2")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                    <Text style={styles.cardTitle}>{t("card3.resourceItem3")}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1F852B",
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 40,
        gap: 12,
    },
    card: {
        backgroundColor: "#B4F631",
        height: 300,
        borderRadius: 16,
        padding: 24,
        marginBottom: 8,
        justifyContent: 'flex-start',
    },
    cardTitle: {
        fontSize: 42,
        fontWeight: "700",
        color: "#2C3D0C", // dark tint for readable text on bright green
        letterSpacing: -1.5,
        lineHeight: 44,
    },
});

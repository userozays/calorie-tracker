import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, space, type } from "@/theme";

/** Signed-out landing. The sign-in buttons (Apple, Google, e-mail) arrive with US1 (T028). */
export default function Welcome() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brand}>
        <Text style={styles.eyebrow}>KALORİ TAKİP</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Öğününü kaydet, hedefini takip et.
        </Text>
        <Text style={styles.lead}>Fotoğraf, barkod ya da yemeğin adıyla saniyeler içinde.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: space(6), justifyContent: "center" },
  brand: { gap: space(3) },
  eyebrow: { ...type.label, color: colors.cta },
  title: { ...type.displayXl, color: colors.onInk },
  lead: { ...type.body, color: colors.onInkMuted },
});

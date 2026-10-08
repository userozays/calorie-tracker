import { StyleSheet, Text, View } from "react-native";
import { colors, space, type } from "@/theme";

/** Placeholder until the welcome screen (T028) and session routing (T022) exist. */
export default function Index() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Kalori Takip</Text>
      <Text style={styles.lead}>Öğününü kaydet, hedefini takip et.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: space(6), backgroundColor: colors.ink },
  title: { ...type.displayXl, color: colors.onInk },
  lead: { ...type.body, color: colors.onInkMuted, marginTop: space(2) },
});

import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, space, type } from "@/theme";

interface Props {
  /** Heading in the ink band at the top. */
  title: string;
  /** Short line under the heading. */
  lead?: string;
  children: ReactNode;
  /** Pinned to the bottom (e.g. the screen's primary button). */
  footer?: ReactNode;
}

/** The tofuhq page: an ink header band, then a white rounded panel that scrolls. */
export default function Screen({ title, lead, children, footer }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <View style={styles.band}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {lead && <Text style={styles.lead}>{lead}</Text>}
      </View>
      <View style={styles.panel}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer && (
          <SafeAreaView edges={["bottom"]} style={styles.footer}>
            {footer}
          </SafeAreaView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  band: { paddingHorizontal: space(5), paddingTop: space(4), paddingBottom: space(6), gap: space(1) },
  title: { ...type.displayLg, color: colors.onInk },
  lead: { ...type.body, color: colors.onInkMuted },
  panel: { flex: 1, backgroundColor: colors.bg, borderTopLeftRadius: radius.panel, borderTopRightRadius: radius.panel, overflow: "hidden" },
  content: { padding: space(5), gap: space(4) },
  footer: { paddingHorizontal: space(5), paddingTop: space(3), paddingBottom: space(3), borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
});

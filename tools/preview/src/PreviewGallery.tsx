import { useFonts } from "expo-font";
import type { ComponentType } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import IndexScreen from "@/app/index";
import { colors, fonts, radius, space, type } from "@/theme";

/*
 * Screen review gallery: every screen of the app in a 390×844 phone frame, rendered from the app's
 * own components (react-native-web), plus the design tokens they are built from. Add a screen by
 * adding an entry to SCREENS; its services come from src/fakes (see metro.config.js).
 */

interface ScreenEntry {
  id: string;
  title: string;
  note: string;
  Component: ComponentType;
}

const SCREENS: ScreenEntry[] = [
  { id: "placeholder", title: "Açılış (yer tutucu)", note: "Faz 1: tema ve yazı tipi. Karşılama ekranı US1'de (T028) gelecek.", Component: IndexScreen },
];

const PHONE = { width: 390, height: 844 };

export default function PreviewGallery() {
  const [loaded] = useFonts({ [fonts.display]: require("../../../apps/mobile/assets/fonts/SpaceGroteskBold-700.ttf") });
  if (!loaded) return null;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.band}>
        <Text style={styles.eyebrow}>KALORİ TAKİP · 001 MOBİL TEMEL</Text>
        <Text style={styles.bandTitle}>Ekran önizlemesi</Text>
        <Text style={styles.bandLead}>
          Uygulamanın gerçek React Native kodu, örnek veriyle web'de çizildi. Telefonda görünüm aynı bileşenlerden gelir; yazı tipleri ve
          sistem kontrolleri platforma göre küçük farklar gösterebilir.
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Ekranlar</Text>
        <ScrollView horizontal contentContainerStyle={styles.phones}>
          {SCREENS.map(({ id, title, note, Component }) => (
            <View key={id} style={styles.phoneColumn}>
              <View style={styles.phone}>
                <Component />
              </View>
              <Text style={styles.phoneTitle}>{title}</Text>
              <Text style={styles.phoneNote}>{note}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Renkler</Text>
        <View style={styles.swatches}>
          {Object.entries(colors).map(([name, value]) => (
            <View key={name} style={styles.swatch}>
              <View style={[styles.swatchChip, { backgroundColor: value }]} />
              <Text style={styles.swatchName}>{name}</Text>
              <Text style={styles.swatchValue}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Yazı ölçeği</Text>
        <View style={styles.stack}>
          {Object.entries(type).map(([name, style]) => (
            <View key={name} style={styles.typeRow}>
              <Text style={styles.tokenName}>
                {name} · {style.fontSize}/{style.lineHeight}
              </Text>
              <Text style={[style, { color: colors.fg }]}>Bugün 1.840 kcal, hedefin 2.150</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Boşluk (4 px ızgara) ve köşeler</Text>
        <View style={styles.stack}>
          {[1, 2, 3, 4, 6, 8].map((steps) => (
            <View key={steps} style={styles.spaceRow}>
              <Text style={styles.tokenName}>space({steps}) = {space(steps)}</Text>
              <View style={[styles.spaceBar, { width: space(steps) * 4 }]} />
            </View>
          ))}
          <View style={styles.radii}>
            {Object.entries(radius).map(([name, value]) => (
              <View key={name} style={styles.radiusItem}>
                <View style={[styles.radiusBox, { borderRadius: Math.min(value, 32) }]} />
                <Text style={styles.tokenName}>
                  {name} · {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ink },
  pageContent: { paddingBottom: space(10) },
  band: { paddingHorizontal: space(4), paddingTop: space(8), paddingBottom: space(14), maxWidth: 1100, width: "100%", alignSelf: "center" },
  eyebrow: { ...type.label, color: colors.cta },
  bandTitle: { ...type.displayXl, color: colors.onInk, marginTop: space(3) },
  bandLead: { ...type.body, color: colors.onInkMuted, marginTop: space(3), maxWidth: 640 },
  panel: {
    backgroundColor: colors.bg,
    borderRadius: radius.panel,
    marginTop: -space(8),
    marginHorizontal: space(4),
    padding: space(6),
    gap: space(4),
    maxWidth: 1100,
    alignSelf: "center",
    width: "100%",
  },
  sectionTitle: { ...type.displayMd, color: colors.fg, marginTop: space(4) },
  phones: { gap: space(8), paddingVertical: space(2) },
  phoneColumn: { width: PHONE.width, gap: space(2) },
  phone: {
    width: PHONE.width,
    height: PHONE.height,
    borderRadius: 44,
    borderWidth: 10,
    borderColor: colors.borderStrong,
    overflow: "hidden",
    backgroundColor: colors.ink,
  },
  phoneTitle: { ...type.bodyStrong, color: colors.fg },
  phoneNote: { ...type.small, color: colors.fgMuted },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: space(3) },
  swatch: { width: 132, gap: space(1) },
  swatchChip: { height: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  swatchName: { ...type.small, color: colors.fg, fontWeight: "600" },
  swatchValue: { ...type.small, color: colors.fgMuted },
  stack: { gap: space(3) },
  typeRow: { gap: space(1), borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: space(3) },
  tokenName: { ...type.small, color: colors.fgMuted },
  spaceRow: { flexDirection: "row", alignItems: "center", gap: space(3) },
  spaceBar: { height: space(3), backgroundColor: colors.cta, borderRadius: radius.sm },
  radii: { flexDirection: "row", flexWrap: "wrap", gap: space(6), marginTop: space(2) },
  radiusItem: { alignItems: "center", gap: space(2) },
  radiusBox: { width: 64, height: 64, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.borderStrong },
});

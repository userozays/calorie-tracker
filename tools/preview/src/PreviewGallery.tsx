import { Fraunces_700Bold } from "@expo-google-fonts/fraunces/700Bold";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito/800ExtraBold";
import { useFonts } from "expo-font";
import type { ComponentType } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import IndexScreen from "@/app/index";
import { colors, fontAssets, fonts, radius, space, type } from "@/theme";

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

/** The chosen display face and two alternatives the owner can compare (preview only). */
const FACES = [
  { family: fonts.display, name: "Bricolage Grotesque", note: "Seçilen. Sıcak, iştah açan, modern; rakamları güçlü, kalori halkasındaki büyük sayılar için.", chosen: true },
  { family: "Fraunces_700Bold", name: "Fraunces", note: "Alternatif: yumuşak serif, tarif kitabı ve mutfak havası.", chosen: false },
  { family: "Nunito_800ExtraBold", name: "Nunito", note: "Alternatif: yuvarlak hatlı, sağlık uygulamalarına yakın, çok samimi.", chosen: false },
];

export default function PreviewGallery() {
  const [loaded, fontError] = useFonts({ ...fontAssets, Fraunces_700Bold, Nunito_800ExtraBold });
  if (!loaded && !fontError) return null;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.band}>
        <Text style={styles.eyebrow}>KALORİ TAKİP · 001 MOBİL TEMEL</Text>
        <Text style={styles.bandTitle}>Ekran önizlemesi</Text>
        {fontError && <Text style={[styles.bandLead, { color: colors.dangerSoft }]}>Yazı tipi yüklenemedi: {fontError.message}</Text>}
        <Text style={styles.bandLead}>
          Uygulamanın gerçek React Native kodu, örnek veriyle web'de çizildi. Telefonda görünüm aynı bileşenlerden gelir; yazı tipleri ve
          sistem kontrolleri platforma göre küçük farklar gösterebilir.
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Yazı tipi</Text>
        <View style={styles.faces}>
          {FACES.map(({ family, name, note, chosen }) => (
            <View key={name} style={[styles.face, chosen && styles.faceChosen]}>
              <Text style={[styles.faceLabel, chosen && styles.faceLabelChosen]}>{chosen ? "SEÇİLEN" : "ALTERNATİF"} · {name}</Text>
              <Text style={[styles.faceBig, { fontFamily: family }, chosen && styles.onInk]}>1.840</Text>
              <Text style={[styles.faceUnit, chosen && styles.onInkMuted]}>/ 2.150 kcal</Text>
              <Text style={[styles.faceHeading, { fontFamily: family }, chosen && styles.onInk]}>Öğle yemeği</Text>
              <Text style={[styles.faceSample, { fontFamily: family }, chosen && styles.onInk]}>Mercimek çorbası, ızgara tavuk göğsü</Text>
              <Text style={[styles.faceGlyphs, { fontFamily: family }, chosen && styles.onInkMuted]}>Ğ Ş İ ı ç ö ü · 0123456789</Text>
              <Text style={[styles.faceNote, chosen && styles.onInkMuted]}>{note}</Text>
            </View>
          ))}
        </View>

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
  faces: { flexDirection: "row", flexWrap: "wrap", gap: space(4) },
  face: { flexGrow: 1, flexBasis: 280, gap: space(1), padding: space(5), borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  faceChosen: { backgroundColor: colors.ink, borderColor: colors.ink },
  faceLabel: { ...type.label, color: colors.fgMuted },
  faceLabelChosen: { color: colors.cta },
  faceBig: { fontSize: 64, lineHeight: 70, color: colors.fg, marginTop: space(2) },
  faceUnit: { ...type.body, color: colors.fgMuted },
  faceHeading: { fontSize: 24, lineHeight: 30, color: colors.fg, marginTop: space(3) },
  faceSample: { fontSize: 17, lineHeight: 24, color: colors.fg },
  faceGlyphs: { fontSize: 17, lineHeight: 24, color: colors.fgMuted, marginTop: space(1) },
  faceNote: { ...type.small, color: colors.fgMuted, marginTop: space(3) },
  onInk: { color: colors.onInk },
  onInkMuted: { color: colors.onInkMuted },
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

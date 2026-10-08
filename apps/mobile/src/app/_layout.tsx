import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { colors, fonts } from "@/theme";

void SplashScreen.preventAutoHideAsync();

/** Root layout: loads the display font, then shows the app. Session routing arrives in T022. */
export default function RootLayout() {
  const [loaded] = useFonts({ [fonts.display]: require("../../assets/fonts/SpaceGroteskBold-700.ttf") });

  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink } }} />
    </>
  );
}

import type { ExpoConfig } from "expo/config";

/*
 * Bundle ID / package: placeholder until the owner picks the store identity (feature 005).
 * Google sign-in's config plugin is added with T026, once the OAuth client IDs exist.
 */
const APP_ID = "com.kaloritakip.app";

const config: ExpoConfig = {
  name: "Kalori Takip",
  slug: "kalori-takip",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "kaloritakip",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: APP_ID,
    icon: "./assets/expo.icon",
    usesAppleSignIn: true,
    supportsTablet: false,
  },
  android: {
    package: APP_ID,
    adaptiveIcon: {
      backgroundColor: "#170b21",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-secure-store",
    "expo-apple-authentication",
    "expo-localization",
    ["expo-splash-screen", { backgroundColor: "#170b21", image: "./assets/images/splash-icon.png", imageWidth: 76 }],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;

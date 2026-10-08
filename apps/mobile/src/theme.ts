import { Platform } from "react-native";

/*
 * tofuhq design tokens (tofuhq-design/SKILL.md), carried over from the web app's globals.css.
 * Light theme only: deep ink for the header band and text, white surfaces, lime for the one
 * primary action per screen, blue only for links and focus. Components take every colour, space
 * and radius from here; nothing is hard-coded elsewhere (constitution, Design).
 * Text greys are darker than on the web so small text passes WCAG AA on white and surface2.
 */
export const colors = {
  ink: "#170b21",
  ink2: "#2c203a",
  bg: "#ffffff",
  surface: "#ffffff",
  surface2: "#f5f8f1",
  surface3: "#eeeeee",
  border: "#dddddd",
  borderStrong: "#222222",
  fg: "#170b21",
  fgMuted: "#4b5a69",
  fgSubtle: "#5d6c7b",
  onInk: "#ffffff",
  onInkMuted: "#c8c8c8",
  accent: "#007aff",
  cta: "#a8e40f",
  ctaPressed: "#c5f058",
  ctaFg: "#170b21",
  success: "#84cc16",
  successSoft: "#e5f4c1",
  successText: "#3b5500",
  danger: "#d92d20",
  dangerSoft: "#ffdede",
  dangerText: "#b42318",
  warningSoft: "#e9ddff",
  warningText: "#3e1e7a",
  macroCalories: "#170b21",
  macroProtein: "#bd41f0",
  macroCarbs: "#3898ec",
  macroFat: "#84cc16",
} as const;

/** The 4 px grid: space(4) = 16. */
export const space = (steps: number) => steps * 4;

export const radius = { sm: 6, md: 10, lg: 16, panel: 24, pill: 999 } as const;

export const fonts = {
  /** Space Grotesk Bold, loaded in the root layout; headings and big numbers only. */
  display: "SpaceGroteskBold",
  body: Platform.select({ ios: "System", default: "sans-serif" }),
} as const;

/** Type scale in px with line heights; display sizes use `fonts.display`. */
export const type = {
  displayXl: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44 },
  displayLg: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  displayMd: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, fontWeight: "600" },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, fontWeight: "600", letterSpacing: 0.6 },
} as const;

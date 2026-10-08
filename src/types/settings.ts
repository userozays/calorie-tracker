import { fastingSettingsSchema, type FastingSettings } from "./fasting";
import { normalizePeriods } from "@/lib/nutrition/schedule";
import { MAX_PLAN_PERIODS, nutritionPlanSchema, planPeriodSchema, planTitleSchema, type NutritionPlan, type PlanPeriod } from "./plan";
import { z } from "./zod";

/** A user's saved plans, stored as JSON on their account (`User.settings`). */
export interface UserSettings {
  /** The main plan from the plan wizard: applies on days no period covers. */
  nutritionPlan: NutritionPlan | null;
  /** The main plan's title in "Planlarım"; null = derived from its goal. */
  mainPlanTitle: string | null;
  /** Dated plans (Cut, Bulk…) that replace the main plan between their dates. Sorted, never overlapping. */
  planPeriods: PlanPeriod[];
  /** Daily water goal chosen by the user; null = the default for their sex (lib/nutrition/water.ts). */
  waterGoalMl: number | null;
  /** The user read the content warning shown before fasting / large-deficit plans. */
  sensitiveWarningAck: boolean;
  /** Intermittent-fasting module; null = never set up (off). */
  fasting: FastingSettings | null;
}

export const WATER_GOAL_RANGE = { min: 500, max: 6000, step: 250 } as const;

export const EMPTY_SETTINGS: UserSettings = {
  nutritionPlan: null,
  mainPlanTitle: null,
  planPeriods: [],
  waterGoalMl: null,
  sensitiveWarningAck: false,
  fasting: null,
};

/**
 * Lenient on purpose: settings come from the DB or the client, and one malformed part shouldn't
 * wipe the others. Each part is validated separately and bad parts are dropped.
 */
const looseSettingsSchema = z.object({
  nutritionPlan: z.unknown().optional(),
  mainPlanTitle: z.unknown().optional(),
  planPeriods: z.array(z.unknown()).optional(),
  waterGoalMl: z.unknown().optional(),
  sensitiveWarningAck: z.unknown().optional(),
  fasting: z.unknown().optional(),
});

const waterGoalSchema = z.number().int().min(WATER_GOAL_RANGE.min).max(WATER_GOAL_RANGE.max);

/** API responses carrying settings: an object, checked part by part by `parseSettings`. */
export const settingsResponseSchema = z.record(z.string(), z.unknown());

export function parseSettings(raw: unknown): UserSettings {
  const loose = looseSettingsSchema.safeParse(raw);
  if (!loose.success) return EMPTY_SETTINGS;
  const nutritionPlan = nutritionPlanSchema.safeParse(loose.data.nutritionPlan).data ?? null;
  const mainPlanTitle = planTitleSchema.safeParse(loose.data.mainPlanTitle).data ?? null;
  const planPeriods = normalizePeriods(
    (loose.data.planPeriods ?? []).map((p) => planPeriodSchema.safeParse(p).data).filter((p): p is PlanPeriod => p !== undefined),
    MAX_PLAN_PERIODS,
  );
  const waterGoalMl = waterGoalSchema.safeParse(loose.data.waterGoalMl).data ?? null;
  const sensitiveWarningAck = loose.data.sensitiveWarningAck === true;
  const fasting = fastingSettingsSchema.safeParse(loose.data.fasting).data ?? null;
  return { nutritionPlan, mainPlanTitle, planPeriods, waterGoalMl, sensitiveWarningAck, fasting };
}

export function parseSettingsJSON(json: string | null | undefined): UserSettings {
  if (!json) return EMPTY_SETTINGS;
  try {
    return parseSettings(JSON.parse(json));
  } catch {
    return EMPTY_SETTINGS;
  }
}

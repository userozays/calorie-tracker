import type { Macros } from "@/types/nutrition";
import type { NutritionPlan } from "@/types/plan";
import { DAILY_GOALS } from "./macros";
import { targetsForDate, type DayType } from "./plan";

type TargetSource = "plan" | "default";

export interface ResolvedTargets {
  targets: Macros;
  source: TargetSource;
  /** Training or rest day when the active plan cycles calories; null otherwise. */
  dayType: DayType | null;
}

/** The daily targets in effect on `date`: the plan's (training/rest day when cycling), else the defaults. */
export function resolveTargets(plan: NutritionPlan | null, date: Date = new Date()): ResolvedTargets {
  if (!plan) return { targets: DAILY_GOALS, source: "default", dayType: null };
  const { targets, dayType } = targetsForDate(plan, date);
  return { targets, source: "plan", dayType };
}

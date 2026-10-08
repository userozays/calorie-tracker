"use client";

import { useMemo } from "react";
import { resolveTargets } from "@/lib/nutrition/targets";
import { useNutritionPlan } from "./useNutritionPlan";

/** Today's targets and where they come from: the plan in effect (training/rest day when cycling), else defaults. */
export function useCalorieGoal() {
  const { plan } = useNutritionPlan();
  return useMemo(() => ({ ...resolveTargets(plan, new Date()), plan }), [plan]);
}

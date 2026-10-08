"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { buildPlan } from "@/lib/nutrition/plan";
import { ROUTES } from "@/lib/routes";
import { defaultPlanTitle } from "@/lib/nutrition/schedule";
import type { NutritionPlan, PlanInputs } from "@/types/plan";
import { useAuth } from "./useAuth";
import { useNutritionPlan } from "./useNutritionPlan";
import { useToast } from "./useToast";

/** Which plan the flow edits: the main plan, a saved period's plan, or one for a new period. */
export type BuilderTarget = { kind: "main" } | { kind: "period"; id: string } | { kind: "newPeriod" };

/** A new period's plan, waiting for its title and dates. */
export interface PendingPeriod {
  plan: NutritionPlan;
  title: string;
}

export type BuilderPhase = { kind: "wizard" } | { kind: "review"; plan: NutritionPlan; isNew: boolean };

/** `crypto.randomUUID` needs a secure context; plain-http LAN testing falls back to a timestamp id. */
const newPlanId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `plan_${Date.now()}`);

/** The /plan flow: wizard -> fine-tuning -> save. The plan is computed in the browser, instantly. */
export function usePlanBuilder(startInReview: boolean, target: BuilderTarget = { kind: "main" }) {
  const router = useRouter();
  const toast = useToast();
  const { requireAuth } = useAuth();
  const { plan: todaysPlan, mainPlan, periods, savePlan, savePeriod } = useNutritionPlan();
  const period = target.kind === "period" ? (periods.find((p) => p.id === target.id) ?? null) : null;
  const activePlan = target.kind === "period" ? (period?.plan ?? null) : target.kind === "newPeriod" ? todaysPlan : mainPlan;
  const [pending, setPending] = useState<PendingPeriod | null>(null);
  // null until the user does something: then "Planı düzenle" (startInReview) shows the saved plan
  // in the tuning desk once the account has loaded, otherwise the wizard.
  const [phase, setPhase] = useState<BuilderPhase | null>(null);
  const effectivePhase: BuilderPhase =
    phase ?? (startInReview && activePlan ? { kind: "review", plan: activePlan, isNew: false } : { kind: "wizard" });

  const generate = useCallback(
    (inputs: PlanInputs) =>
      requireAuth(() => {
        const plan = buildPlan(inputs, { id: newPlanId(), createdAt: new Date().toISOString() });
        setPhase({ kind: "review", plan, isNew: true });
      }),
    [requireAuth],
  );

  const activate = useCallback(
    (plan: NutritionPlan) =>
      requireAuth(() => {
        if (target.kind === "newPeriod") {
          // Title and dates come next, in the period dialog (see `pending`).
          setPending({ plan, title: defaultPlanTitle(plan.inputs.goal) });
          return;
        }
        const kcal = plan.base.calories.toLocaleString("tr-TR");
        if (target.kind === "period" && !period) {
          // Deleted meanwhile (another tab): don't silently overwrite the main plan instead.
          toast.error("Dönem bulunamadı", "Bu dönem silinmiş olabilir; panelden yeniden oluşturabilirsin.");
          router.push(ROUTES.panel);
          return;
        }
        if (period) {
          savePeriod({ ...period, plan });
          toast.success(`"${period.title}" güncellendi`, `Bu dönemde günlük hedefin ${kcal} kcal.`);
        } else {
          savePlan(plan);
          toast.celebrate("Planın aktif!", `Günlük hedefin ${kcal} kcal. Ana ekranda takip edebilirsin.`);
        }
        router.push(ROUTES.panel);
      }),
    [requireAuth, target.kind, period, savePeriod, savePlan, toast, router],
  );

  /** The new period got its title and dates in the dialog: save it and go back to the panel. */
  const finishPeriod = useCallback(
    (saved: Parameters<typeof savePeriod>[0]) => {
      savePeriod(saved);
      setPending(null);
      toast.celebrate(`"${saved.title}" planlandı`, "Tarihi gelince hedeflerin otomatik bu plana geçer.");
      router.push(ROUTES.panel);
    },
    [savePeriod, toast, router],
  );

  return {
    phase: effectivePhase,
    hasActivePlan: activePlan !== null,
    /** The plan the wizard starts from: the edited one, else today's. */
    startingPlan: activePlan,
    periods,
    period,
    pending,
    generate,
    activate,
    finishPeriod,
    cancelPending: () => setPending(null),
    backToWizard: () => setPhase({ kind: "wizard" }),
  };
}

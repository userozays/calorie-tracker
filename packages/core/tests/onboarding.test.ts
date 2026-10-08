import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { goalFromWeights, onboardingToPlanInputs } from "../src/nutrition/onboarding.ts";
import { activityFactor } from "../src/nutrition/plan.ts";
import type { OnboardingInput } from "../src/schemas/onboarding.ts";
import { planInputsSchema } from "../src/schemas/plan.ts";

const base: OnboardingInput = {
  age: 30,
  sex: "female",
  heightCm: 165,
  weightKg: 70,
  targetWeightKg: 62,
  activity: "moderate",
  dietStyle: "highProtein",
  fatPerKg: 1.2,
  timeZone: "Europe/Istanbul",
};

describe("first-time setup", () => {
  it("reads the goal from current vs goal weight", () => {
    assert.equal(goalFromWeights(70, 62), "cut");
    assert.equal(goalFromWeights(70, 78), "bulk");
    assert.equal(goalFromWeights(70, 70.5), "maintain");
  });

  it("builds valid plan inputs for every activity level, with rising activity factors", () => {
    let previous = 0;
    for (const activity of ["sedentary", "light", "moderate", "active", "veryActive"] as const) {
      const inputs = onboardingToPlanInputs({ ...base, activity });
      assert.ok(planInputsSchema.safeParse(inputs).success, activity);
      const factor = activityFactor(inputs.trainingStyle, inputs.trainingDays.length);
      assert.ok(factor > previous, `${activity} should be above the previous level`);
      previous = factor;
    }
  });

  it("drops the goal weight when maintaining", () => {
    assert.equal(onboardingToPlanInputs({ ...base, targetWeightKg: 70 }).targetWeightKg, null);
  });
});

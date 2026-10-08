import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { admin, anonymous, createTestUser, skip, type TestUser } from "./helpers.ts";

/*
 * Constitution VIII / SC-005: a user can never read or change another user's rows; anonymous
 * clients read nothing; the shared food tables are read-only. Data for user A is seeded with the
 * service role (meals are created by log_meal from US3 on).
 */

const FOOD = "test_rls_food";

describe("row level security", { skip }, () => {
  let a: TestUser;
  let b: TestUser;
  let mealId: string;
  let planId: string;

  before(async () => {
    [a, b] = await Promise.all([createTestUser(), createTestUser()]);
    const db = admin();
    await db.from("foods").upsert({
      id: FOOD,
      name_tr: "RLS test yemeği",
      category: "mixed",
      kcal_per_100g: 100,
      protein_per_100g: 10,
      carbs_per_100g: 10,
      fat_per_100g: 2.2,
      typical_portion_g: 100,
    });
    const meal = await db
      .from("meals")
      .insert({ user_id: a.id, slot: "lunch", local_date: "2026-10-09", time_zone: "Europe/Istanbul", name: "Test öğünü" })
      .select("id")
      .single();
    assert.ifError(meal.error);
    mealId = meal.data.id;
    assert.ifError((await db.from("meal_items").insert({ meal_id: mealId, food_id: FOOD, grams: 150 })).error);
    const plan = await db
      .from("nutrition_plans")
      .insert({
        user_id: a.id,
        inputs: { sex: "female" },
        bmr: 1400,
        tdee: 1700,
        base_kcal: 1300,
        base_protein_g: 100,
        base_carbs_g: 150,
        base_fat_g: 33,
      })
      .select("id")
      .single();
    assert.ifError(plan.error);
    planId = plan.data.id;
  });

  it("user B cannot see user A's profile, plans, meals or items", async () => {
    for (const table of ["profiles", "nutrition_plans", "meals", "meal_items"]) {
      const { data, error } = await b.client.from(table).select("*").neq(table === "profiles" ? "id" : "user_id", b.id);
      assert.ifError(error);
      assert.equal(data.length, 0, `${table} leaked ${data.length} row(s)`);
    }
  });

  it("user B cannot change or delete user A's rows", async () => {
    const update = await b.client.from("meals").update({ name: "ele geçirildi" }).eq("id", mealId).select();
    assert.equal(update.data?.length ?? 0, 0);
    const del = await b.client.from("meals").delete().eq("id", mealId).select();
    assert.equal(del.data?.length ?? 0, 0);
    const profile = await b.client.from("profiles").update({ height_cm: 200 }).eq("id", a.id).select();
    assert.equal(profile.data?.length ?? 0, 0);
    const item = await b.client.from("meal_items").insert({ meal_id: mealId, food_id: FOOD, grams: 100 });
    assert.ok(item.error, "B added an item to A's meal");

    const still = await admin().from("meals").select("name").eq("id", mealId).single();
    assert.equal(still.data?.name, "Test öğünü");
  });

  it("user A sees their own rows", async () => {
    const meals = await a.client.from("meals").select("id, total_kcal").eq("id", mealId);
    assert.ifError(meals.error);
    assert.equal(meals.data.length, 1);
    assert.equal(Number(meals.data[0].total_kcal), 150);
    const plans = await a.client.from("nutrition_plans").select("id").eq("id", planId);
    assert.equal(plans.data?.length, 1);
  });

  it("the app cannot write computed columns or onboarding_completed", async () => {
    const totals = await a.client.from("meals").update({ total_kcal: 1 }).eq("id", mealId);
    assert.ok(totals.error, "total_kcal was writable");
    const snapshot = await a.client.from("meal_items").insert({ meal_id: mealId, food_id: FOOD, grams: 10, kcal_per_100g: 1 });
    assert.ok(snapshot.error, "kcal_per_100g was writable");
    const onboarded = await a.client.from("profiles").update({ onboarding_completed: true }).eq("id", a.id);
    assert.ok(onboarded.error, "onboarding_completed was writable");
  });

  it("anonymous clients read nothing, and nobody writes foods", async () => {
    const anon = await anonymous().from("meals").select("id");
    assert.ok(anon.error || anon.data?.length === 0);
    const food = await a.client.from("foods").insert({ id: "hack", name_tr: "x", category: "mixed", kcal_per_100g: 1, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 0, typical_portion_g: 1 });
    assert.ok(food.error, "a user inserted a food");
    const readFoods = await a.client.from("foods").select("id").eq("id", FOOD);
    assert.equal(readFoods.data?.length, 1);
  });
});

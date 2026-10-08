# Contract: Database API (Supabase)

The app talks to Supabase only from `apps/mobile/src/services/` (constitution I). Reads use the
tables directly under RLS; every write that must be atomic or validated goes through a
`security definer` function called with `supabase.rpc(...)`. All functions check
`auth.uid() is not null` and act only on the caller's rows. Inputs and outputs are validated in the
app with the matching `@calorie/core` schema (constitution II). Errors are raised with a stable
`code` the app maps to Turkish messages.

## Access matrix (authenticated role)

| Table | select | insert | update | delete |
|---|---|---|---|---|
| `profiles` | own | — (trigger) | own, except `onboarding_completed` | — (cascade) |
| `nutrition_plans` | own | via RPC | — | — |
| `foods`, `food_aliases` | all | — | — | — |
| `meals` | own | via RPC | own (`slot`, `name`) | own |
| `meal_items` | own | own (adds to an own meal) | own (`grams`, `food_id`, `position`) | own |

Anonymous role: no access to any table.

## Functions

### `complete_onboarding(answers jsonb, plan jsonb) → profiles`
- `answers`: `{ sex, age, height_cm, weight_kg, goal_weight_kg|null, activity_level, diet_style,
  fat_per_kg, time_zone }` (core `onboardingAnswersSchema`).
- `plan`: the plan the app built with `buildPlan` from those answers (core `nutritionPlanSchema`).
- Updates the profile (`birth_year` = current year − age), inserts the plan as active through the
  same path as `save_plan`, sets `onboarding_completed = true`; one transaction.
- Errors: `invalid_answers`, `plan_below_floor`, `plan_macros_mismatch`, `already_completed`.

### `save_plan(plan jsonb) → nutrition_plans`
- Inserts the plan as active and deactivates the previous one. The validation trigger enforces the
  floor and macro-sum invariants for every day.
- Errors: `plan_below_floor`, `plan_macros_mismatch`, `onboarding_required`.

### `log_meal(slot meal_slot, local_date date, time_zone text, name text, items jsonb) → meals`
- `items`: `[{ food_id, grams }]`, 1–30 entries. Nutrition snapshots and totals are filled by the
  triggers; any nutrition values in the payload are ignored.
- Returns the meal with its computed totals.
- Errors: `no_items`, `too_many_items`, `invalid_grams`, `unknown_food`, `date_out_of_range`,
  `onboarding_required`.

### `search_foods(q text, max_results int default 20) → setof (food_id, name_tr, matched_alias, typical_portion_g, kcal_per_100g, score)`
- `q` is the text as typed plus the suffix candidates from core `searchStems` ("tavuğu" → "tavuk"),
  space-separated, 1–60 chars; the function normalizes it with `normalize_tr`.
- Ranking: exact alias match, then prefix match, then trigram similarity ≥ 0.3; one row per food
  (best alias). `max_results` is capped at 50.

## Reads used by the app

| Need | Query |
|---|---|
| Session's profile | `profiles` where `id = auth.uid()` |
| Active plan | `nutrition_plans` where `is_active` |
| A day's meals with items | `meals` (+ `meal_items(*, foods(name_tr))`) where `local_date = $date` order by `logged_at` |
| Calendar month | `meals` select `local_date, total_kcal` where `local_date` in the month; the app sums per day and rates each day against that day's targets with core `rateDay` |

## Generated types

`supabase gen types typescript` writes `packages/core/src/db/database.types.ts`; services use it
for the Supabase client and still validate rows with the core schemas.

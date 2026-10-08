<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Principles defined: I. Layered Architecture · II. Validated Boundaries · III. Server-Owned Numbers ·
  IV. The User Confirms the Grams · V. One AI Boundary · VI. Only Code We Use ·
  VII. Turkish First · VIII. Secure and Abuse-Limited by Default · IX. Tested and Measured
- Added sections: Product Scope and Technology Constraints · Development Workflow · Governance
- Removed sections: none (first ratification)
- Templates: plan/spec/tasks templates read this file at runtime; no template edits needed.
- Deferred / to confirm with the owner:
  - The AI plan strategy (LLM nudging the formula plan ±5 % and writing a summary) is listed as
    out of scope. Recommended by the 2026-10-08 review; not yet explicitly confirmed.
  - The hosted vision model is chosen by measurement (Principle V); no vendor is fixed here.
-->

# Calorie Tracker Constitution

## Core Principles

### I. Layered Architecture

The code is split into layers and each layer imports only from the layers below it:
`app/` (routes) → `components/` → `hooks/` + `providers/` → `services/` → `server/` → `lib/` → `types/`.

- `components/ui/*` are presentational: props in, markup out. No fetch, no services, no business rules.
- State and business flows live in hooks; nutrition math never lives in a component.
- `services/http.ts#request` is the only browser `fetch`. Route Handlers stay thin: validate, check the
  session, call `server/`, map the result.
- `server/**` modules import `server-only`. The layer rules are enforced by ESLint
  (`no-restricted-imports`), not by convention.

Rationale: the existing codebase already follows these rules well; tooling keeps it that way.

### II. Validated Boundaries

All untrusted data passes a Zod schema from `types/`: request bodies, query strings, stored JSON,
AI model output, third-party API responses and API responses on the client. Types are inferred from
schemas. `z` is imported from `@/types/zod`. TypeScript runs in strict mode and `any` is not allowed.

### III. Server-Owned Numbers

- The server recomputes every total from items; client totals are never trusted.
- There is exactly one nutrition engine (`computePlan` and its helpers in `lib/nutrition/`). The
  dashboard, plan card, insights and export all read targets from it; no parallel formulas.
- Engine invariants hold for every day of every plan and are covered by property tests:
  each day's calories ≥ the sex-specific floor (1200 kcal female, 1500 kcal male), and
  protein·4 + carbs·4 + fat·9 equals the day's calories within rounding.
- Days are stored as a local date (`YYYY-MM-DD`) plus the user's IANA time zone; day grouping is
  never re-derived from the browser clock.

### IV. The User Confirms the Grams

AI recognises foods and proposes approximate grams; it never decides the logged amount. Every
logging path (photo, barcode, search, text description, own food) ends in a review step where the
user sees and can edit the grams. Nutrition values per 100 g come from the food database, never from
model output. Unknown or implausible values stay empty and are highlighted; nothing is guessed silently.

### V. One AI Boundary

- All model calls go through a single server module (the provider boundary). Features never call a
  vendor SDK directly.
- One hosted vision-capable model serves photo recognition, label reading and free-text meal
  parsing. Its output is constrained to a JSON schema whose food identifiers come from our database,
  and it is validated again on the server.
- The model is chosen and changed by measurement on a committed food eval set (real Turkish meals,
  labels and phrases), recording accuracy, latency and cost per call. Changing models is a config
  change plus an eval run.
- No machine-learning models run inside the web process (no local CLIP/SAM/OCR, no Ollama).
- When the model is unavailable, logging still works through search, barcode and the rule-based text
  preview, and the UI says clearly that photo analysis is unavailable.

### VI. Only Code We Use

- Code that no shipped feature uses is deleted, not kept "for later". Git history is the archive.
- Removing a feature removes all of it in the same change: routes, components, hooks, services,
  server modules, types, tests, dependencies, env vars, docs and scripts.
- No legacy read paths or compatibility shims without real data that needs them; there is no
  production data today, so none are kept.
- `knip` runs in CI and must report no unused files, exports or dependencies (documented
  exceptions only).

### VII. Turkish First

The product is Turkish: UI text, validation and API error messages, food names and aliases. The
voice uses "sen" consistently. Code, comments and engineering docs are English. Text parsing is
tested against real Turkish phrases, including negation (-sız/-siz), number words ("bir", "buçuk",
"iki yüz") and suffixes.

### VIII. Secure and Abuse-Limited by Default

- Every data query is scoped to the signed-in user; other users' records answer 404.
- Rate limits are persistent (database or Redis, not process memory), keyed on a trusted client IP
  and on the account; login counts failed attempts only.
- Every AI route has a per-user quota. Request bodies have size limits before parsing; mutating
  requests check `Origin` and require JSON or multipart as appropriate.
- Uploaded images are decoded with a pixel limit, re-encoded and stripped of EXIF/location before
  storage; they are served to their owner only.
- Secrets live in environment variables (Vercel, `.env.local`), never in the repository.

### IX. Tested and Measured

- Pure logic in `lib/` has unit tests; the nutrition engine has property tests; Route Handlers have
  tests against a real database (authorization, scoping, validation); one end-to-end smoke test
  covers sign-up → onboarding → logging → dashboard.
- AI features are judged by the food eval set, not by impressions; a change that touches prompts,
  schemas or the model reports its eval result in the PR.
- CI blocks merges unless `test`, `typecheck`, `lint`, `knip` and `build` pass.

## Product Scope and Technology Constraints

**In scope:** four ways to log a meal (photo, barcode, food search, short text description;
reference flow: the Calyra app), plus own foods with label reading, saved meals, meal slots,
the plan wizard (formula-based), titled plan periods, weight and BMI, water, intermittent fasting,
progress and trends, data export and account deletion.

**Out of scope:** the FitBot chat coach (removed together with its knowledge base, eval scripts and
tool loop), the AI plan strategy, on-device or in-process ML models, and the local Ollama runtime.

**Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 with the tofuhq tokens
in `src/app/globals.css`, Zod 4, Prisma with PostgreSQL on Supabase, Supabase Storage for photos,
deployed on Vercel. Server Components load initial data; client data fetching uses one query/cache
layer with cancellation and a global 401 sign-out.

**Food data:** a `Food` table with aliases and portions, sourced from TürKomp (licence to be
confirmed), USDA FoodData Central and Open Food Facts; users' own foods live in the same table with
an owner.

## Development Workflow

- Work follows Spec Kit: `/speckit-specify` → `/speckit-clarify` (when anything is ambiguous) →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Specs live in `specs/`.
- Contributors work on a fork or branch and open small pull requests, one concern each. The
  repository owner reviews and merges.
- Database changes ship as committed Prisma migrations in the same PR as the code that needs them.
- `CLAUDE.md` (agent guide) and `README.md` are updated in the same PR whenever behaviour,
  structure or commands change.

## Governance

This constitution overrides other practices in this repository. Amendments are made by pull
request, approved by the repository owner, with a version bump: MAJOR when a principle is removed or
redefined, MINOR when a principle or section is added or materially expanded, PATCH for wording.
Every plan produced by `/speckit-plan` includes a constitution check; a deviation must be justified
in the plan's complexity tracking or the plan is revised. `CLAUDE.md` holds day-to-day guidance and
must not contradict this document.

**Version**: 1.0.0 | **Ratified**: 2026-10-08 | **Last Amended**: 2026-10-08

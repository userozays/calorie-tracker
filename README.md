# Calorie Tracker

Turkish, mobile-first web app for logging meals: photo, barcode, food search and a free-text quick
bar ("Öğlen 200g ızgara tavuk, bol salata"), with a formula-based nutrition plan, plan periods,
weight, water, intermittent fasting and progress trends.

## Getting started

```bash
npm install                 # also runs `prisma generate`
cp .env.example .env        # DATABASE_URL="file:./dev.db"
npm run db:migrate          # creates prisma/dev.db and applies migrations
npm run dev                 # http://localhost:3000
```

Checks (CI runs the same): `npm test`, `npm run typecheck`, `npm run lint`, `npm run knip`, `npm run build`.

## Where things are written down

- **Scope and rules:** `.specify/memory/constitution.md` (Spec Kit). New features start with
  `/speckit-specify` and live in `specs/`.
- **Architecture, flows and conventions:** `CLAUDE.md`.
- **Design system:** `tofuhq-design/` and the tokens in `src/app/globals.css`.

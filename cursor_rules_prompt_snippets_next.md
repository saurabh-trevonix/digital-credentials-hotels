# RULES.md

A concise playbook for Cursor + this repo (Next.js, TypeScript, Tailwind, shadcn/ui).

## 0) Stack baseline
- **Framework**: Next.js App Router (RSC by default)
- **Lang**: TypeScript **strict**
- **UI**: Tailwind CSS, shadcn/ui (Radix under the hood)
- **Forms/Validation**: `react-hook-form` + `zod`
- **Tests**: Vitest + React Testing Library; Playwright optional for e2e
- **Aliases**: `@/*` to `./` (see `tsconfig.json`)

> **Golden rule**: Prefer **Server Components**. Use `"use client"` only for interactivity/state or browser APIs.

## 1) Architecture & folders
```
app/                 # route groups, pages, layout, metadata
  (group)/
  check-in/
    page.tsx
components/          # reusable UI (PascalCase files)
  ui/                # shadcn primitives or wrappers
  figma/             # design-prototype components
lib/                 # pure utils, API clients, helpers (no React here)
hooks/               # custom hooks (client only)
types/               # shared types & zod schemas
styles/              # global.css, layer utilities
public/              # static assets
```
- Keep components **presentational**; heavy logic → `lib/` or server functions.
- Route Handlers: `app/**/route.ts` for API work; validate with zod at boundaries.

## 2) Naming & code style
- Components: `PascalCase.tsx`; hooks: `useSomething.ts`.
- Functions/vars: `camelCase`; constants: `SCREAMING_SNAKE_CASE`.
- Types/Interfaces: `PascalCase`; prefer `type` aliases. Export **named** (avoid default) for libraries/utilities.
- Tests: `*.test.ts` | `*.test.tsx` colocated.
- CSS: Tailwind utility-first. Extract `@apply` only for repeated 3+ class bundles.

## 3) Imports & dependencies
- Don’t add new deps without approval. If needed, propose: **name, purpose, import example**.
- No server-only modules in client files; no `process.env.*` usage in client.
- Use path alias `@/` for internal imports.

## 4) Data, API & validation
- **All external inputs must be validated**.
  - Define a zod schema in `types/` (e.g., `types/checkIn.ts`).
  - Infer TS types via `z.infer<typeof Schema>`.
- API client: create a thin `lib/api.ts` with a typed `fetchJson<T>()` and zod decode.
- Errors: throw `AppError` (custom) from `lib/` and convert to HTTP in route handlers.

## 5) React & state
- Keep components ≤80–120 LOC where feasible. Extract pure helpers.
- Local state first; contexts only for cross-cutting concerns (theme, auth, toasts).
- Memoization: only for measurable hotspots.

## 6) Performance
- Server Components default; split client islands.
- Use `next/image` with width/height; add remote patterns in `next.config.js` when needed.
- Code-split heavy client widgets via `next/dynamic` + `suspense` fallback.
- Control caching: set `export const revalidate = …` or `dynamic = 'force-dynamic'` explicitly in routes.

## 7) Accessibility & UX
- Every input has a `<label>` or `aria-label`. Use shadcn `<Form>` patterns.
- Keyboard-first: focus management for dialogs/drawers; `aria-live` for async results.
- Provide **empty**, **loading**, and **error** UI states with concise copy.

## 8) Security
- No secrets in client code or logs. Sanitize/escape user HTML; avoid `dangerouslySetInnerHTML`.
- Mutations use POST; add origin/CSRF checks for non-API forms when applicable.
- Validate, authenticate, authorize in that order.

## 9) Testing & quality gates
- Unit tests for schemas, pure utils, and critical UI logic.
- E2E happy path for core flows (optional at start).
- PR passes: `typecheck`, `lint`, `build` (document expected commands in PR).

## 10) Git & commits
- Conventional Commits: `feat(scope): …`, `fix(scope): …` etc.
- Small, focused PRs. Include a brief “Why” in the body and a checklist of acceptance criteria.

## 11) Cursor prompting rules (always apply)
- Provide **Goal, Scope (files), Constraints, Inputs, Acceptance, Diff**.
- Ask for **minimal unified diffs**; forbid repo-wide reformat.
- For assumptions, Cursor must **list them on top of the diff**.
- “No new dependencies unless explicitly approved.”

## 12) .cursorignore (suggested)
```
.next/
.vercel/
node_modules/
public/**.map
**/*.log
coverage/
**/*.snap
```

---

# PROMPT-SNIPPETS.md
Reusable prompts for Cursor. Replace 🟩placeholders.

## 1) Create a new component (client) with form + zod
```
Goal: Add a check‑in form component.
Edit only: components/HotelCheckIn.tsx (new), app/check-in/page.tsx.
Constraints: Next.js App Router, TypeScript strict; use shadcn/ui + react-hook-form + zod; Tailwind for styling; keep component <120 LOC.
Inputs: Fields = fullName, documentId, roomNumber, consent(boolean). Validation: fullName 2–60 chars; documentId regex ^[A-Z0-9]{6,12}$; roomNumber numeric 1–9999.
Acceptance:
 1) Inline errors and disabled submit until valid; 2) accessible labels; 3) success handler calls `onSubmit(data)` prop; 4) unit tests for schema; 5) no `any`.
Output: unified diff for each file + short rationale; list assumptions at top. Do not add new deps.
```

## 2) Fix a bug with minimal patch
```
Goal: Fix crash when submitting HotelCheckIn without consent.
Scope: Only change `components/HotelCheckIn.tsx` lines 42–78.
Constraints: Minimal diff; preserve public props; add a schema test.
Acceptance: Root cause explained in ≤5 bullets; tests fail before/green after.
Output: Show patch + one Vitest test.
```

## 3) Add a Route Handler with validation
```
Goal: Create POST /api/check-in.
Files: app/api/check-in/route.ts (new), types/checkIn.ts (schema), lib/api.ts (fetchJson util if missing).
Constraints: Validate request with zod; return typed JSON via NextResponse; handle 400/409/500; no new deps.
Acceptance: 3 tests—valid payload 200, invalid 400, conflict 409 (mock).
Output: diffs + tests.
```

## 4) Safe refactor
```
Goal: Extract pure helpers from HotelCheckIn.
Scope: Refactor `components/HotelCheckIn.tsx`—no behavior change. Create `lib/checkIn.ts` with `validateCheckIn(data)` and `formatGuestName(name)`.
Constraints: Keep component <80 LOC; add unit tests for new helpers; keep exports stable.
Acceptance: Types stricter; cyclomatic complexity <10.
Output: minimal diffs + tests.
```

## 5) Explain a file (for review)
```
Goal: Explain selected file at senior dev level in 8 bullets: purpose, inputs, outputs, invariants, coupling, edge cases, perf risks, test ideas.
Scope: <selected code>.
Output: bullets only, no code.
```

## 6) Add tests to existing code
```
Goal: Add test coverage for zod schema and submit handler.
Files: types/checkIn.ts, components/HotelCheckIn.tsx, components/__tests__/HotelCheckIn.test.tsx.
Constraints: Vitest + RTL; mock network; no runtime behavior changes.
Acceptance: cover valid/invalid cases; disabled button snapshot; submit called with parsed data.
Output: diffs only.
```

## 7) Performance pass on a client component
```
Goal: Reduce re-renders in HotelCheckIn.
Scope: components/HotelCheckIn.tsx only.
Constraints: Measure first; add memoization only where it changes React DevTools render count; avoid premature `useMemo`/`useCallback`.
Acceptance: Show before/after render counts (manual notes) and explain trade-offs.
Output: minimal diff + 3-bullet rationale.
```

## 8) Accessibility audit & fixes
```
Goal: Ensure HotelCheckIn is fully accessible.
Scope: components/HotelCheckIn.tsx.
Constraints: Labels/ids correct, tab order logical, `aria-live` for async, focus trap for dialogs, ESC to close.
Acceptance: Provide axe-core issue list (if simulated) and the applied fixes.
Output: minimal diffs + checklist.
```

## 9) Data fetching with caching policy
```
Goal: Fetch bookings in server component with explicit caching.
Files: app/check-in/page.tsx (server), lib/api.ts (fetchJson).
Constraints: `export const revalidate = 60` (ISR); handle error UI state.
Acceptance: Renders list within 1s; shows retry on error.
Output: diff + reasoning.
```

## 10) Introduce a dependency (approval flow)
```
Goal: Propose adding `zod` (if missing).
Output: Provide package name, size, why, import example, and alternative. Wait for my approval before changing files.
```

## 11) Build error triage
```
Goal: Resolve TS build error: 🟩paste error.
Scope: Only the file(s) causing error.
Constraints: Minimal change; keep types narrow; explain root cause.
Acceptance: `npm run typecheck && npm run build` passes.
Output: patch + 3-bullet root cause.
```

## 12) CRUD scaffold (RSC + client island)
```
Goal: Scaffold bookings CRUD.
Files: app/bookings/page.tsx (server list), app/bookings/new/page.tsx, app/bookings/[id]/page.tsx, components/BookingForm.tsx (client), app/api/bookings/route.ts.
Constraints: RSC for lists/detail; client form island; zod validation; optimistic UI for create; Tailwind minimal.
Acceptance: list, create, update, delete paths; tests for schema + optimistic state.
Output: diffs + brief docs section added to ARCHITECTURE.md.
```

## 13) Commit message request
```
Goal: Generate a Conventional Commit for the provided diff with a clear scope and a 1–2 line rationale.
```

## 14) Docs update
```
Goal: Append a 8–10 line “Check-in flow” section to ARCHITECTURE.md summarizing routes, states, schemas, and error handling.
Output: single diff only.
```

## 15) Style polish (Tailwind)
```
Goal: Improve visual rhythm of HotelCheckIn without changing structure.
Scope: components/HotelCheckIn.tsx classes only.
Constraints: spacing scale, readable line-length, consistent focus rings; no custom CSS; keep classes ≤120 chars per line.
Acceptance: before/after screenshots (described) + zero logic changes.
Output: diff + bullets.
```

---

**How to use**
1) Put this file as `RULES.md` in the repo root (and the snippets as `PROMPT-SNIPPETS.md`).
2) Keep both under ~150 lines each so Cursor loads them into context.
3) For each task, copy a snippet, fill placeholders, and paste into Cursor Composer or inline selection.


# Pullday — build plan & status

Updated at the end of every milestone. This is the status tracker for the build, not a spec written up front and left alone.

## Status

| # | Milestone | Status |
|---|---|---|
| M0 | Repo setup + docs | done |
| M1 | Scaffold + native linking | pending |
| M2 | Mock layer + navigation shell | pending |
| M3 | Login | pending |
| M4 | Home: card render + swipe | pending |
| M5 | Collection tab | pending |
| M6 | Streak (timer-based) | pending |
| M7 | Streak-freeze buy screen | pending |
| M8 | Backend scaffold + schema (`pullday-be`) | pending |
| M9 | Basic CRUDs (`pullday-be`) | pending |
| M10 | Swap mock → HTTP + LAN run | pending |
| M11 | Native lifecycle pass | pending |
| M12 | Hand-in | pending |

---

# Pullday — 15-Hour Mobile Work Trial Build Plan

## Context

This is a time-boxed (15h) work-trial assignment. **Pullday** is a card-collecting daily-habit app. A v1 already shipped with real bugs (streaks resetting at 11:58pm, lost streaks after paid freezes/win-backs, a card disappearing after a phone call, collection-screen lag, swipes not registering, a freeze when a rare card appears). The brief is explicitly grading **judgment and correctness over feature count** — what you build first, what you cut, and how honestly you document it. Finishing everything is *not* expected.

We build a trimmed but correct slice: the daily 8-card swipe challenge, streak state machine with freeze/win-back, collection + binder, and a minimal Postgres-backed backend. We borrow architectural conventions from `/Users/mohit/my-projects/nivo` (bare RN CLI patterns) but create **new repos** — not a fork.

### Locked decisions
- **Bare React Native CLI** (not Expo), matching nivo: RN 0.87.0 / React 19.2.8 / TS 5.0.4, New Architecture enabled.
- **iOS first** (primary tested target); Android only if time allows, never at iOS's expense.
- **App-first, mock-data-first.** Build the **app** fully against an in-app **mock data layer** (fixtures behind the same `ApiClient` interface) — get the whole UX working end-to-end on mocks. **Then** build basic backend CRUDs and swap the mock client for the real one. Backend is Phase 2, not Phase 1.
- **Core functionality first, in this order:** (1) card rendering & swipe (Home), (2) collection listing, (3) streak (**timer-based** — countdown to the next day / time left), then (4) one streak-freeze **buy** screen.
- **Bottom-nav navigation** — Collection lives as a tab in the bottom nav (with Home); other screens (card detail, streak-freeze buy) are pushed on top.
- **Local only (for now)** — when the backend arrives it runs on the laptop, Postgres local, phone over LAN IP. No cloud deploy yet.
- **Two separate repos** (already created):
  - App: `https://github.com/mohitcol0562/pullday-app`
  - Backend: `https://github.com/mohitcol0562/pullday-be`
- **No theme system at all** — single flat palette (`colors.ts`), no light/dark, no `AppearanceProvider`; stripped from the start. Mockups aim for *clean + intuitive, minimal styling* — not heavily designed.
- **Swipe challenge uses `rn-swiper-list`** (github.com/Skipperlla/rn-swiper-list, MIT) instead of a hand-rolled gesture component.

### Blocking prerequisite (do before any schema is written)
The brief provides `data.sql` (~1,993 cards) but **not** `schema.sql` — you write the schema to match the data. **`data.sql` is not yet on this machine.** Hour 0 of Phase 3 = obtain `data.sql`, then grep the real `INSERT INTO cards (...)` column list and `SELECT DISTINCT rarity` to confirm the exact rarity enum spellings. The `CHECK (rarity IN ('common','rare','holo'))` below is a **working assumption to verify**, not a fact.

---

## Working process (applies to every milestone — do not skip)

This is a **gated, milestone-by-milestone** workflow. The rules below override any "just keep going" instinct:

1. **Milestone gate:** Work proceeds one milestone at a time. At the end of each milestone, work **stops** and the next one does not begin.
2. **Commit approval:** At each milestone end: (a) show the staged changes summary and a **proposed commit message**, then (b) **wait for explicit approval**. Only after approval does the commit happen. **The user pushes** — Claude never pushes.
3. **No approval → no progress:** Without approval of a milestone's commit, no progress to the next milestone and no further changes. Each milestone is one commit (or a tight few if it says so), approved individually.
4. **`PLAN_README.md` is a living doc:** this entire plan lives here, and is **updated at every milestone** — checking off what's done, recording decisions made, and adjusting remaining milestones as reality shifts. Single source of truth for status.
5. **`AI.md` is a living doc:** updated **as we go** (not only at the end) — each time AI meaningfully solves, writes, or gets something wrong, record what it did, where it was wrong, and what was kept vs discarded. This satisfies the brief's `AI.md` deliverable and keeps it honest rather than reconstructed from memory at hour 15.

Both docs were created in M0 and are touched again in every milestone thereafter.

---

## Repo layout — two repos

Cloned locally under `/Users/mohit/my-projects/new-project-ideas/`:

```
pullday-app/    # github.com/mohitcol0562/pullday-app — bare RN CLI app (built FIRST)
pullday-be/      # github.com/mohitcol0562/pullday-be  — Node + TS + Prisma + local Postgres (Phase 2)
```

> **Hand-in note:** the brief literally says "The repo (app and backend), with git history" (singular). Two repos is fine for development; for submission, link both clearly in the README. Flagged as a deliberate choice in DECISIONS.md.

### Mock data layer (the key to app-first)

The app talks to one `ApiClient` interface from day one. Behind it, a **`MockApiClient`** returns fixtures (`src/network/mock/*.ts`) — a trimmed card catalog (~60 cards covering common/rare/holo), a seeded "current user", and in-memory streak/collection/freeze state that mutates during a session. The real `HttpApiClient` is a drop-in swap in Phase 2. **No screen imports fixtures directly** — everything goes through the client, so the swap is one line.

### App (`pullday-app`)

**Conventions borrowed from nivo** (near-zero cost): `SCREENS` enum + typed `RootStackParamList`; one global Zustand store from domain slices with `persist`+AsyncStorage+`partialize`; `ApiClient` class with JWT interceptor; `useBootstrapAccount` boot pattern; plain `StyleSheet.create`.

**Deliberately cut from nivo** (state in DECISIONS.md): container/view screen split (use single `ScreenName.tsx`); **theme system / dark mode / `AppearanceProvider` — removed entirely, single flat palette only**; `verticalScale`/`horizontalScale`; `APP_TEXT` copy centralization. Not graded, not worth the hours.

```
pullday-app/src/
├── constants/   screens.ts, colors.ts (single flat palette, no theming)
├── navigation/   RootNavigator.tsx (auth stack + BottomTabs), BottomTabs.tsx, types.ts
├── network/
│   ├── ApiClient.ts         # interface both clients implement
│   ├── MockApiClient.ts     # fixtures-backed (Phase 1)
│   ├── HttpApiClient.ts     # real backend (Phase 2 swap)
│   └── mock/                # cards.ts, user.ts, state.ts fixtures
├── screens/      Login, Home(swipe), Collection, CardDetail, Streak, ShopFreeze, DevMenu
├── components/   ChallengeSwiper.tsx (wraps rn-swiper-list), CardFace.tsx, RevealOverlay.tsx, CardThumb.tsx, StreakTimer.tsx
├── store/        storageService.ts, useAuthStore.ts, useCollectionStore.ts, useStreakStore.ts
├── services/     fakeStore.ts (fake IAP for freeze), stripe.ts (win-back, later)
├── hooks/        useBootstrapAccount.ts, useAppStateSync.ts, useFetch.ts
└── devtools/     (hidden-gesture dev menu entry)
```

**Bottom nav:** `Home` (today's swipe challenge) and `Collection` as tabs; `Streak` either a third tab or opened from the Home header (timer visible on Home too). `CardDetail`, `ShopFreeze`, and `DevMenu` are stack-pushed over the tabs. `Login` is a pre-tab auth stack.

### UI mockups (clean, minimal, intuitive — not heavily styled)

Four screens mocked up front to align before coding:
1. **Login** — logo/title, email + password **prefilled with defaults**, one primary "Log in" button. Minimal.
2. **Home (swipe)** — streak + live timer in header, a card in center with art/name/set, swipe hint legend (← common · ↑ holo · → rare), progress dots (card 3/8). This is the hero screen.
3. **Collection (tab)** — 3-column grid, owned cards in color, unowned greyed, a small "owned X / total" header, bottom nav visible.
4. **Shop / streak-freeze buy** — freeze icon, "freezes owned: 1/2", price ($1.99), a "Buy freeze" button, and purchase-state feedback.

Palette: one neutral background, one accent (card-rarity accents for common/rare/holo), generous spacing, system font. No gradients or heavy shadows.

### Backend (`pullday-be`) — layered, consistent routing/sub-routing

Four distinct layers — request flows **router → api → model → db**:

```
pullday-be/src/
├── router/      # where the request lands: route defs + sub-routers per domain,
│                #   input validation/auth guard, then delegates to api/. No business logic.
│                #   e.g. router/index.ts, router/auth.routes.ts, router/today.routes.ts,
│                #        router/streak.routes.ts, router/shop.routes.ts, router/winback.routes.ts,
│                #        router/collection.routes.ts, router/binder.routes.ts, router/dev.routes.ts
├── api/          # business logic (services). The graded brain lives here:
│                #   api/auth.service.ts, api/challenge.service.ts, api/streakEngine.ts,
│                #   api/shop.service.ts, api/winback.service.ts, api/collection.service.ts,
│                #   api/binder.service.ts, api/dev.service.ts
├── models/       # data model (ORM): Prisma schema + typed model accessors / repositories.
│                #   schema.prisma, models/*.repo.ts (thin typed wrappers over Prisma client)
└── db/           # database layer: Prisma client singleton, connection, migrations,
                  #   transaction helper, raw query escape hatch.
```

Each domain has a matching file across the layers (auth → auth.routes → auth.service → repo), so routing/sub-routing is uniform and predictable.

---

## Backend

**Stack:** Node 20 + Fastify + TypeScript + Prisma + **local Postgres**. Fastify (less boilerplate, built-in schema validation); Prisma (`$transaction` + typed client for the atomic streak mutations). Runs locally; phone reaches it via the laptop's LAN IP on the same WiFi. No cloud deploy for now.

### Data model (`pullday-be/src/models/schema.prisma`, mirrored to `schema.sql`)
- `users` — id, email (unique), password_hash (bcrypt), **timezone** (IANA, captured once at signup), created_at
- `cards` — id (`c_0001`), game, set_name, name, number, year, variant, grader, cert_number, grade, **rarity** `CHECK IN ('common','rare','holo')` (verify against real data), price_cents, population, story, image_url, price_history jsonb (13-week)
- `user_cards` — (user_id, card_id) PK, acquired_at  *(collection)*
- `streak_state` — user_id PK, current_streak, last_completed_day (date), broken_at, win_back_deadline, **streak_before_break** (cached for restore)
- `streak_freezes` — id, user_id, status `('available','consumed')`, consumed_on, purchased_at (max 2 available enforced in app logic)
- `daily_challenges` — id, user_id, challenge_day (date), card_ids text[8], answers jsonb (append-only), completed_at, reward_card_id, **UNIQUE(user_id, challenge_day)** (idempotency anchor)
- `binder_slots` — (user_id, page_number, slot_index 0–8) PK, card_id
- `payments` — id, user_id, kind `('streak_freeze','win_back')`, amount_cents, status `('pending','succeeded','failed','cancelled')`, stripe_payment_intent_id (unique, null for fake-store), **idempotency_key (unique)**, created_at
- `dev_overrides` — user_id PK, simulated_now (null = real clock) — backend's authoritative "now" override for the dev time-travel feature

### "What counts as a day" (the core graded decision — fixes bug #1)
- A day = the calendar date in `users.timezone`, computed from the **server's own clock** (or `dev_overrides.simulated_now`). The client supplies only the *zone* (once, at signup) — **never** the current time. Server is always authoritative for "what time is it."
- Every streak endpoint computes `today = toZonedDate(serverNow(), user.timezone)` and compares to `last_completed_day` with **date-only equality**, not elapsed-hours math.
- Accepted edge case (document in DECISIONS.md): a user crossing timezones mid-streak may see a day repeat/skip once near the boundary — same tradeoff Duolingo makes; per-request tz drift is out of scope.

### Endpoints
`POST /auth/signup {email,password,timezone}` · `POST /auth/login` · `GET /me` · `GET /cards?cursor=&limit=` (paginated) · `GET /cards/:id` · `GET /today` (lazy-creates today's challenge, idempotent) · `POST /today/answer {card_id,guess}` (append answer, reject re-answer; 8th answer → pick random unowned card + insert user_cards + set completed + increment streak, **all one transaction**) · `GET /collection` · `GET /binder` · `PUT /binder/:page/:slot {card_id}` · `GET /streak` (runs lazy streak-check) · `POST /shop/freeze/purchase {idempotency_key}` · `POST /winback/intent` · `POST /winback/confirm` · `POST /stripe/webhook` · dev (header-secret gated): `POST /dev/grant-card` · `POST /dev/advance-time {days}` · `POST /dev/reset-time`

---

## Streak / freeze / win-back state machine (`pullday-be/src/api/streakEngine.ts`)

All logic server-side only (client-side streak math is how v1 broke). **Lazy check** `checkAndApplyStreak(userId, serverNow)` at the top of every streak-touching request:
1. `last_completed_day === today` → no-op.
2. `=== today-1` → no gap, leave as-is.
3. `< today-1` and not already broken → consume `available` freezes (oldest first, one per missed day, max 2); if freezes cover the gap, advance `last_completed_day` to `today-1` (streak preserved) **in one transaction with the freeze update**; if not, break: `current_streak=0`, `broken_at=serverNow`, `win_back_deadline=serverNow+48h`, `streak_before_break` captured — same transaction.
4. Already broken → if `serverNow > win_back_deadline`, clear the window (read-path cleanup).

**Challenge completion:** single transaction writes final answer + picks random unowned card + inserts user_cards + sets completed/reward + bumps streak. Fixes bug #2's pattern generally.

**Win-back:** `/winback/confirm` and the Stripe webhook both call `restoreStreak()`, guarded by `payments.idempotency_key` — first wins, second is a no-op. Restores `current_streak` from cached `streak_before_break`. This is the app-kill-proof path (see lifecycle).

**Freeze purchase (fake store):** fake async pending→succeeded on the client, but server effect is the same transactional pattern — payment row + freeze row together.

---

## Mobile app

**Navigation:** bottom tabs (Home + Collection) nested in a stack; auth stack before it. `useBootstrapAccount()` checks AsyncStorage for a session → routes into tabs or to Login. `CardDetail`, `ShopFreeze`, `DevMenu` are stack-pushed over the tabs.

**State:** Zustand one store. Persisted: `authSlice` (token/user), `collectionSlice` (owned card ids — survives app kill, fixes bug #3 surface). Everything state-machine-authoritative (today's challenge, streak status, catalog, binder) is **server-fetched on focus, not cached** once a real backend exists — caching it is how stale-state bugs happen. Thin `useFetch(url)` hook, no React Query.

**Swipe challenge — use `rn-swiper-list`** (github.com/Skipperlla/rn-swiper-list, MIT): a reanimated + gesture-handler Tinder-style swiper. This removes the riskiest hand-rolled piece and still addresses bugs #5/#6 if wired carefully.
- Install: `rn-swiper-list` + peer deps `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets` (all already in the nivo stack). Screen wrapped in `GestureHandlerRootView` (already our App root pattern).
- `ChallengeSwiper.tsx` wraps `<Swiper>` with `data` = the 8 challenge cards, `renderCard` = `CardFace`. Mapping: **`onSwipeLeft` → common, `onSwipeRight` → rare, `onSwipeTop` → holo**; set `disableBottomSwipe`. Each callback gets the card index → record the guess, compare to that card's local `rarity` for instant correct/incorrect.
- Overlay labels `OverlayLabelLeft/Right/Top` show "COMMON / RARE / HOLO" while dragging (the swipe-hint legend in the mockup), tuned via the `*OpacityRange` props.
- Guard double-submit at the data layer: each card index answered once (idempotent in the mock/HTTP client), so a fast re-swipe during the exit animation can't double-count. `onSwipedAll` → trigger completion + reveal.
- **Reveal overlay (`RevealOverlay.tsx`)** stays our own: a separate unmounted-until-needed component; prefetch the reward card's `image_url` via FastImage the moment completion fires, before animating — no synchronous image decode on the JS thread during animation (fixes bug #6).
- Keep a thin wrapper (not `<Swiper>` scattered across the screen) so if the library misbehaves on a real device we can swap the internals without touching `Home`.

**Collection (~2000 items, fixes bug #4):** plain `FlatList` 3-col grid with `getItemLayout` (fixed cells), `windowSize={5}`, `removeClippedSubviews`, tuned `initialNumToRender`/`maxToRenderPerBatch`. **No FlashList** by default (uniform cells = FlatList's strong case); swap in `@shopify/flash-list` only if real-device profiling stutters (named contingency). `@d11/react-native-fast-image` (nivo-proven) for every thumb; page `GET /cards?limit=100` rather than loading all rows. Owned vs greyed = opacity toggle on the same image.

**Binder:** **tap-to-place, not drag-and-drop** (explicit cut, stretch item). Tap empty slot → owned-unplaced picker → tap card → `PUT /binder/:page/:slot`.

**Dev menu:** **in-app hidden-gesture screen** (7 taps on the streak counter), not `__DEV__`/`DevSettings` — must work in a Release-ish build during the live call. Calls `/dev/grant-card` + `/dev/advance-time`; `dev_overrides.simulated_now` is what makes "move time forward" actually affect server-computed day/streak logic. Dev endpoints gated by `X-Dev-Secret` env header (cheap, sufficient). Stretch item.

---

## Native lifecycle hardening (fixes bug #3, backgrounding, kill, calls, offline)
- **No challenge state in JS memory only** — each swipe answer is persisted (mock state, later server) instantly. App killed mid-challenge → relaunch reconstructs exact in-progress state.
- **AppState listener** (`useAppStateSync.ts`) on Home: on background→active, re-sync challenge + streak state.
- **Stripe win-back app-kill safety (later, with backend):** PaymentIntent created server-side before the sheet; confirmation lives on Stripe + `payments` row, not app memory.
- **Offline:** ApiClient retry-once-with-backoff (not a full offline queue — named cut). A failed answer submit must **not** optimistically mark the card answered — show a retry affordance.
- FastImage disk cache → collection art survives kill without refetch (free).

---

## Phases & milestones — APP-FIRST, core functionality first

Each milestone is one approval-gated commit. Every milestone ends with: **Done criteria met → update `PLAN_README.md` + `AI.md` → propose commit message → approval → commit → push → next milestone.** `~h` is a rough budget.

### Phase 0 — App foundation
- **M0 · Repo setup + living docs** (~0.5h) — in `pullday-app`: write this plan into `PLAN_README.md`, create `DECISIONS.md` + `AI.md` stubs, `.gitignore`.
  *Done:* docs present, first commit ready. → `chore: plan, decisions, ai docs`
- **M1 · Scaffold + native linking** (~1h) — RN CLI app (match nivo versions, New Arch), strip theme, install + **link** `react-native-gesture-handler` + `react-native-reanimated` + `react-native-worklets` + `rn-swiper-list` now (Stripe SDK deferred to win-back). App boots to a blank screen on a real iOS device.
  *Done:* iOS pod build green, app launches on device, swiper lib imports clean. → `chore: scaffold app + native linking`
- **M2 · Mock layer + navigation shell** (~1h) — `ApiClient` interface, `MockApiClient` + fixtures (~60 cards across rarities, mock user, in-memory streak/collection/freeze), bottom-tab nav (Home + Collection), auth stack, Zustand store, `colors.ts`.
  *Done:* tabs navigate; mock client returns data. → `feat: mock api layer + nav shell`

### Phase 1 — Core functionality (on mock data)
- **M3 · Login** (~0.5h) — login screen with **default email + password prefilled**, validates against mock user, persists session, routes into the tabs.
  *Done:* prefilled creds log straight in; session survives restart. → `feat: login screen`
- **M4 · Home: card render + swipe** (~2h) — the core. `ChallengeSwiper` wrapping `rn-swiper-list` (left=common/right=rare/up=holo, overlay labels, `disableBottomSwipe`), 8-card stack, immediate correct/incorrect, `RevealOverlay` on `onSwipedAll` (unlocks a mock card). **The highest-value piece.**
  *Done:* smooth, reliable swipes on a real device; full 8-card run reveals a card. → `feat: home swipe challenge`
- **M5 · Collection tab** (~1.5h) — tuned FlatList grid + FastImage, owned in color / unowned greyed, tap → `CardDetail` (art, set, grade, story, price-history sparkline). Newly unlocked card appears here.
  *Done:* grid scrolls smoothly; detail opens; unlocks reflected. → `feat: collection + card detail`
- **M6 · Streak (timer-based)** (~1.5h) — `StreakTimer` component: current streak count + **live countdown to the next day boundary** (time left to keep the streak). Completing Home's challenge increments it; a mock "missed day" breaks it. Streak state in the mock layer, authoritative logic documented for later backend move.
  *Done:* timer counts down live; completing challenge bumps streak; miss breaks it. → `feat: streak timer`

### Phase 2 — Monetization screen (on mock data)
- **M7 · Streak-freeze buy screen** (~1.5h) — one `ShopFreeze` screen: shows freezes owned (max 2), a **fake store** purchase flow with pending/succeeded/failed/cancelled states, on success adds a freeze in the mock layer. A held freeze auto-consumes on a mock missed day instead of breaking the streak.
  *Done:* buy flow runs through all states; freeze protects a missed day. → `feat: streak freeze buy screen`

### Phase 3 — Backend CRUDs + integration
- **M8 · Backend scaffold + schema** (~1.5h) — in `pullday-be`: layered skeleton (`router/api/models/db`), local Postgres, **inspect real `data.sql`** → finalize `schema.prisma`/`schema.sql` (verify rarity enum), load catalog, seed accounts.
  *Done:* DB up, catalog + seed loaded. → `chore: backend scaffold + schema + seed`
- **M9 · Basic CRUDs** (~2h) — auth (signup/login, JWT, timezone), `GET /cards`(+`:id`), `GET /today` + `POST /today/answer`, `GET /collection`, `GET /streak`, freeze purchase. Streak day-boundary + atomic mutations move here as the authoritative source.
  *Done:* endpoints return correct data; streak logic server-side. → `feat: core CRUD endpoints`
- **M10 · Swap mock → HTTP + LAN run** (~1h) — implement `HttpApiClient`, point app at laptop LAN IP, one-line client swap. Reconcile any shape differences.
  *Done:* app runs fully against the real backend on device. → `feat: wire app to backend`

### Phase 4 — Hardening & hand-in (as time allows)
- **M11 · Native lifecycle pass** (~0.5h) — real iOS: background/kill mid-challenge, incoming call during reveal, airplane-mode retry. Real fixes expected.
  *Done:* each scenario resumes, no data loss. → `fix: lifecycle hardening`
- **M12 · Hand-in** (~0.5h) — README (clone-to-run <10min), DECISIONS.md (cuts + "what counts as a day"), AI.md final pass, 3–5 min demo video incl. app-kill.
  *Done:* fresh-clone verified; deliverables present. → `docs: readme, decisions, ai, demo`

**Stretch / later (named cuts in DECISIONS.md):** win-back + Stripe (real-money path — add after core if time), binder screen, dev menu time-travel, Android, cloud deploy. Core loop (swipe → collection → streak → freeze) ships first and whole.

---

## Seed script (`pullday-be/scripts/seed.ts`, deterministic, one `TODAY` anchor, password `pullday123`)
- `new@` — user only, no streak_state, no cards.
- `today@` — streak 12, `last_completed_day = TODAY-1`, no challenge row for TODAY.
- `done@` — streak 30, `last_completed_day = TODAY`, completed challenge row + reward card in user_cards.
- `freeze@` — streak 7, `last_completed_day = TODAY-2` (one missed day), one `available` freeze. **Seed the raw gap** — let the live `checkAndApplyStreak` consume the freeze on first request (better demo than faking post-state).
- `broken@` — streak 0, `streak_before_break=40`, `broken_at=TODAY-1`, `win_back_deadline=broken_at+48h`.
- `collector@` — 300 user_cards (seeded-RNG sample), 45 binder_slots (5 pages × 9, from those 300).

---

## Local run & device
1. **Local Postgres** (Postgres.app or `brew`/Docker), `.env` with `DATABASE_URL` (local), `STRIPE_SECRET_KEY` (test), `DEV_SECRET`. `prisma migrate dev` then `npm run seed`.
2. **LAN reachability:** backend binds `0.0.0.0`; app points `apiClient` base URL at the laptop's LAN IP (e.g. `http://192.168.x.x:3000`), phone on the same WiFi. Document the "find your IP + edit base URL" step in README.
3. Stripe test keys only; `@stripe/stripe-react-native`. **Webhook caveat with local-only:** Stripe can't reach `localhost` — for the win-back webhook either run the Stripe CLI (`stripe listen --forward-to localhost:3000/stripe/webhook`) during demos, or rely on the `/winback/confirm` server-side re-verify path as primary and treat the webhook as the "when deployed" belt-and-suspenders. Note this in DECISIONS.md.
4. **iOS on real device, no paid Apple account:** free personal-team signing **expires installs after 7 days** → if the check-in is >7 days after last Xcode install, reinstall from source that morning. Budget 15–20 min for signing/bundle-id/team errors — near-certain time-sink, not last-10-minutes work. Record install date in README.
5. **Deferred (not now):** cloud deploy (Railway + Neon) if the live check-in later needs the backend reachable without the laptop/WiFi.

---

## Risks
1. **New Arch + reanimated v4/worklets + gesture-handler linking** → do `pod install --repo-update` + Metro cache clear at hour ~1, not hour 9. Diff against nivo's `ios/Podfile.lock` if versions clash.
2. **`@stripe/stripe-react-native` native linking** (own CocoaPods dep + Info.plist keys) → dedicated slot when win-back is tackled.
3. **Free Apple ID 7-day signing expiry** → most likely "worked yesterday, won't launch now" before the call.
4. **CocoaPods/Xcode version drift** vs RN 0.87 → nivo's `ios/` is the reference.
5. **Rarity enum mismatch** → caught only by the `data.sql` inspection in M8; a 4th value or different casing breaks the swipe→rarity mapping + DB CHECK.

---

## Verification (end-to-end)
- `freeze@` first `GET /streak` auto-consumes the freeze (streak intact).
- `broken@` sees win-back offer; completing Stripe test payment restores streak to 40 via `/winback/confirm`; the webhook path (Stripe CLI forwarding, local) covers the app-killed-mid-3DS case.
- Kill app mid-challenge on a real device → relaunch resumes exact in-progress challenge.
- Dev menu "advance time +1 day" then `GET /streak` reflects a missed day server-side.
- Collection scrolls smoothly through ~2000 cards; rare/holo reveal animation doesn't drop frames on repeated pulls.
- Clone-to-running (README) under 10 minutes from a fresh checkout.

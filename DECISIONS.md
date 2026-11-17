# Decisions

The architecture, scope, and product calls behind this build, in my own words, and why — the "judgment over feature count" the brief asks to see. What got built, in what order, what got cut, and what's known broken. Updated as the build goes — the milestone list in `PLAN_README.md` has the detailed status; `AI.md` has the implementation-level log of what AI got wrong and what I corrected.

## What counts as a day

My design, not yet implemented against a real backend: a day is the calendar date in the user's timezone, computed server-side from a trusted clock — never from whatever time the client happens to send. This is a direct fix for the shipped app's bug #1 (streaks resetting at 11:58pm), which was exactly this kind of client-trusted-time mistake. I'll update this section once the streak logic moves server-side and note any changes from the design.

## Build order

My call: app first, against mock data, in this order — swipe challenge, collection, streak, streak-freeze purchase. Backend CRUDs and the real integration come after the app's core loop works end to end. Reasoning: the swipe UI and the streak/freeze interaction are the riskiest and most visible parts of this app — worth getting right before spending time on a backend that just needs to be correct, not polished.

## Swipe library swap (M4)

I specified `rn-swiper-list` for the swipe challenge in the original plan, instead of hand-rolling gesture code from scratch. On-device testing turned up a real bug in it: after the first swipe, every subsequent card stayed invisible — reproduced repeatedly, not fixed by tuning its prerender setting. I decided to replace it with a small custom component (one active card, one pan gesture, release-threshold direction detection) rather than ship a feature that's broken past card one, and verified the full 8-card flow myself afterward. Worth knowing if anyone revisits this: the library's basic single-swipe case worked fine; it was specifically the multi-card stack advancing past index 0 that broke.

## Cut

My scope calls for the time box:
- Two repos (app + backend) instead of one — the brief asks for a single repo; this is a deliberate dev-convenience tradeoff, with both linked clearly for hand-in.
- No theme system / dark mode — a single flat palette is a constraint I set, not a default, and UI elements still need to read as physically distinct within it (see `AI.md`'s UI guidelines).
- Deferred: binder screen, dev-menu time travel, Android target, cloud deploy, real Stripe win-back. The core loop ships whole before any of these — a deliberate ordering, not an oversight.
- Dropped my usual scaling-helper and copy-centralization conventions — overhead I judged not worth it at this scope. (The container/view split itself was cut at first, then reinstated on my own review — see below.)

## Container/view split — reversed

M2–M4 were built as single flat screen files; AI's reasoning at the time was that the split wasn't worth it for this scope. On review, I overturned that and required the full folder convention I'd originally specified. Retrofitted: each screen is now a folder (`index.ts`, `<screen>.container.tsx`, `<screen>.view.tsx`, `type.ts`, `styles.ts`, `utils/use<Thing>Query.ts`). Worth owning plainly: the first call was wrong, not a style difference — this project's codebase convention requires this split consistently, and enforcing that was the actual ask.

## Hooks pattern

I corrected this twice before AI's implementation matched the convention I require. First pass: a shared generic `useFetch` wrapper — I rejected it, since my hooks convention doesn't abstract that far. Second pass: each hook managed its own `data`/`error`/`isLoading` state but still auto-fetched itself via an internal `useEffect` on mount — also not the contract I specified. I gave the exact final shape directly: the hook owns the state and exposes one named action (`fetchHomeData`, `fetchOwnedCards`, `fetchServerDate` — named after what it fetches, not a generic `refetch`), but never calls it itself. The container (or the component, for shared pieces like `AppHeader`) decides when to call it, in its own `useEffect` on mount. The container is also where `error` gets checked (today a stub, later a real popup), not the hook. See `PLAN_README.md`'s "query-hook contract" for the exact shape I require everywhere in this codebase.

## Real data, not generated fixtures

My call to source the assignment's actual `data.sql` (I located and provided the link) and have it parsed to JSON (`data-source/parse_cards.py`) instead of continuing with generated placeholder cards. The app runs against the real ~1,993-card catalog (real names, sets, PSA grades, CloudFront image URLs) from the first swipe onward, not just once a backend exists. This also resolved the earlier "schema unknown until M8" blocker early — see `PLAN_README.md` for the confirmed column list and rarity values.

## Fake store for the streak-freeze purchase

My call to simulate the purchase client-side (`src/services/fakeStore.ts`: an artificial delay plus an 80/20 succeed/fail split) rather than integrate a real IAP SDK during the mock-data phase — this app never touches App Store Connect or Google Play Billing, and doesn't need to yet, since the point of M7 is proving the state machine (pending/succeeded/failed/cancelled, freeze count capped at 2) works end to end. A real IAP integration is deferred to whenever this app actually ships to a store.

## Known broken

Nothing currently known broken. A card-gesture/tab-bar touch conflict (swiping could accidentally fire when tapping near the bottom tab bar) was found during my own post-M4 review and fixed — see `PLAN_README.md`'s "Post-M4 fix pass".

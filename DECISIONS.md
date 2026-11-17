# Decisions

What got built, in what order, what got cut, and what's known broken. Updated as the build goes — the milestone list in PLAN_README.md has the detailed status.

## What counts as a day

Not implemented yet. Working design: a day is the calendar date in the user's timezone, computed server-side from a trusted clock, never from whatever time the client happens to send. Will update this section once the streak logic actually exists and note any changes from the design.

## Build order

App first, against mock data, in this order: swipe challenge, collection, streak, streak-freeze purchase. Backend CRUDs and the real integration come after the app's core loop works end to end. Reasoning: the swipe UI and the streak/freeze interaction are the riskiest and most visible parts — worth getting right before spending time on a backend that just needs to be correct, not polished.

## Swipe library swap (M4)

Planned to use `rn-swiper-list` for the swipe challenge instead of hand-rolling gesture code. On-device testing found a real bug: after the first swipe, every subsequent card stayed invisible — reproduced repeatedly, not fixed by tuning its prerender setting. Replaced it with a small custom component (one active card, one pan gesture, release-threshold direction detection) rather than ship a feature that's broken past card one. Verified the full 8-card flow afterward. Worth knowing if anyone revisits this: the library's basic single-swipe case worked fine; it was specifically the multi-card stack advancing past index 0 that broke.

## Cut

- Two repos (app + backend) instead of one — brief asks for a single repo, this is a dev-convenience tradeoff, both linked for hand-in.
- No theme system / dark mode.
- Deferred: binder screen, dev-menu time travel, Android target, cloud deploy, real Stripe win-back. Core loop ships whole before any of these.
- Dropped nivo's scaling helpers and copy-centralization convention — overhead not worth it at this scope. (The container/view split itself was cut at first, then reinstated on review — see below.)

## Container/view split — reversed

M2–M4 were built as single flat screen files, reasoning the split wasn't worth it for this scope. On review, asked to follow nivo's convention as given. Retrofitted: each screen is now a folder (`index.ts`, `<screen>.container.tsx`, `<screen>.view.tsx`, `type.ts`, `styles.ts`, `utils/use<Thing>Query.ts`). Worth owning plainly: the first call was wrong, not a style difference — nivo's own codebase uses this split consistently, and matching it was the actual ask.

## Hooks pattern

Corrected twice before landing on the real convention. First pass: a shared generic `useFetch` wrapper — rejected, nivo's own hooks don't abstract that far. Second pass: each hook managed its own `data`/`error`/`isLoading` state but still auto-fetched itself via an internal `useEffect` on mount — also not what was wanted. Final shape: the hook owns the state and exposes one named action (`fetchHomeData`, `fetchOwnedCards`, `fetchServerDate` — named after what it fetches, not a generic `refetch`), but never calls it itself. The container (or the component, for shared pieces like `AppHeader`) decides when to call it, in its own `useEffect` on mount. The container is also where `error` gets checked (today a stub, later a real popup), not the hook. See PLAN_README.md's "query-hook contract" for the exact shape.

## Real data, not generated fixtures

Obtained the assignment's actual `data.sql` (link provided directly) and parsed it to JSON (`data-source/parse_cards.py`) instead of continuing with generated placeholder cards. The app runs against the real ~1,993-card catalog (real names, sets, PSA grades, CloudFront image URLs) from the first swipe onward, not just once a backend exists. This also resolved the earlier "schema unknown until M8" blocker early — see PLAN_README.md for the confirmed column list and rarity values.

## Known broken

Nothing currently known broken. A card-gesture/tab-bar touch conflict (swiping could accidentally fire when tapping near the bottom tab bar) was found and fixed during the post-M4 review — see PLAN_README.md's "Post-M4 fix pass".

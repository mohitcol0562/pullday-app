# Decisions

What got built, in what order, what got cut, and what's known broken. Updated as the build goes — the milestone list in PLAN_README.md has the detailed status.

## What counts as a day

Not implemented yet. Working design: a day is the calendar date in the user's timezone, computed server-side from a trusted clock, never from whatever time the client happens to send. Will update this section once the streak logic actually exists and note any changes from the design.

## Build order

App first, against mock data, in this order: swipe challenge, collection, streak, streak-freeze purchase. Backend CRUDs and the real integration come after the app's core loop works end to end. Reasoning: the swipe UI and the streak/freeze interaction are the riskiest and most visible parts — worth getting right before spending time on a backend that just needs to be correct, not polished.

## Cut

- Two repos (app + backend) instead of one — brief asks for a single repo, this is a dev-convenience tradeoff, both linked for hand-in.
- No theme system / dark mode.
- Deferred: binder screen, dev-menu time travel, Android target, cloud deploy, real Stripe win-back. Core loop ships whole before any of these.
- Dropped nivo's container/view screen split, scaling helpers, and copy-centralization convention — overhead not worth it at this scope.

## Known broken

Nothing built yet.

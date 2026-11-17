# AI usage

Logged as the build goes.

## M0 — plan + docs

Used Claude to read the assignment brief, look at an existing RN project for architecture reference, and draft the build plan now in PLAN_README.md — data model, streak/freeze state machine, screen breakdown, milestone order, plus the mockups used to sanity-check the UI before coding.

First draft got a lot wrong: assumed Expo, one monorepo, cloud deploy, backend-first build order, and carried over a theme system from the reference project. All of that got corrected — bare RN CLI, two repos, local-only backend for now, app-first against mock data with core features before monetization, no theme system.

Kept: the data model and streak-state-machine design, the Zustand/ApiClient patterns borrowed from the reference project. Discarded: the original backend-first plan and the Expo/cloud assumptions.

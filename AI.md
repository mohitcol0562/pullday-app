# AI usage

Logged as the build goes.

## M0 — plan + docs

Used Claude to read the assignment brief, look at an existing RN project for architecture reference, and draft the build plan now in PLAN_README.md — data model, streak/freeze state machine, screen breakdown, milestone order, plus the mockups used to sanity-check the UI before coding.

First draft got a lot wrong: assumed Expo, one monorepo, cloud deploy, backend-first build order, and carried over a theme system from the reference project. All of that got corrected — bare RN CLI, two repos, local-only backend for now, app-first against mock data with core features before monetization, no theme system.

Kept: the data model and streak-state-machine design, the Zustand/ApiClient patterns borrowed from the reference project. Discarded: the original backend-first plan and the Expo/cloud assumptions.

## M1 — scaffold + native linking

Scaffolded with the React Native community CLI at RN 0.87.0, then matched nivo's exact dependency versions by hand in package.json. Caret ranges on react-native-reanimated/react-native-worklets pulled in a mismatched pair (reanimated 4.7.x wants worklets 0.13.x); pinned both to the exact versions nivo's lockfile resolved to instead.

Hit a real native issue on first simulator run: the stock RN template's AppDelegate creates its own UIWindow directly, but the Xcode 27.2 / iOS 26 SDK this machine builds against requires the UIScene app lifecycle — the app failed to launch with "UIScene life cycle is required for apps built with this SDK." Fixed by adding UIApplicationSceneManifest to Info.plist and writing a SceneDelegate.swift that hosts the window instead, and had to register that new file by hand in the Xcode project since this project doesn't use Xcode's synchronized-folder groups. Worth remembering this will likely apply on the real device build too.

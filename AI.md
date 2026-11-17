# AI usage

Logged as the build goes.

## M0 — plan + docs

Used Claude to read the assignment brief, look at an existing RN project for architecture reference, and draft the build plan now in PLAN_README.md — data model, streak/freeze state machine, screen breakdown, milestone order, plus the mockups used to sanity-check the UI before coding.

First draft got a lot wrong: assumed Expo, one monorepo, cloud deploy, backend-first build order, and carried over a theme system from the reference project. All of that got corrected — bare RN CLI, two repos, local-only backend for now, app-first against mock data with core features before monetization, no theme system.

Kept: the data model and streak-state-machine design, the Zustand/ApiClient patterns borrowed from the reference project. Discarded: the original backend-first plan and the Expo/cloud assumptions.

## M1 — scaffold + native linking

Scaffolded with the React Native community CLI at RN 0.87.0, then matched nivo's exact dependency versions by hand in package.json. Caret ranges on react-native-reanimated/react-native-worklets pulled in a mismatched pair (reanimated 4.7.x wants worklets 0.13.x); pinned both to the exact versions nivo's lockfile resolved to instead.

Hit a real native issue on first simulator run: the stock RN template's AppDelegate creates its own UIWindow directly, but the Xcode 27.2 / iOS 26 SDK this machine builds against requires the UIScene app lifecycle — the app failed to launch with "UIScene life cycle is required for apps built with this SDK." Fixed by adding UIApplicationSceneManifest to Info.plist and writing a SceneDelegate.swift that hosts the window instead, and had to register that new file by hand in the Xcode project since this project doesn't use Xcode's synchronized-folder groups. Worth remembering this will likely apply on the real device build too.

## M2 — mock layer + navigation shell

Pinning typescript to nivo's exact 5.0.4 (done in M1 to match the reference project) turned out to be wrong: @react-native/typescript-config@0.87.0 references the `es2024.promise` lib, which doesn't exist before TypeScript 5.5-ish, so `tsc --noEmit` failed outright with every JSX element reported as invalid — a confusing error that had nothing to do with the actual navigation/store code being added. nivo likely has this same latent breakage and never notices because its scripts never run `tsc` directly. Fixed by using the RN CLI scaffold's own typescript version (^6.0.3) instead of copying nivo's pin — matching the reference project isn't automatically correct when the reference project itself doesn't exercise the thing being matched.

Also hit a Cocoapods deployment-target conflict after adding @react-native-async-storage/async-storage: its resource-bundle target ships `IPHONEOS_DEPLOYMENT_TARGET = 13.0`, below the 15.0+ range this Xcode/SDK combo allows, so the build failed before even reaching app code. RN's own `react_native_post_install` helper doesn't touch resource-bundle targets, so added an explicit loop in the Podfile's `post_install` to bump any pod target below `min_ios_version_supported` up to it.

Wrote the mock API layer, Zustand store, navigation shell, and three placeholder screens (Login/Home/Collection) directly rather than asking AI to design them from scratch, since the shapes were already decided in the plan — AI's role here was mostly typing speed and catching the two environment issues above. Verified the whole login → tabs → mock-data loop on the iOS Simulator by hand (tap coordinates had to be found empirically — the simulator control tool's points-to-pixel scaling was easy to get wrong by eye, and a few taps landed on the wrong element before the right coordinates were found).

# Wayfare — Login and Set Locations

React Native + Expo SDK 58, TypeScript and Expo Router. Login (including local demo registration) and Set Locations are implemented. Trip Ready is navigation scaffolding only; Route View is not implemented yet.

## Run

```bash
npm ci
npx expo start
```

Open the app in an SDK-compatible Expo Go/development build or an emulator. For a browser preview, use `npx expo start --web`. If another project occupies the default port, append `--port 8084`. Expo Location is bundled in compatible Expo Go versions; rebuild any existing custom development build after adding the native module/config plugin.

## Demo behavior and manual checks

Use test data only: `demo@example.com` and `demo1234` work. Authentication makes no network requests. Any valid email and a password with at least eight characters are accepted, except `fail@example.com`, which deliberately simulates a request failure. Whitespace-only passwords are rejected. Email whitespace is trimmed; passwords are not trimmed or stored.

1. Submit empty fields: both required messages appear and the first invalid field receives focus.
2. Try an invalid email and a short password: inline errors appear; correct them and submit again.
3. Toggle the eye button: password visibility changes without clearing its value.
4. Submit valid demo values: a short loading indicator appears, actions are disabled, then Set Locations opens with a fresh trip. Its back button clears the session/trip and returns to Login.
5. Try `fail@example.com`: a recoverable inline request error appears; editing a field clears it.
6. Choose Create an account: the same form switches to demo registration. A duplicate registration during the same app run produces an account-exists error. Log in still accepts valid demo values. Registration and sessions reset when the app reloads.
7. Choose Forgot password: local help explains the demo behavior; no reset email is sent.
8. On a small device, open the keyboard, use Next to focus Password, and Go to submit. Scroll to reach the footer when space is limited. Check both Android and iOS keyboard/safe-area behavior on a device before submission.

## Set Locations checks

1. Log in using the demo values above. Confirm Next is disabled with no selections.
2. Choose Home for pickup; the active field advances to drop-off. Choosing Home again shows a duplicate-location error and keeps Next disabled.
3. Search for `marina` in Drop-off and select Marina Office Tower. Search also matches address text such as `Zone 61`. Typing alone does not commit a location or enable Next.
4. Search an unmatched name to see the empty state. Clear a field to restore suggestions. Editing a previously selected field clears that committed selection and disables Next until a result is chosen.
5. Use the swap control to exchange the committed locations. With two distinct selections, Next opens the Trip Ready placeholder. Edit locations returns with the pair preserved.
6. Select the desired field, then Use current. Foreground permission is requested only on that action. Allow access to populate that field with actual coordinates; no reverse-geocoding service is used. Deny access to see guidance while manual selection remains available. For a permanent native denial, Open settings is provided. Browser denial is recovered through the browser's site settings.
7. Test location services switched off, unavailable GPS, and retry after an error. Position acquisition has a 15-second timeout. Switching fields or choosing a suggestion ignores any late location result.
8. At 320px width, scroll the middle content to reach all suggestions. Header and Next stay visible; the keyboard-avoiding layout keeps the action above the native keyboard. Native keyboard/permission prompts still need Android and iOS device smoke tests.

Suggested/recent names and addresses match Figma except the airport subtitle, which is added demo copy. Their coordinates are approximate fixtures. Search is local, not a live places API; unmatched arbitrary addresses cannot be committed. Current location uses real Expo Location coordinates kept only in memory. Pick on map opens an explanatory demo notice; map picking is deferred. Trip Ready only verifies navigation/shared selections, with no route calculation or designed Trip Ready UI.

## Structure and decisions

- `src/app/index.tsx`: Login presentation, input refs and local feedback visibility.
- `src/app/_layout.tsx`: Nunito Sans font loading, splash lifecycle, safe areas, session/trip providers and hidden navigation header.
- `src/app/set-locations.tsx`: location selection, search, errors, permission recovery and continuation.
- `src/app/trip-ready.tsx`: minimal navigation placeholder with guards for missing session/trip.
- `src/components/`: shared field, primary button, feedback modal and React Native SVG icon components converted from the exported Figma artwork.
- `src/components/AppText.tsx`: typed typography/color variants using the existing design tokens, with native text props and style overrides.
- `src/components/layout/`: screen safe areas/keyboard avoidance, scroll behavior, centered content widths and shared footer spacing.
- `src/features/auth/`: Zod validation, the `useLoginForm` hook and a deliberately simple in-memory mock service. No credentials, tokens or passwords are persisted.
- `src/context/SessionContext.tsx`: email-only demo session.
- `src/context/TripContext.tsx`: separate contexts for committed origin/destination and stable update actions. Use `useTrip()` to read locations and `useTripActions()` to select, swap or reset them.
- `src/features/trip/`: typed trip model/reducer, mock suggestions, Expo Location adapter/hook, reusable location pair and row components. Shared state rejects duplicate IDs or coordinates within approximately a metre; it resets on a new login and is not persisted.
- `src/theme/tokens.ts`: inspected Figma colors/type styles; error, focus and modal states are documented implementation additions.
- `docs/design-specification.md`: design audit. Original Figma exports and text inventory live under `docs/figma/`.

The layout retains Figma's 24px horizontal inset, 56px logo tile, 54px fields, 56px primary action and 16px control radii. A scrolling flex layout places the footer at the bottom when there is room; it remains reachable with the keyboard or on short screens. Native system status bars replace the design's phone mockup. All UI uses React Native StyleSheet; no UI kit or SVG transformer is used.

React Hook Form 7, Zod 4 and resolver 5 are used together. Resolver 6 encountered an upstream optional-peer conflict during installation; version 5 is pinned to the compatible major rather than forcing the dependency tree. Expo resolved `react-native-svg` to its SDK-compatible version.

## Shared layout and typography

Use `AppText` for app copy. `variant` accepts the typography keys from `src/theme/tokens.ts` (for example `hero`, `screenTitle`, `body`, `label`, `small`, `link`, `caption`, `dialogTitle`); `color` accepts a color token and defaults to `text`. Native props such as `nativeID`, `accessibilityRole`, `numberOfLines` and `allowFontScaling` pass through. Font scaling stays enabled by default. Local styles override the variant when a design exception is needed. TextInput typography continues to use tokens directly. The root font-loading failure message deliberately uses system text because custom fonts may be unavailable.

```tsx
<AppText variant="screenTitle" accessibilityRole="header">Where are you going?</AppText>
<AppText variant="small" color="muted">Choose a pickup and drop-off.</AppText>
```

- `Screen` provides the background and top/left/right safe areas. Set `keyboardAvoiding` for forms. Screens without a footer can include the bottom edge through `edges`.
- `ContentContainer` centers content with a responsive full width capped at 440px; Login uses its existing 432px cap. Padding and spacing stay with the screen.
- `ScreenScrollView` provides flex/scroll defaults and keyboard tap/dismiss behavior. It accepts native ScrollView props and style overrides.
- `ScreenFooter` provides the surface, border, centered content, horizontal inset and bottom padding of `max(safeArea.bottom, 28)`. Place it inside the scroll view for Login's scrolling footer or outside for Set Locations' fixed footer. Avoid also applying the bottom safe-area edge to those screens.

```tsx
<Screen keyboardAvoiding>
  <ScreenScrollView>
    <ContentContainer>{/* Screen content */}</ContentContainer>
  </ScreenScrollView>
  <ScreenFooter>
    <PrimaryButton label="Next" onPress={continueTrip} />
  </ScreenFooter>
</Screen>
```

These components contain presentation only; validation, session/trip state and navigation remain in their existing screens/hooks. See React Native's [custom text guidance](https://reactnative.dev/docs/text#limited-style-inheritance) and Expo's [SDK 58 safe-area API](https://docs.expo.dev/versions/v58.0.0/sdk/safe-area-context/).

## Checks

```bash
npx expo lint
npx tsc --noEmit
npm test
```

The dependency-free Node test runner covers authentication validation and trip-state/search rules. Tests require Node 22.18+ or Node 24 (verified on 24.18). Node may print a module-type inference warning when importing application TypeScript; this does not affect the checks. These pure-logic tests do not replace native UI/permission tests.

## React and React Native practices

- Committed places have one source of truth in Context. Search drafts stay local; input labels, filtered results and trip readiness are derived during rendering. This follows React's guidance on [state structure](https://react.dev/learn/choosing-the-state-structure) and [avoiding unnecessary effects](https://react.dev/learn/you-might-not-need-an-effect).
- The trip reducer updates state immutably and preserves the previous object for unchanged selections, empty swaps and empty resets. Typing into an already uncommitted field does not broadcast a new trip state.
- Location loading/error/idle status uses a discriminated union to prevent contradictory flags. Request generations ignore results after cancellation/unmount; the actual one-shot Expo request remains uncancellable. Permissions are requested only after a user action, using the [SDK 58 Location API](https://docs.expo.dev/versions/v58.0.0/sdk/location/).
- Inputs connect their visible labels through `aria-labelledby` with `accessibilityLabel` as a platform fallback. Password visibility uses an action label and disabled state, rather than an unrelated checkbox state. Small icon actions use expanded [Pressable touch areas](https://reactnative.dev/docs/pressable#hitslop); touch areas are still bounded by their parents. See [React Native accessibility guidance](https://reactnative.dev/docs/accessibility).
- Feedback dialogs have bounded, scrollable content so their action remains reachable when screen height is limited or fonts grow. Safe areas, keyboard avoidance and font scaling remain enabled.
- The five mock suggestions stay in a ScrollView. [React Native recommends virtualized lists for long collections](https://reactnative.dev/docs/scrollview); adding FlatList for this short fixed list would not address a measured problem. React Compiler is already enabled; no blanket memoization or additional state/UI libraries were added.

### Callback and lifecycle review

- Login validation/submission/mode handlers live in `useLoginForm`. Its handlers are ordinary functions; password/mode toggles use functional state updates. Extraction makes the screen easier to read; it does not by itself prevent rendering or function creation.
- Missing hook dependencies fail lint instead of only producing a warning, helping catch stale closures in later changes.
- Trip actions have a Context value independent of trip state. React Compiler caches its object and dispatch-based functions; the generated Expo Babel output was checked after removing manual `useMemo`. Login consumes only those actions, so changing locations does not notify Login through trip-state Context in the compiled client. Readers still receive every relevant location update. This follows React's [separate state/dispatch contexts](https://react.dev/learn/scaling-up-with-reducer-and-context) pattern.
- Location `request`/`cancel` are ordinary functions; their consumers do not require fixed callback identity for correctness. The screen consumes those callbacks directly instead of capturing the entire hook result. Cancelling while already idle reuses the idle state object. A synchronous guard prevents a second request before the disabled button renders.
- Login has the same synchronous submission guard. Leaving Login aborts its mock timer and suppresses session, error and navigation updates from that request; cancellation also prevents registering an account. A mounted check covers validation finishing after unmount. The mock service removes its abort listener after settlement.
- Location rows receive one selection callback plus their location data; the row binds its own item on press. Stable IDs remain the list keys. Screen handlers keep their current state dependencies, so cached callbacks do not freeze old selections.
- Manual `useCallback`/`useMemo` wrappers were removed: no callback here needs stable identity for an Effect subscription or another correctness requirement, and no measured rendering issue justifies extra wrappers. [React's useCallback guidance](https://react.dev/reference/react/useCallback) recommends selective memoization; [Expo React Compiler](https://docs.expo.dev/guides/react-compiler/) handles eligible code. The local Expo Babel preset produced compiler-runtime memoization for the screens and trip-actions object during verification. The auth/location hooks are not automatically memoized in that check; their ordinary functions remain correct. This is not a profiling claim or a guarantee that every function is memoized. Revisit manual memoization only if profiling identifies a concrete benefit.

Regression coverage includes validation, search/trip invariants, auth success/failure/duplicate registration, and cancellation before, during and immediately after the mock delay. Native GPS/keyboard behavior and render timings still require device testing/profiling. No new dependency or screen was introduced by this review.

Verified: lint/typecheck, browser selection/search/swap/navigation checks and current-location success, 420 × 845 and 320 × 568 responsive layouts, trip-state invariants, permission/GPS/timeout adapter branches with mocked Expo responses, original SVG path preservation, and Android JavaScript/asset export. No APK or native device runtime verification has been performed for this step.

---

The original Expo starter notes follow for reference.

# Expo starter

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

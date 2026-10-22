# Wayfare

A trip-planning app built for the Codenzic Innovations React Native assignment, using [the provided Figma design](https://www.figma.com/design/fVtFLgOH147WiRTpSGxVqz/React-Native-Assignment?node-id=0-1).

Login and location selection are working. Trip Ready is currently a placeholder to check navigation and shared trip data. The route map and navigation screen are still to be built.

## Run locally

Use Node.js and npm. The project has been checked with Node 24.18; the tests need Node 22.18 or newer.

```bash
npm ci
npm start
```

Open the app in an Expo Go version compatible with SDK 58, or use a development build. You can also run it in an Android emulator or iOS simulator.

For a browser preview:

```bash
npm run web
```

If the default port is busy, use `npx expo start --port 8084`.

## Demo login

Use these details to try the app:

```text
Email: demo@example.com
Password: demo1234
```

Authentication is mocked. Any valid email and a password of at least eight characters will work. Use test details rather than real credentials. Nothing is sent to a server, and passwords are not stored.

A few things to try:

- Submit an empty form or an invalid email to see the validation messages.
- Use `fail@example.com` to see a failed login request.
- Choose **Create an account** to switch to demo registration. Registering the same email twice shows an error.
- Choose **Forgot password?** for an explanation of how demo login works. No reset email is sent.

Demo accounts, the session, and selected locations are kept in memory and reset when the app reloads.

## Choose a trip

After logging in, select a pickup from the suggestions, then choose a different drop-off. You can search by name or address, clear a selection, or swap the two places.

For example, choose **Home**, search for **marina**, and select **Marina Office Tower**. **Next** becomes available once both locations are selected. It opens the Trip Ready placeholder; **Edit locations** takes you back with your selections intact.

Typing into a field only searches the suggestions. You need to select a result before continuing. Editing an existing selection clears it, and the same place cannot be used for both ends of the trip.

**Use current** requests location permission and fills the active field with the device's coordinates. If permission is denied or GPS is unavailable, an error is shown and you can still select a place manually. Location access is only requested when this button is pressed.

The suggested places and their coordinates are mock data. Search does not use a live places service, current coordinates are not converted to a street address, and **Pick on map** currently opens a notice rather than a map picker.

## Project layout

```text
src/
  app/             Routes and screen layouts
  components/      Shared controls, text, layout components, and SVG icons
  context/         Session and trip state
  features/
    auth/          Login form logic, validation, and mock authentication
    trip/          Location data, selection rules, and device location handling
  theme/           Colors, fonts, and typography tokens
assets/            Fonts, icons, and design assets
tests/             Authentication and trip logic tests
```

## Implementation notes

The app uses Expo SDK 58, TypeScript, and Expo Router. Styling is done with React Native StyleSheet. React Hook Form and Zod handle login validation; Context and hooks hold the session and selected trip.

Shared components include `AppText`, form fields, buttons, feedback dialogs, and screen layout components. Colors and text styles come from the design tokens. The app uses Nunito Sans and React Native SVG icons converted from the Figma artwork.

Search text stays local to the screen, while selected locations live in trip Context. Trip state and update actions use separate contexts. React Compiler is enabled, so there are no manual `useCallback` or `useMemo` wrappers at the moment.

Pending login requests are cancelled when Login closes. Location results are ignored if the user changes their selection before the request finishes. The layouts include safe areas, keyboard avoidance, and scrolling for smaller screens.

## Checks

```bash
npm run lint
npm run typecheck
npm test
```

The 11 tests cover form validation, mock authentication, cancelled requests, duplicate locations, search, swapping, and clearing selections. They use Node's built-in test runner. Node may print a module-type warning when loading the TypeScript files; the tests still run.

Browser checks have covered login, location selection, search, swapping, and navigation, including layouts at 420 × 845 and 320 × 568. An Android JavaScript/assets export has also passed. These checks do not replace testing on a phone.

## Still to finish

- Build the Trip Ready and Route View screens from Figma.
- Add the route map, travel details, and start-navigation action.
- Test native keyboard behavior and location permissions on Android and iOS.
- Generate and test the Android APK. No APK is included yet, and EAS build configuration has not been added.

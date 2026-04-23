# Maestro E2E (Android)

Prerequisites: [Maestro CLI](https://maestro.mobile.dev/), Android emulator or device, app installed (`com.tico77.rnapp`).

1. Start Metro and install a dev build, or install a **release** APK (bundled JS) for CI-like runs without Metro.
2. From the repo root:

```bash
npm run e2e:android
npm run e2e:android:flows
```

Flows live under `.maestro/smoke` (fast regression) and `.maestro/flows` (user journeys).

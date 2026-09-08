# SnowSafe

A mobile-first post-crash concussion triage assistant for skiers and snowboarders, built with React Native and Expo.

After a head impact on the mountain, SnowSafe walks you through a short symptom checklist and gives a clear recommendation — get emergency help now, seek medical evaluation soon, or rest and monitor — then keeps a log of past checks so you can track recovery over time.

---

## ⚠️ Medical disclaimer

**SnowSafe is a decision support tool, not a medical diagnosis. It does not replace professional medical evaluation. Always consult a medical professional.**

The triage questionnaire and its scoring rules are a **reasonable starting point, not a clinically validated protocol.** They are loosely informed by the general structure of public-facing concussion guidance, but they have not been reviewed, validated, or endorsed by any medical body or clinician.

**If you are dealing with a suspected head or spine injury, contact ski patrol or emergency services.** Do not rely on this app to rule out a serious injury.

---

## Features

- **Triage questionnaire** — a 10-question symptom checklist covering concussion red flags (loss of consciousness, vomiting, seizure, neck/spine symptoms, headache severity, confusion, speech, dizziness, pupils/fluid).
- **Rule-based recommendation** — answers are scored to one of three tiers (`EMERGENCY`, `SEEK_CARE`, `MONITOR`) using max-severity aggregation, with the specific triggering answers shown as reasons.
- **Recovery log** — every completed triage is saved on-device, browsable by date and tier, with editable notes per entry.
- **Emergency contacts** — quick tap-to-call access to emergency services and ski patrol.
- **Built for the mountain** — large glove-friendly tap targets, high-contrast dark navy theme, and haptic feedback on emergency results.

All data is stored **locally on the device** via AsyncStorage. Nothing is uploaded, and there is no backend or analytics.

## Tech stack

- [Expo](https://expo.dev) (SDK 54) with [Expo Router](https://docs.expo.dev/router/introduction) for file-based routing
- React Native 0.81 + TypeScript
- AsyncStorage for local persistence
- Jest (`jest-expo`) for unit tests

## Getting started

```bash
npm install
```

```bash
npx expo start
```

Then open the project in [Expo Go](https://expo.dev/go) by scanning the QR code, or press `i` / `a` / `w` for an iOS simulator, Android emulator, or the browser.

## Testing

```bash
npm test
```

Unit tests cover the triage scoring logic in `lib/triageLogic.ts` — tier thresholds, multi-answer max-severity aggregation, and handling of unknown question/option ids.

## Project structure

```
app/                    # Expo Router routes
  index.tsx             # Home screen
  triage/index.tsx      # Triage questionnaire wizard
  results.tsx           # Scored recommendation for one session
  log/index.tsx         # Recovery log list
  log/[id].tsx          # Recovery log entry detail
  contacts.tsx          # Emergency contacts
components/             # Shared UI (Button, ScreenContainer, TriageSessionSummary)
constants/colors.ts     # Colour tokens
lib/
  triageQuestions.ts    # Question set and per-option severity tiers
  triageLogic.ts        # Pure scoring function
  storage.ts            # AsyncStorage repository for triage sessions
  tierInfo.ts           # Per-tier labels, copy, and colours
  contacts.ts           # Emergency contact entries
```

## Configuring for your resort

The emergency contacts in `lib/contacts.ts` ship with `911` as a placeholder for both entries. Update the ski patrol number to your local resort's dispatch line before relying on it.

## Licence

No licence has been chosen yet — all rights reserved by default. If you intend for others to use or contribute to this code, add a `LICENSE` file.

# FitHero Kids — Product Spec for Recreation

This document lets you recreate **FitHero Kids** (the full product) from scratch or in another environment (e.g. with Gemini). It includes a Product Requirements Document (PRD), Technical Design Document (TDD), and everything needed to rebuild without the codebase or a domain.

---

# Part 1: Product Requirements Document (PRD)

## 1.1 Product Overview

**Product name:** FitHero Kids  
**Tagline:** Move • Play • Grow!  
**One-liner:** A gamified exercise app for kids that uses camera-based challenges, a customizable hero, diamonds/stars, and weekly goals to motivate movement.

**Target users:** Kids (primary) and parents (set weekly goals, see progress).  
**Platform:** Web app (responsive; camera required for challenges). Runs in browser; no app store required. Can be shared via URL (e.g. Vercel) without buying a domain.

---

## 1.2 Core Goals

1. **Motivate exercise** through short, fun challenges (e.g. 15–60 seconds).
2. **Give clear progression** via stars (0–3 per challenge), diamonds (rewards), and unlocked challenges.
3. **Support customization** so kids can personalize a hero and face icon (some free, some paid in diamonds or subscription).
4. **Let parents engage** via weekly star goals and optional notifications.
5. **Keep it simple to share** — single URL, no install; optional admin panel for operators.

---

## 1.3 User Personas & Flows

### Kid (primary)

- **Flow:** Open app → See hero + weekly goal → Choose challenge → Read instructions → Do challenge (camera on) → Get stars & diamonds → Unlock next challenges → Spend diamonds on hero/face customization.
- **Needs:** Simple UI, immediate feedback (stars, sounds, confetti), clear rules (e.g. “Hit 50% of targets”), optional tap/click for Fruit Ninja if pose is laggy.

### Parent

- **Flow:** Set weekly goal (e.g. 25 stars) and gift description → Optionally set notification (email/WhatsApp/message) → Kid plays; parent sees progress or gets notified when goal is met.
- **Note:** Weekly goal is set in-app by kid/parent; it is **not** configured in the admin panel.

### Operator (optional)

- **Flow:** Open `/admin` → Configure challenge order, duration per challenge, min stars to unlock next challenge, subscription price (USD), support email, initial diamonds → Save. Optionally clear progress or toggle “has subscription” for testing.

---

## 1.4 Feature List (Detailed)

### Challenges

- **Types:**
  - **Video-based (record then verify):** Jumping Jacks, Squats, Dance, High Knees, Push-ups, Plank (and any other non–real-time types). Flow: Instructions → Record with camera → Submit → “Verifier” assigns stars from performance (e.g. motion/pose) → Result screen.
  - **Real-time camera (pose):** Boxing (punch targets), Fruit Ninja (slice falling fruits with hands or tap/click).
- **Progression:** Ordered list (e.g. 1–8). First challenge always unlocked. Next challenge unlocks when the previous one has ≥ N stars (N configurable per challenge in admin; default 2).
- **Scoring:**
  - **Stars:** 0–3. Thresholds: 1 star ≥ 50%, 2 stars ≥ 70%, 3 stars ≥ 90% (compliance or score). Fruit Ninja: at least 1 slice = 1 star; then 50/70/90% for 1/2/3.
  - **Diamonds (coins):** 20 per star (e.g. 20 / 40 / 60 for 1 / 2 / 3 stars). Configurable base in code.
- **Duration:** Per challenge, in seconds (e.g. 5–60). Set in admin.
- **Subscription gate:** First 4 challenges free; 5th onward can require subscription (configurable; admin can toggle “has subscription” for testing).

### Hero & Economy

- **Hero:** Level, XP, health, strength, total diamonds. Diamonds earned from challenges; spent in customization.
- **Initial diamonds:** Configurable in admin (e.g. 0).
- **Decay:** If kid doesn’t exercise for 48+ hours, hero stats can decay (retention mechanic).
- **Customization (character):** Skin, outfit, accessories (cape, crown, belt, etc.). First 5 options per category free or diamond-paid; rest can require subscription. Items once bought are owned forever.
- **Customization (face icon):** Eyes, mouth, accessory, background. Same rule: first 5 per category free/diamonds; rest subscription. Used in header and sharing.

### Weekly Goal

- **Fields:** Stars required (e.g. 25), gift description (e.g. “a special treat”), notification method (email / WhatsApp / push / message), optional contact (email or phone).
- **Storage:** Local only (e.g. localStorage). Resets by week (e.g. Monday).
- **When goal is met:** Mark completed; optionally send notification (e.g. Resend for email) or show in-app message.

### Subscription (simplified for “share without domain”)

- **Model:** In-app “subscription” flag (e.g. localStorage). No real payments required for recreation.
- **Admin:** Monthly price in USD (e.g. 4.99) and “Toggle subscription” for testing.
- **Gates:** Locked challenges (beyond first 4), locked customization beyond first 5 per category. Modal explains and shows price; “Subscribe” can just set the flag for demo.

### Support

- **Contact support:** Footer button opens a form (first name, last name, email, description). Submit opens `mailto:` to a configurable support email (admin). No backend required for recreation.

### Admin Panel (`/admin`)

- **Config (persisted in localStorage):**
  - Challenge order (list of challenge IDs).
  - Duration (seconds) per challenge ID.
  - Initial coins (diamonds) for new players.
  - Per-challenge: “Min stars to unlock” (0–3) for the *next* challenge.
  - Subscription monthly price (USD).
  - Support email (for Contact support).
- **Actions:** Save config, Reset to defaults (from challenge list), Clear game progress (reset hero + progress for testing), Toggle subscription (for testing).

### Sharing & Analytics

- **Share:** Button to share app URL or a card (e.g. OG image with hero/face). Optional: `html-to-image` for card.
- **Analytics:** Optional event tracking (e.g. `challenge_completed`); can be no-op or console for recreation.

---

## 1.5 Non-Functional Requirements

- **Performance:** Pose detection must not block the UI (run in background; throttle e.g. every 80 ms). Game loops (Boxing, Fruit Ninja) must be synchronous per frame; no `await` inside the draw loop.
- **Video:** Single `<video>` element for camera challenges; do not remount between “loading” and “ready” (use one element + overlay for “Loading camera…”).
- **Persistence:** All progress, hero, weekly goal, config in localStorage so the app works without a backend. Optional: backend later for sync.
- **Browser:** Modern browsers; camera and (for pose) WebGL for TensorFlow.js. HTTPS for camera.

---

# Part 2: Technical Design Document (TDD)

## 2.1 Tech Stack

- **Framework:** Next.js 14 (App Router).
- **Language:** TypeScript.
- **UI:** React 18, CSS Modules, Framer Motion (optional, for animations).
- **Pose:** TensorFlow.js + `@tensorflow-models/pose-detection` (MoveNet SinglePose Lightning). WebGL backend; fallback CPU.
- **Media:** `getUserMedia` for camera; Canvas 2D for drawing video + game elements (Boxing targets, Fruit Ninja fruits). Optional: MediaRecorder for video-based challenges.
- **State:** React Context (no Redux). LocalStorage for persistence.
- **Fonts:** Google Fonts (e.g. Fredoka, Nunito).

---

## 2.2 App Structure (Next.js)

```
app/
  layout.tsx          # Root layout, fonts, manifest, viewport
  page.tsx            # Main page: providers + main content
  globals.css
  design-system.css
  admin/
    page.tsx          # Admin dashboard (config, clear progress, toggle subscription)
  api/
    send-email/       # Optional: Resend for weekly goal email
```

**Provider order (critical for context):**  
`ConfigProvider` → `SubscriptionProvider` → `HeroProvider` → `GameProvider` → `WeeklyGoalProvider`.

---

## 2.3 Data Models

### Challenge

```ts
interface Challenge {
  id: string
  title: string
  description: string
  exerciseType: 'jumping-jacks' | 'squats' | 'dancing' | 'high-knees' | 'push-ups' | 'plank' | 'boxing' | 'fruit-ninja' | ...
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
  order: number
  unlockRequirement?: { previousChallengeId: string; minStars: number }
}
```

### ExerciseResult

```ts
interface ExerciseResult {
  score: number   // 0–100
  stars: number   // 0–3
  coins: number
  feedback: string
}
```

### ChallengeProgress

```ts
interface ChallengeProgress {
  challengeId: string
  bestStars: number
  completed: boolean
}
```

### Hero

```ts
interface Hero {
  stats: { level, experience, experienceToNextLevel, health, strength, totalCoins, lastExerciseDate }
  cosmetics: {
    characterBuild: { skinId, outfitId, accessoryIds[] }
    iconCustomization: { eyes, mouth, accessory, background }
  }
  ownedItems: string[]
}
```

### AdminConfig (localStorage)

```ts
interface AdminConfig {
  challengeOrder: string[]
  challengeDurations: Record<string, number>
  initialCoins: number
  minStarsToUnlockByChallengeId: Record<string, number>
  subscriptionMonthlyPriceUsd: number
  supportEmail: string
}
```

### WeeklyGoal / WeeklyProgress

```ts
interface WeeklyGoal {
  starsRequired: number
  giftDescription: string
  notificationMethod: 'email' | 'whatsapp' | 'push' | 'message'
  notificationContact?: string
}
interface WeeklyProgress {
  weekStartDate: number
  starsEarned: number
  completed: boolean
  completedDate?: number
}
```

---

## 2.4 Key Components

| Component | Role |
|-----------|------|
| **ChallengeSelection** | Lists challenges; shows lock + “Need X stars on previous” when locked. Uses config for order and min stars. |
| **ChallengePopup** | State machine: challenge → instructions → camera (or Boxing/FruitNinja) → [verifying] → result. |
| **ChallengeInstructions** | Step-by-step instructions; “Continue” → camera view. |
| **CameraRecorder** | For video-based challenges: start/stop record, submit blob. |
| **ExerciseVerifier** | Takes video blob; runs pose/motion logic; returns ExerciseResult. |
| **BoxingChallenge** | Live camera + canvas. Spawn targets on timer; pose in background (throttled); sync game loop reads hand refs and checks collisions. Mirror hand X for `scaleX(-1)` canvas. |
| **FruitNinjaChallenge** | Live camera + canvas. Fruits fall; tap/click or pose to slice. Same pattern: one video element, background pose loop (setTimeout 80 ms), sync game loop. At least 1 slice = 1 star; then 50/70/90% for 1/2/3. |
| **ResultDisplay** | Shows stars, coins, feedback; calls addCoins, updateProgress, addStars; animates coin count. |
| **HeroSection** | Displays hero; entry to customizer. |
| **HeroCustomizer** | Tabs: Character (skin, outfit, accessories), Face (eyes, mouth, accessory, background). Subscription gate beyond first 5 per category. |
| **BalanceBar** | Shows diamond count. |
| **FaceIcon** | Header avatar from iconCustomization. |
| **WeeklyGoalDisplay** | Shows progress (e.g. 12/25 stars); entry to WeeklyGoalSettings. |
| **WeeklyGoalSettings** | Form: stars required, gift description, notification method/contact. |
| **Footer** | Links; “Contact support” opens SupportModal. |
| **SupportModal** | Form → mailto with support email from config. |
| **SubscriptionModal** | Shows price from config; “Subscribe” can set subscription flag for demo. |

---

## 2.5 Pose Detection (Critical for Boxing & Fruit Ninja)

- **Library:** `@tensorflow-models/pose-detection` (MoveNet SinglePose Lightning).
- **Initialization:** Once per app; reuse detector. WebGL first, then CPU fallback.
- **Do not block the game loop:** Run `detectPose` in a separate loop (e.g. `setTimeout(updateHands, 80)`), write results to a ref. Game loop only reads the ref and draws.
- **Start pose loop after game start:** When detector is ready, start the pose loop with `setTimeout(updateHands, 0)` so the first run isn’t inside the same frame as the game loop.
- **Canvas mirroring:** If the canvas is shown with `transform: scaleX(-1)`, mirror hand X when mapping from video to canvas: `canvasWidth - (x / videoWidth) * canvasWidth`.
- **Fruit Ninja:** Accept tap/click as well; convert pointer to canvas coords (with mirror). Use one video element; overlay “Loading camera…” instead of remounting.

---

## 2.6 Challenge Completion Logic (Fruit Ninja)

- **Inputs:** `hits`, `totalFruits` (spawned).
- **Compliance:** `min(1, hits / max(1, totalFruits))`.
- **Stars:** 0 if no slices; else 1 star for at least 1 slice; 2 stars at ≥70%; 3 stars at ≥90%. Coins = 20 × stars.
- **Feedback:** Different messages for 0 / 1 / 2 / 3 stars and “try again” vs “great job”.

---

## 2.7 Progression & Unlock

- **Unlock rule:** Challenge with `order === 1` is always unlocked. For others, require `progress[previousChallengeId].bestStars >= minStars`. `minStars` comes from admin config per challenge, fallback to challenge’s `unlockRequirement.minStars` (e.g. 2).
- **Progress update:** On result, call `updateProgress(challengeId, result.stars)` (only update if new stars > best).

---

## 2.8 Storage Keys (localStorage)

- `exercise-game-admin-config` — AdminConfig JSON
- `exercise-game-hero` — Hero JSON
- `exercise-game-progress` — ChallengeProgress[] JSON
- `exercise-game-weekly-goal` — WeeklyGoal JSON
- `exercise-game-weekly-progress` — WeeklyProgress JSON
- `exercise-game-subscription` — `'true'` | `'false'`

---

# Part 3: How to Recreate (Checklist for Gemini or Dev)

## 3.1 One-Shot Prompt for Gemini (or similar)

You can paste something like this (and attach this spec):

```
Build a web app called "FitHero Kids" (tagline: Move • Play • Grow!) according to the attached PRODUCT_SPEC.md.

Requirements summary:
- Next.js 14, TypeScript, React 18.
- Main page: header (logo, balance bar, face icon), weekly goal widget, hero area, challenge list, footer with Contact support.
- Challenges: 8 types including Boxing and Fruit Ninja (real-time camera + pose) and 6 video-based (record then verify). Use the challenge list and flow described in the spec.
- Pose: TensorFlow.js MoveNet; pose must run in background (throttled), never block the game loop. Single video element; mirror hand X if canvas is mirrored.
- Scoring: 0–3 stars; 50/70/90% for 1/2/3; Fruit Ninja: at least 1 slice = 1 star. Coins = 20 × stars.
- Hero: level, XP, diamonds; customization (character + face); first 5 per category free/diamonds, rest subscription-gated.
- Weekly goal: stars required, gift description, notification method; stored locally; reset by week.
- Admin at /admin: challenge order, durations, initial coins, min stars per challenge, subscription price USD, support email; save to localStorage; clear progress and toggle subscription for testing.
- Contact support: form → mailto to configurable support email.
- All persistence in localStorage. No backend required except optional Resend for email.
- Use the exact provider order and data models from the TDD section.
```

---

## 3.2 Dependency List (package.json)

```json
{
  "dependencies": {
    "@tensorflow-models/pose-detection": "^2.1.0",
    "@tensorflow/tfjs": "^4.11.0",
    "framer-motion": "^10.16.0",
    "html-to-image": "^1.11.13",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "resend": "^6.9.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 3.3 Environment (Optional)

- `RESEND_API_KEY` — for weekly goal email (optional).
- `RESEND_FROM_EMAIL` — optional verified sender.

No env vars required for core app or sharing without a domain.

---

## 3.4 Scripts

- `npm run dev` — e.g. `next dev -p 3002`
- `npm run build` — `next build`
- `npm run start` — `next start`
- Deploy: e.g. `vercel` or `vercel --prod` (free tier) to get a shareable URL without buying a domain.

---

## 3.5 Critical Implementation Notes

1. **Provider order:** ConfigProvider wraps SubscriptionProvider wraps HeroProvider wraps GameProvider wraps WeeklyGoalProvider. Required so SubscriptionModal and others can read config.
2. **Video element:** Never swap the camera `<video>` between “loading” and “ready”; use one element and an overlay for “Loading camera…” so the stream stays attached.
3. **Game loop:** Boxing and Fruit Ninja must use a synchronous requestAnimationFrame loop. Pose updates go in a separate throttled loop (e.g. setTimeout 80 ms) writing to a ref.
4. **Fruit Ninja stars:** Ensure at least 1 slice gives 1 star and 20 coins; then 50/70/90% for 1/2/3 stars.
5. **Admin:** Seed config from challenge list (order, durations) on first load if config is empty; preserve minStarsToUnlockByChallengeId, subscription price, and support email when resetting defaults.

---

## 3.6 File / Module Map (for recreation)

- **Contexts:** ConfigContext, SubscriptionContext, HeroContext, GameContext, WeeklyGoalContext.
- **Utils:** config (get/set AdminConfig), scoring (stars, coins, thresholds), challengeProgression (unlock, updateProgress), poseDetection (init, detectPose, getHandPositions, checkCollision, isPunching, isHandMoving), subscription (FREE_* counts, requiresSubscription), heroUtils (getInitialHero, applyTimeDecay, addCoinsToHero), weeklyGoal (getCurrentWeekStart, isNewWeek, resetWeeklyProgress, addStarsToWeeklyProgress), sounds (playSound).
- **Data:** challenges (ALL_CHALLENGES), characterOptions (skins, outfits, accessories), iconCustomization (eyes, mouth, accessory, background), exerciseInstructions.
- **Types:** challenge, hero, config, weeklyGoal.

---

# Part 4: Sharing Without a Domain

1. **Build:** `npm run build`
2. **Deploy:** `npx vercel` (or connect repo to Vercel). You get a URL like `https://exercise-game-app-xxx.vercel.app`.
3. **Share:** Send that URL. No domain purchase needed.
4. **Admin:** Share `https://your-app.vercel.app/admin` with the operator; config is stored in the user’s browser (localStorage), so each device has its own config unless you add a backend later.
5. **Optional:** Add a backend later to sync admin config or progress; the spec does not require it for recreation or sharing.

---

*End of Product Spec. Use this document with Gemini or another AI/developer to recreate FitHero Kids without the original codebase or a custom domain.*

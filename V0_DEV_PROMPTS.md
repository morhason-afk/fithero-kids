# v0.dev Creative Specs & Prompts — FitHero Kids

Use these as prompts in [v0.dev](https://v0.dev) to generate or refine UI. Paste one block at a time for best results. v0 uses React + Tailwind; you can ask it to output plain CSS or match your stack.

---

## 1. Design system (paste first for context)

```
Design system for a kids fitness game app called "FitHero Kids" (tagline: Move • Play • Grow!). 
Served by "YOM Games". Brand icon: red kite (🪁).

- **Vibe:** Playful, energetic, kid-friendly but not babyish. Bold and clear for small screens and touch.
- **Fonts:** Headings/titles use a rounded, friendly sans (e.g. Fredoka or similar); body use clean sans (e.g. Nunito).
- **Colors:** 
  - Primary purple: #6C5CE7 (buttons, key UI)
  - Primary light: #A29BFE
  - Teal/secondary: #00CEC9
  - Gold accent: #FDCB6E (rewards, stars)
  - Success green: #00B894
  - Warning: #F39C12
  - Error: #E74C3C
  - Dark text: #2D3436
  - Muted/gray: #9CA3AF, #6B7280
  - Background: #F9FAFB or soft gradients
- **Shapes:** Rounded corners (12px–20px), soft shadows, no sharp edges. Cards with subtle borders or gradient borders.
- **Touch:** Buttons and tappable areas at least 44px. Plenty of padding.
- **Motion:** Subtle float, pulse-glow, bounce-in for rewards. Not too busy.
```

---

## 2. App header

```
Create a responsive app header for a kids fitness game.

- Left: Red kite emoji/icon (🪁) as logo, large and prominent. Next to it: "FitHero Kids" (bold, purple), tagline "Move • Play • Grow!" (smaller, gray), and a small line "Served by YOM Games" (muted).
- Right: Diamond/coin balance pill (e.g. "💎 120") and a circular avatar/face icon placeholder.
- Clean, single row on desktop; can stack or simplify on mobile. Background white or very light gray. Use the design system colors (primary #6C5CE7, gray text). Rounded, friendly feel.
```

---

## 3. Challenge list / cards

```
A list of challenge cards for a kids fitness game.

- Each card: large emoji or icon on the left (e.g. 🦘 🥊 🍎), title (e.g. "Jumping Jacks", "Boxing Challenge"), short description, duration badge (e.g. "15 sec"), and a reward hint (e.g. "20–60 💎"). Optional: lock icon + "Need 2 stars on previous" for locked challenges.
- Cards are tappable, rounded (16px), with soft shadow and hover/active state. Use purple primary and teal accents. Some cards can have a thin gold or gradient border for "featured" or "new."
- Layout: vertical stack on mobile; optional 2-column grid on larger screens. Plenty of spacing between cards.
```

---

## 4. Challenge popup (pre-start)

```
A modal/popup for starting a fitness challenge.

- Header: Close (X), big challenge emoji, title (e.g. "Fruit Ninja"), short description.
- Info row: Duration (e.g. "⏱️ 15 seconds"), Goal (e.g. "Slice 50% of fruits"), Reward (e.g. "💎 20–60 diamonds") in a small highlighted pill.
- Single primary CTA: "🎮 Start Challenge!" — large, purple, rounded. Optional "Back" or secondary button.
- Modal: centered, max-width ~400px, rounded corners, soft shadow, light background. Match the kids fitness design system (purple #6C5CE7, friendly fonts).
```

---

## 5. Result / celebration screen

```
A result screen after completing a fitness challenge.

- Big title: "Amazing!" or "Great job!" or "Try again" (change style for each — celebratory vs neutral).
- Star rating: 1–3 stars (filled vs outline). Optional "NEW PERSONAL BEST!" badge for 3 stars.
- Short feedback sentence (e.g. "You sliced 8 of 10 fruits! Perfect ninja! 🌟").
- Diamond reward: "+60 💎" with subtle animation (e.g. coin flip or count-up).
- Two CTAs: primary "Play Again!" (purple) and secondary "Close" or "Back to challenges."
- For "Amazing!" / "Great job!": confetti or soft gradient background (gold/purple). For "Try again": calmer, gray tones, no confetti. Rounded card, friendly typography.
```

---

## 6. Weekly goal widget

```
A compact weekly goal widget for a kids fitness app.

- Shows progress: e.g. "12 / 25 ⭐ this week" with a progress bar (filled purple/teal, rounded).
- Short line: e.g. "Goal: 25 stars for a special treat!"
- Optional: small "Edit goal" or gear icon. Place in a card or soft background so it stands out from the rest of the page. Use design system colors (primary, success green for progress).
```

---

## 7. Footer

```
A footer for a kids fitness web app "FitHero Kids", served by YOM Games.

- Brand block: Red kite icon (🪁), "FitHero", tagline "Making fitness fun for the next generation of superheroes.", and "Served by YOM Games" (small, muted).
- Columns: Game (Challenges, Leaderboard, Rewards), Parents (Dashboard, Safety, Subscription, Contact support), Newsletter (email input + Join button).
- Bottom line: "© 2024 FitHero Kids. Served by YOM Games. All rights reserved."
- Light gray background (#F3F4F6), dark gray text, links without underline. Responsive: stack columns on mobile. Rounded and spacious.
```

---

## 8. Balance bar (diamonds)

```
A small balance bar component for in-app currency (diamonds).

- Shows: 💎 icon + number (e.g. "120"). Pill or badge shape, rounded, purple or teal background (or white with purple border). Slightly larger tap target. Optional subtle pulse or shimmer on the icon. Matches FitHero Kids design system.
```

---

## 9. Hero / character area placeholder

```
A hero section placeholder for a kids fitness game.

- Large area for a character/avatar (placeholder illustration or simple shape).
- Optional: level badge, name, or short motivational line ("Ready to move?").
- Soft gradient background (purple to light blue: #6C5CE7 → #A29BFE → #74B9FF). Rounded container. Space below for a "Customize" or "Play" CTA. Kid-friendly, no sharp edges.
```

---

## 10. Subscription / paywall modal

```
A simple subscription modal for a kids app.

- Title: e.g. "Unlock more challenges & customization"
- Short bullet list of benefits (e.g. All challenges, More hero options, No ads).
- Price line: e.g. "$4.99 USD/month" (from config). Prominent but not aggressive.
- Primary button: "Subscribe" (purple). Secondary: "Maybe later" or "Close."
- Modal: centered, max-width ~400px, rounded, light background. Friendly, not pushy. Use FitHero colors (primary #6C5CE7).
```

---

## Tips for v0.dev

- **One component at a time:** Paste one section above, get the component, then iterate with "make the button bigger" or "use the red kite emoji."
- **Reference this file:** Add "Use the FitHero Kids design system from the spec: purple #6C5CE7, Fredoka-style headings, rounded 16px cards" to any prompt.
- **Export:** Ask v0 for "React + Tailwind" or "React + CSS modules" depending on your project. You can then swap in your existing logic (e.g. config, routing).
- **Copy over:** Replace or merge the generated JSX/CSS into your existing components (e.g. `Footer.tsx`, `page.module.css`) and keep your state and handlers.

# Creative Specs — FitHero Kids (Element & Screen Inventory)

*Structure and content only. Design, colors, and sizes are not specified here.*

---

## 1. Overview

- **Product:** Gamified exercise app for kids (challenges, hero character, rewards, weekly goals).
- **Users:** Kids (primary); parents (footer links, weekly goal settings, support).
- **Flows:** Browse hero → play challenges → earn stars/diamonds/XP → level up → customize hero; optional weekly goal with parent notification.

---

## 2. Global Shell (Every Main-App View)

### 2.1 Header (sticky)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Logo mark | Graphic (e.g. kite/shape) | Brand mark |
| Wordmark | Text | “FitHero” + “ Kids” |
| Tagline | Text | “Move • Play • Grow!” |
| Served-by | Text | “by YOM Games” |
| Level badge | Text | “LV” + [level number] |
| Language toggle | Control | Switch app language (e.g. EN / HE); two options (e.g. flags or codes) |
| Balance bar | Component | Shows diamond count + star count (current session/week) |

**Behavior:** Header stays visible on scroll. Language choice persists and affects all translatable copy.

---

## 3. Main Screen (Home)

### 3.1 Hero Section

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Decorative background | Visual | Optional noise/gradient/glow (no copy) |
| Energy rings | Visual | Decorative circles around character (no copy) |
| Character container | Area | Holds the hero character (full-body, head to feet) |
| Hero character | Component | Customizable avatar (skin, outfit, accessories, face expression) |
| Ground shadow | Visual | Under character (no copy) |
| Name plate | Container | Shows hero name + edit affordance |
| Hero name | Text | User-editable name (default e.g. “FitHero”) |
| Edit hero name | Button (icon/label) | Opens hero name editor; aria-label e.g. “Edit hero name” |
| Level badge | Text | “Level” + [level number] |
| Brand badge | Text | “FitHero” |
| Headline | Text | “Ready to Move?” |
| Subline | Text | “Complete challenges, earn diamonds, and become the ultimate FitHero!” |
| XP progress label | Text | “XP Progress” |
| XP fraction | Text | “[current XP in level] / [XP needed for level]” (e.g. “5 / 20”) |
| XP progress bar | Progress bar | Visual fill for current level progress; accessible (e.g. aria-valuenow/min/max) |
| Play Now | Button | Primary CTA; starts last unlocked challenge or scrolls to challenges |
| Customize | Button | Opens hero customizer |
| Share | Button | Shares hero image + message (e.g. WhatsApp); label “Share”, loading “Preparing…” |

**Behavior:** Tapping Edit hero name opens **Hero Name Editor** modal. Customize opens **Hero Customizer** modal. Share generates hero image and share text (level + outfit name + URL).

---

### 3.2 Weekly Goal Block (on main)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Card container | Container | One or two cards (goal + optional reward preview) |
| Goal card | Card | |
| Title | Text | “Weekly Goal” |
| Edit goal | Button (icon) | Opens weekly goal settings; aria-label “Edit goal” |
| Progress count | Text | “[stars earned] / [stars required]” |
| Star icon | Icon | Decorative |
| “this week” | Text | “this week” |
| Progress bar | Progress bar | Fill by (earned/required) |
| Goal treat line | Text | “Goal: [N] stars for a special treat!” (N = configurable) |
| Reward card (optional) | Card | Shown/hidden by prop |
| Reward label | Text | “WEEKLY REWARD” |
| Reward title | Text | [Gift description from settings] + “!” |
| Reward preview | Text | “+500 Diamonds”, “+50 Stars” (or similar) |

**Behavior:** Edit opens **Weekly Goal Settings** modal. Progress reflects stars earned this week vs required.

---

### 3.3 Challenges Section

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Section title | Text | “Challenges” |
| Title meta | Text | “[count] available” (count = unlocked & not subscription-locked) |
| Challenge grid | Grid | List of challenge cards (order from config) |

**Per challenge card:**

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Card (clickable when unlocked) | Card | Selects this challenge and opens Challenge Popup |
| Lock overlay (when locked) | Overlay | |
| Lock icon | Icon | e.g. 🔒 |
| Lock reason | Text | “Need [N] star(s) on [previous challenge title]” or “Subscribe to unlock” |
| Unlock button (subscription lock only) | Button | “UNLOCK NOW”; opens subscription modal |
| “New” tag | Text | “New” (e.g. first time unlocked, not yet played) |
| “Popular” tag | Text | “Popular” (e.g. for one chosen index) |
| Challenge icon | Icon/emoji | Per challenge (e.g. 🦘 💪 🕺 🏃 🥊 🍎) |
| Challenge title | Text | From data (e.g. “Jumping Jacks”, “Boxing Challenge”) |
| Challenge description | Text | From data (one line) |
| Duration | Text | “[duration] sec” |
| Reward range | Text | “[min]–[max]” diamonds (range by duration) |

**Behavior:** Unlocked + not subscription-locked: tap opens **Challenge Popup**. Subscription-locked: tap shows subscription message; “UNLOCK NOW” opens **Subscription Modal**. Progress (best stars) can be shown on card if desired.

---

### 3.4 Footer

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Brand column | Column | |
| Brand icon | Icon | e.g. ⚡ |
| Brand name | Text | “FitHero” |
| Tagline | Text | “Making fitness fun for the next generation of superheroes.” |
| Served-by | Text | “by YOM Games” |
| Game column | Column | |
| Column title | Text | “Game” |
| Challenges link | Link | Anchor “#challenges”; label “Challenges” |
| Leaderboard link | Link | Anchor “#leaderboard”; label “Leaderboard” |
| Rewards link | Link | Anchor “#rewards”; label “Rewards” |
| Parents column | Column | |
| Column title | Text | “Parents” |
| Dashboard link | Link | href “/admin”; label “Dashboard” |
| Safety link | Link | Anchor “#safety”; label “Safety” |
| Subscription link | Link | Anchor “#subscription”; label “Subscription” |
| Contact support | Button | “Contact support”; opens **Support Modal** |
| Newsletter column | Column | |
| Column title | Text | “Newsletter” |
| Email input | Input | Placeholder “Parent’s email”; aria-label same |
| Join | Button | “Join” (submit newsletter; behavior as defined) |
| Copyright | Text | “© [year] FitHero Kids • YOM Games • All rights reserved.” |

**Behavior:** Contact support opens **Support Modal** (mailto prep with parent details).

---

## 4. Modals / Overlays

### 4.1 Hero Name Editor (modal)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Overlay | Layer | Dismiss on click |
| Close | Button | “✕”; aria-label “Close” |
| Title | Text | “Name your hero” |
| Subtitle | Text | “Choose a name that appears below your character.” |
| Label | Text | “Hero name” |
| Text input | Input | Max length (e.g. 20); placeholder default name |
| Char count | Text | “[current] / [max]” |
| Error message | Text | “Please enter a name.” or “Name must be [N] characters or less.” |
| Cancel | Button | “Cancel”; closes modal |
| Save | Button | “Save”; validates, saves name, closes |

**Behavior:** Save persists name and updates hero name on main. Validation: non-empty; length ≤ max.

---

### 4.2 Hero Customizer (modal)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Overlay | Layer | Dismiss on click |
| Header | Bar | |
| Title | Text | “🎨 Customize Your Hero” |
| Coin balance | Text | 💎 + [diamond count] |
| Close | Button | “✕” |
| Preview | Area | Renders **Hero Character** with current selections |
| Hint | Text | “First 5 in each category (skin, outfit, accessories) free or for diamonds • Rest require subscription” (or similar) |
| Skin | Section | |
| Label | Text | “Skin” |
| Skin options | Grid | Color swatches; selected state; lock icon + “Subscribe” when subscription required; cost (e.g. “10💎”) when not owned |
| Outfit | Section | |
| Label | Text | “Outfit” |
| Outfit options | Grid | Per outfit: preview (e.g. body/leg colors), name, cost or “Subscribe” or “Owned” |
| Accessories | Section | |
| Label | Text | “Accessories” |
| Accessory options | Grid | Per item: icon, name, cost / “Owned” / “Subscribe” |
| Face | Section | |
| Label | Text | “Face” |
| Face options | Grid | Per expression: emoji preview, name, cost / “Subscribe” |

**Behavior:** Selecting an option applies it to the hero and can award XP (e.g. 1 per change). Locked by subscription: tap shows subscription message. Not owned + cost: spend diamonds or show “not enough” message. First N options per category free or diamonds; rest subscription (configurable).

---

### 4.3 Challenge Popup — Intro View (before starting)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Overlay | Layer | Dismiss on click (cancel) |
| Close | Button | “✕” |
| Challenge icon | Icon | From challenge |
| Challenge title | Text | From data (e.g. “Boxing Challenge”) |
| Challenge description | Text | From data |
| Info row: Duration | Label + value | “Duration”; “[N] seconds” |
| Info row: Goal | Label + value | “Goal”; text by type (e.g. “Hit at least 50% of targets with punches”, “Slice at least 50% of fruits with your hands”, “Complete challenge”) |
| Info row: Reward | Label + value | “Reward”; “20–60 diamonds” (or range) |
| Start Challenge | Button | “🎮 Start Challenge!”; goes to **How to Play** or directly to **Camera / Game** |

**Behavior:** Close returns to main. Start Challenge → **Challenge Instructions** (How to Play) for that challenge, then **Camera Recorder** (video challenges) or **Boxing** / **Fruit Ninja** (interactive).

---

### 4.4 Challenge Instructions (“How to Play”) (inside popup)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Title | Text | “How to Play” |
| Steps list | List | Numbered steps from exercise instructions (title + optional description per step) |
| Demo area | Area | Placeholder or animation; text “Demo animation plays here” |
| Continue | Button | “Got it! Let’s Go!” (or similar); starts camera/game |

**Behavior:** One primary action: continue to recording or interactive challenge.

---

### 4.5 Camera Recorder (overlay / full-screen feel)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Loading state | Block | “Requesting camera access…”, “Please allow camera access when prompted” |
| Video preview | Video | Live camera |
| Recording HUD | Optional | Timer, “REC”, etc. |
| Recording hint | Text | “Recording… Complete the challenge to finish.” |
| Cancel / back | Control | Returns to challenge intro |

**Behavior:** Requests camera; records for challenge duration; on stop → **Exercise Verifier** (for video-based challenges) or result.

---

### 4.6 Boxing Challenge (interactive overlay)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Title | Text | “🥊 Boxing Challenge” |
| Loading | Text | “Loading camera…” |
| Error state | Text + button | Error message; “Try Again” |
| Video/canvas | Area | Camera + targets overlay |
| Score | Text | “⭐ [score]” |
| Timer | Text | “0:[MM]” |
| Combo | Text | “COMBO x[N]” (or similar) |
| Start | Button | “🚀 Start Challenge!” |
| Recording hint | Text | “Complete the challenge before time runs out!” |
| Instructions | Text | “💡 Throw punches at the targets!”, “Extend your arms quickly to hit them!” |

**Behavior:** Targets appear; user punches (camera/pose); score and timer; on time up → **Result** with stars and diamonds.

---

### 4.7 Fruit Ninja Challenge (interactive overlay)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Title | Text | “🍎 Fruit Ninja Challenge” |
| Loading | Text | “Loading camera…” |
| Error state | Text + button | Error message; “Try Again” |
| Video/canvas | Area | Camera + falling fruits |
| Score | Text | “🍎 Score: [score]” or similar |
| Timer | Text | “0:[MM]” |
| Sliced count | Text | “Sliced: [N] 🍎” (or similar) |
| Start | Button | “🚀 Start Challenge!” |
| Recording hint | Text | “Complete the challenge before time runs out!” |
| Instructions | Text | “💡 Tap or click fruits to slice them — or wave your hands in front of the camera!”, “Slice as many as you can before time runs out.” |

**Behavior:** Fruits fall; user slices (tap or camera); on time up → **Result**.

---

### 4.8 Exercise Verifier (overlay, after video record)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Spinner / visual | Visual | Loading/analyzing |
| Title | Text | “Checking your moves…” |
| Status text | Text | Dynamic (e.g. “Loading video…”, “Detecting movements…”, “Analyzing form…”, “Calculating score…”, “Complete!”) |
| Progress bar | Progress bar | 0–100% |

**Behavior:** Simulated or real analysis; on complete → **Result** with stars, coins, feedback.

---

### 4.9 Result Display (modal/overlay)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Confetti (optional) | Visual | When 2+ stars |
| Card | Card | |
| Celebration icon | Icon | e.g. 🎉 or 💪 |
| Title | Text | “Amazing!” / “Great job!” / “Try again” (by stars) |
| Feedback | Text | Dynamic message (e.g. “You hit X of Y targets…”) |
| Stars | Row | 3 star icons; filled by result.stars |
| Reward: Diamonds | Label + amount | “Diamonds”; “+[N]” |
| Reward: Stars | Label + amount | “Stars”; “+[N]” |
| New record badge | Text | “🏆 NEW PERSONAL BEST!” (when 3 stars) |
| Home | Button | “Home”; closes popup, back to main |
| Play Again / Try Again | Button | “Play Again!” or “Try Again”; closes popup |

**Behavior:** On mount: add coins and XP to hero, update challenge progress, add stars to weekly goal. Buttons close the challenge flow and return to main.

---

### 4.10 Support Modal

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Overlay | Layer | Dismiss on click |
| Close | Button | “✕”; aria-label “Close” |
| Title | Text | “Contact support” |
| Description | Text | “Fill in your details and we'll open your email app to send a message to support.” |
| First name | Label + input | “First name”; placeholder “First name” |
| Last name | Label + input | “Last name”; placeholder “Last name” |
| Email | Label + input | “Email”; placeholder “your@email.com”; required |
| Description | Label + textarea | “Description”; placeholder “How can we help?”; required |
| Cancel | Button | “Cancel” |
| Send email | Button | “Send email”; opens mailto with subject/body |

**Behavior:** Submit opens default email client with pre-filled recipient (support email), subject, and body.

---

### 4.11 Subscription Modal

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Overlay | Layer | Dismiss on click |
| Close | Button | “✕”; aria-label “Close” |
| Title | Text | Context-based: “Unlock All Challenges”, “Unlock All Character Options”, or “Unlock All Face Options” |
| Description | Text | Context-based (e.g. “Challenges 1–4 are free…”, “First 5 in each category… Subscribe to unlock the rest!”) |
| Price | Text | “Free” or “[price] USD/month” |
| Card number | Label + input | “Card number”; placeholder “1234 5678 9012 3456” |
| Expiry | Label + input | “Expiry (MM/YY)”; placeholder “MM/YY” |
| CVC | Label + input | “CVC”; placeholder “669” (demo) |
| Error | Text | e.g. “Invalid card. For demo use CVC 669.”, “Please enter a valid card number (any digits).” |
| Submit | Button | “Processing…” / “Subscribe” |
| Demo hint | Text | “Demo: use any card number and CVC [demo CVC]” |

**Behavior:** Demo: valid CVC (e.g. 669) + any card digits → success callback and close. Real implementation would integrate payment.

---

### 4.12 Weekly Goal Settings (modal)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Overlay | Layer | Dismiss on click |
| Close | Button | “✕” |
| Title | Text | “⚙️ Configure Weekly Goal” |
| Stars required | Label + number input | “Stars Required This Week”; min 1, max 50 |
| Gift description | Label + text input | “Gift Description”; placeholder “e.g., a special treat, extra screen time, a new toy” |
| Notification method | Label + select | “Notification Method”; options: “In-App Message”, “Email”, “WhatsApp”, “Browser Push Notification” |
| Email address (conditional) | Label + input | “Email Address”; placeholder “parent@example.com” |
| WhatsApp number (conditional) | Label + input | “WhatsApp Number”; placeholder “+1234567890” |
| Cancel | Button | “Cancel” |
| Save Settings | Button | “Save Settings” |

**Behavior:** Save persists goal (stars required, gift description, notification method, contact). Used for weekly goal display and notifications.

---

## 5. Balance Bar (component)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Diamonds | Icon + amount | 💎 [count] |
| Diamonds label | Text | “Diamonds” |
| Stars | Icon + amount | ⭐ [count] |
| Stars label | Text | “Stars” |

**Behavior:** Diamonds = hero total coins; Stars = weekly progress stars (or session). Display-only in header.

---

## 6. Hero Character (component)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Label | Text | “YOUR HERO” |
| Character visual | Graphic | Full-body avatar: skin color, outfit (top/legs), accessories (cape, crown, belt, gloves, wings, scarf, shield, halo, mask, backpack), face expression (eyes + mouth). Rendered from config (characterBuild). |
| Display name | Text | Outfit name or “My Hero” (e.g. for card context) |
| Subtitle | Text | “Level [N] • Champion” |

**Behavior:** Purely presentational; reflects hero state from context. Used in Hero Section and inside Hero Customizer preview.

---

## 7. Admin Screen (separate route, e.g. /admin)

| Element | Type | Purpose / Copy |
|--------|------|-----------------|
| Title | Text | “⚙️ Product Admin” (or similar) |
| Subtitle | Text | Short description of what admin does |
| Link: Analytics | Link | “📊 View Analytics” (or similar) |
| Link: Back to app | Link | “← Back to app” |

**Section: Subscription (testing)**  
| Element | Purpose / Copy |
|--------|-----------------|
| Section title | “Subscription (for testing)” |
| Hint | Explain first N free, subscription for rest; toggle to simulate subscriber |
| Checkbox | “Subscription active (unlock all)” |

**Section: Subscription & support**  
| Element | Purpose / Copy |
|--------|-----------------|
| Section title | “Subscription & support” |
| Label | “Monthly subscription (USD)” |
| Input | Number (0–999.99) |
| Label | “Support email” |
| Input | Email |

**Section: Initial diamonds**  
| Element | Purpose / Copy |
|--------|-----------------|
| Section title | “Initial diamonds” |
| Hint | New players start with this many diamonds |
| Input | Number |

**Section: XP & level progression**  
| Element | Purpose / Copy |
|--------|-----------------|
| Section title | “XP & level progression” |
| Hint | Explain XP per level, per customization, per challenge (by stars) |
| Label | “XP per level” |
| Input | Number (points) |
| Label | “XP per customization” |
| Input | Number (points) |
| Label | “Max XP per challenge (by stars)” |
| Input | Number; hint “1★=⅓, 2★=⅔, 3★=max” |

**Section: Challenge order, duration & unlock**  
| Element | Purpose / Copy |
|--------|-----------------|
| Section title | “Challenge order, duration & unlock stars” |
| Hint | Reorder with ↑/↓; duration 5–60 sec; min stars 0–3 |
| List | One row per challenge: ↑ ↓ buttons, icon, title, duration input (sec), min-stars input (stars) |

**Actions**  
| Element | Purpose / Copy |
|--------|-----------------|
| Button | “Reset to defaults” |
| Button | “Clear game progress” |
| Button | “Save configuration” |
| Toast | “Saved. Reload the main app for changes to apply.” |
| Toast | “Game progress cleared. Reload…” (after clear) |

**Behavior:** Loads/saves config (challenge order, durations, min stars, initial coins, subscription price, support email, XP settings). Clear progress wipes saved hero so next load gets fresh hero with current initial diamonds.

---

## 8. Challenge Types (data-driven)

- **Video-based:** Jumping Jacks, Squat Power, Dance Party, High Knees, Push-ups, Plank Hold.  
  Flow: Intro → How to Play → Camera Recorder → Exercise Verifier → Result.

- **Interactive (camera):** Boxing Challenge, Fruit Ninja.  
  Flow: Intro → How to Play → Boxing/Fruit Ninja screen → Result.

Each challenge has: **id**, **title**, **description**, **exerciseType**, **duration** (seconds), **difficulty**, **icon**, **order**, **unlockRequirement** (previousChallengeId, minStars).  
Copy for “How to Play” steps and goal text can be per exerciseType (from exercise instructions data).

---

## 9. Customization Options (data-driven)

- **Skins:** List of options (id, name, color, cost). Default skin.
- **Outfits:** List (id, name, bodyColor, legColor, cost). Default outfit.
- **Accessories:** List (id, name, type, cost, optional color). Types e.g. cape, crown, belt, gloves, wings, scarf, shield, halo, mask, backpack. “None” option.
- **Face expressions:** List (id, name, cost, eyes, mouth). E.g. Happy, Calm, Surprised, Sad, Star Eyes, Hearts, Wink, Determined, Sleepy, Silly, Super Happy. Default expression.

Each option can be free (0 cost), diamond cost, or subscription-only (after first N). Selection applies to hero and can award XP (e.g. 1 per change).

---

## 10. Copy Summary (all user-facing text)

- **Global:** FitHero, FitHero Kids, Move • Play • Grow!, by YOM Games, LV, Level, Diamonds, Stars, Close, Cancel, Save, Edit goal, this week, available, Subscribe, Owned, UNLOCK NOW, New, Popular, sec, Previous challenge, Need, star, stars, on, Subscribe to unlock.
- **Hero:** YOUR HERO, Champion, Ready to Move?, XP Progress, Customize, Edit hero name, ✨ Play Now, Share, Preparing…, Name your hero, Choose a name…, Hero name, Please enter a name., Name must be X characters or less.
- **Weekly goal:** Weekly Goal, Goal: X stars for a special treat!, WEEKLY REWARD, +500 Diamonds, +50 Stars, ⚙️ Configure Weekly Goal, Stars Required This Week, Gift Description, Notification Method, In-App Message, Email, WhatsApp, Browser Push Notification, Email Address, WhatsApp Number, Save Settings, placeholder examples.
- **Challenges:** Challenges, Duration, seconds, Goal, Hit at least 50%…, Slice at least 50%…, Complete challenge, Reward, 20–60 diamonds, Start Challenge!, How to Play, Demo animation plays here, Got it! Let’s Go!, Requesting camera access…, Please allow camera access…, Recording… Complete the challenge…, Complete the challenge before time runs out!, Loading camera…, Try Again, Checking your moves….
- **Result:** Amazing!, Great job!, Try again, NEW PERSONAL BEST!, Home, Play Again!, Try Again, feedback messages (dynamic).
- **Footer:** Making fitness fun…, Game, Parents, Newsletter, Challenges, Leaderboard, Rewards, Dashboard, Safety, Subscription, Contact support, Parent’s email, Join, © … FitHero Kids • YOM Games • All rights reserved.
- **Support:** Contact support, Fill in your details…, First name, Last name, Email, Description, How can we help?, Send email.
- **Subscription:** Unlock All Challenges / Unlock All Character Options / Unlock All Face Options; description per reason; Free / X USD/month; Card number, Expiry (MM/YY), CVC; Invalid card…, Please enter a valid card…; Processing…, Subscribe; Demo hint.
- **Customizer:** 🎨 Customize Your Hero; Skin, Outfit, Accessories, Face; First 5 in each category…; Requires subscription; item names and costs.

---

*End of Creative Specs.*

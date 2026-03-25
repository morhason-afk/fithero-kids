# 🎮 Exercise Game for Kids

A gamified exercise app that motivates kids to exercise through fun challenges, camera recording, hero character progression, and reward systems.

## Features

- 🎯 **6 Exercise Challenges** - Jumping jacks, squats, dancing, high knees, push-ups, and plank
- 🎥 **Camera Recording** - Records exercise performance using device camera
- ⭐ **Star-Based Scoring** - Earn 1-3 stars based on performance (33%, 60%, 85%+)
- 🔓 **Challenge Progression** - Unlock new challenges by earning 2+ stars
- 💎 **Diamond Rewards** - Earn diamonds based on stars (20 diamonds per star)
- 🦸 **Hero Character** - Level up your hero as you earn diamonds
- 🎨 **Customization** - Customize hero appearance (some free, some cost diamonds)
- 💾 **Owned Items** - Once purchased, items are yours forever
- 📅 **Weekly Goals** - Set weekly star goals with parent notifications
- 📖 **Instructions** - Step-by-step instructions before each challenge
- 💬 **Encouragement** - Real-time encouraging messages and sounds during exercises
- 📊 **Progress Tracking** - Track your progress across all challenges

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Email Notifications Setup

To enable email notifications for weekly goals, you need to configure Resend:

1. **Sign up for Resend** (free tier available):
   - Go to https://resend.com
   - Create an account and verify your email
   - Navigate to API Keys and create a new API key

2. **Configure environment variables**:
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Add your Resend API key
   RESEND_API_KEY=re_your_api_key_here
   
   # Optional: Set a custom "from" email (must be verified domain)
   RESEND_FROM_EMAIL=Exercise Game <noreply@yourdomain.com>
   ```

3. **For production** (Vercel/Netlify):
   - Add `RESEND_API_KEY` to your environment variables in the deployment dashboard
   - Optionally add `RESEND_FROM_EMAIL` if you have a verified domain

**Note**: Without the API key configured, email notifications will fall back to opening the default email client.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## How to Share

See [SHARE.md](./SHARE.md) for detailed sharing instructions.

**Quickest way**: Deploy to Vercel (free):
```bash
npm install -g vercel
vercel
```

## Project Structure

```
exercise-game-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ChallengeSelection.tsx    # Challenge selection list
│   ├── ChallengePopup.tsx        # Challenge popup modal
│   ├── ChallengeInstructions.tsx # Pre-challenge instructions
│   ├── CameraRecorder.tsx        # Camera recording
│   ├── ExerciseVerifier.tsx      # Exercise verification
│   ├── ResultDisplay.tsx          # Results and rewards
│   ├── HeroCharacter.tsx         # Hero display
│   ├── HeroCustomizer.tsx        # Customization shop
│   └── WeeklyGoalDisplay.tsx      # Weekly goal tracker
├── contexts/              # React contexts
│   ├── HeroContext.tsx          # Hero state management
│   ├── GameContext.tsx          # Challenge progress
│   └── WeeklyGoalContext.tsx    # Weekly goals
├── data/                  # Data files
│   ├── challenges.ts            # Challenge definitions
│   └── exerciseInstructions.ts # Exercise instructions
├── types/                 # TypeScript types
├── utils/                 # Utility functions
│   ├── heroUtils.ts           # Hero calculations
│   ├── scoring.ts             # Star scoring system
│   ├── challengeProgression.ts # Unlock logic
│   ├── weeklyGoal.ts          # Weekly goal logic
│   └── sounds.ts              # Sound effects
└── package.json
```

## Key Features Explained

### Challenge Progression
- Start with Challenge 1 (always unlocked)
- Earn 2+ stars to unlock the next challenge
- Progress is saved automatically

### Hero System
- Diamonds convert to experience → level up
- Level affects health and strength stats
- Hero decays if inactive for 48+ hours (retention mechanism)

### Weekly Goals
- Set custom weekly star goals
- Configure parent notifications (email/WhatsApp/push/message)
- Automatically resets every Monday

### Customization
- First item in each category is free
- Premium items cost diamonds (10-30 diamonds)
- Once purchased, items are owned forever

## Browser Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- Camera access permissions
- HTTPS required for camera (provided by Vercel/Netlify)

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **React Context** - State management
- **Web Audio API** - Sound effects
- **MediaRecorder API** - Video recording
- **localStorage** - Data persistence

## Future Enhancements

- Real pose detection using TensorFlow.js or MediaPipe
- More exercise types
- Sticker collection system
- Social sharing features
- Multiplayer challenges
- Parent dashboard

## License

Private project - All rights reserved
# Setup Instructions

## Step 1: Install Node.js

You need to install Node.js (which includes npm) first. Choose one of these methods:

### Option A: Using Homebrew (Recommended for macOS)
```bash
brew install node
```

### Option B: Download from Official Website
1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Follow the installation instructions

### Option C: Using nvm (Node Version Manager)
```bash
# Install nvm first
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Then install Node.js
nvm install --lts
nvm use --lts
```

## Step 2: Verify Installation

After installing Node.js, verify it's working:
```bash
node --version
npm --version
```

You should see version numbers (e.g., v20.x.x for Node.js and 10.x.x for npm).

## Step 3: Install Project Dependencies

Navigate to the project directory and install dependencies:
```bash
cd /Users/morhasson/Documents/exercise-game-app
npm install
```

This will install all required packages (React, Next.js, TypeScript, etc.).

## Step 4: Start the Development Server

```bash
npm run dev
```

You should see output like:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X seconds
```

## Step 5: Open in Browser

Once the server is running, open your browser and go to:
**http://localhost:3000**

## Troubleshooting

### Port 3000 already in use?
If you get an error that port 3000 is busy, you can:
1. Stop the other process using port 3000, or
2. Run on a different port: `PORT=3001 npm run dev`

### Camera not working?
- Make sure you're using HTTPS or localhost (camera requires secure context)
- Grant camera permissions when prompted by your browser
- Try a different browser (Chrome, Firefox, Safari, Edge)

### Still having issues?
Make sure you're in the correct directory:
```bash
cd /Users/morhasson/Documents/exercise-game-app
```

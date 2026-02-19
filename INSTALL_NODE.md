# How to Install Node.js

## Method 1: Using Homebrew (Easiest - Recommended)

Since you have Homebrew installed, run this command in your terminal:

```bash
brew install node
```

This will install both Node.js and npm (Node Package Manager).

**After installation, verify it worked:**
```bash
node --version
npm --version
```

You should see version numbers like:
- `v20.x.x` for Node.js
- `10.x.x` for npm

---

## Method 2: Download from Official Website

1. Go to **https://nodejs.org/**
2. Click the big green button that says "LTS" (Long Term Support) - this is the recommended version
3. Download the macOS installer (.pkg file)
4. Open the downloaded file and follow the installation wizard
5. Click "Continue" through all the steps
6. Enter your password when prompted
7. Click "Install" to finish

**After installation, verify it worked:**
Open a new terminal window and run:
```bash
node --version
npm --version
```

---

## Method 3: Using nvm (Node Version Manager) - Advanced

If you want to manage multiple Node.js versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Close and reopen your terminal, then:
nvm install --lts
nvm use --lts
```

---

## After Installing Node.js

Once Node.js is installed, come back to your project and run:

```bash
cd /Users/morhasson/Documents/exercise-game-app
npm install
npm run dev
```

Then open http://localhost:3000 in your browser!

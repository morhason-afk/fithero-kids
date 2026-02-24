# How to Share FitHero Kids with Others

You can share the game in two ways: **by link** (easiest) or **by sending a file** (offline package).

---

## Option 1: Share by Link (Recommended)

Best for most people: no install, works on phones and computers.

1. **Deploy the app** (one time):
   - Deploy to Vercel: see [DEPLOYMENT.md](./DEPLOYMENT.md) or [QUICK_START.md](./QUICK_START.md).
   - You’ll get a URL like: `https://your-app-name.vercel.app`

2. **Share the link** with others (e.g. by message, email, or QR code).

3. **They open the link** in a browser and play. No install needed.

4. **Optional – “Install” on a phone** (feels like an app):
   - **iPhone (Safari):** Share → “Add to Home Screen”
   - **Android (Chrome):** Menu (⋮) → “Add to Home Screen” or “Install app”

---

## Option 2: Share as a File (Offline Package)

Use this when you want to send a **folder or zip** that someone can run on their computer without the internet (after the first run, the game runs locally).

### Step 1: Build the shareable package (on your machine)

In the project folder, run:

```bash
npm install
npm run build:share
```

This creates an `out` folder with the game.

### Step 2: Create the folder to send

1. Create a new folder, e.g. `FitHero-Kids-Game`.
2. Copy into it:
   - The entire **`out`** folder (from the project root).
   - **`start-game.command`** (Mac) or **`start-game.bat`** (Windows).
   - **`HOW TO PLAY.txt`** (instructions for the recipient – see below).

3. Zip the folder:  
   `FitHero-Kids-Game.zip`

### Step 3: Send the zip

Send `FitHero-Kids-Game.zip` (e.g. by email, USB, or file sharing). The recipient unzips it and follows the instructions below.

### What the recipient needs

- **Node.js** installed: https://nodejs.org (LTS version).  
  The start script uses it to run a small local server.

### What the recipient does

1. Unzip `FitHero-Kids-Game.zip`.
2. **On Mac:** Double‑click `start-game.command`.  
   If Mac blocks it, right‑click → Open, or in Terminal run: `chmod +x start-game.command` then double‑click again.  
   **On Windows:** Double‑click `start-game.bat`.
3. A browser should open to the game (or open **http://localhost:3002** yourself).
4. Play the game. Progress is stored in the browser (localStorage).

**Note:** Email notifications for weekly goals won’t send from this offline version (no server). The app will offer to open their email client instead.

---

## Optional: “HOW TO PLAY” file for recipients

Create a file named **`HOW TO PLAY.txt`** and put it in the folder you zip. You can use this text:

```
FitHero Kids - Exercise Game

TO PLAY:
1. Install Node.js from https://nodejs.org (if not already installed).
2. Double-click:
   - start-game.command (Mac)
   - start-game.bat (Windows)
3. When the terminal says "Starting FitHero Kids...", open your browser to:
   http://localhost:3002
4. Allow camera access when the game asks (needed for some challenges).

Have fun!
```

---

## Summary

| Method              | Best for                    | Recipient needs        |
|---------------------|----------------------------|------------------------|
| **Share by link**   | Easiest, phones + desktop  | Just a browser         |
| **Share as file**   | Offline / no account       | Node.js + unzip + run  |

For most people, **Option 1 (share the link)** is the simplest. Use **Option 2** when you need to send a file or run without internet.

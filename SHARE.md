# 🎮 Exercise Game for Kids - Sharing Guide

## Quick Start - Share Your App

### Option 1: Deploy to Vercel (Recommended - Free & Easy)

**Vercel is the easiest way to share your app online:**

1. **Sign up for free** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy**:
   ```bash
   cd /Users/morhasson/Documents/exercise-game-app
   vercel
   ```
   
   - Follow the prompts
   - It will ask if you want to deploy (type `Y`)
   - It will give you a URL like: `https://exercise-game-app.vercel.app`
   - **Share this URL with anyone!**

4. **Future updates**: Just run `vercel` again to update!

---

### Option 2: Deploy to Netlify (Also Free)

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   netlify deploy --prod
   ```

---

### Option 3: Share via ngrok (For Quick Testing)

Perfect for testing with others quickly:

1. **Install ngrok**: Download from [ngrok.com](https://ngrok.com)

2. **Start your app**:
   ```bash
   npm run dev
   ```

3. **In another terminal, start ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Share the ngrok URL** (e.g., `https://abc123.ngrok.io`)

---

### Option 4: Share the Project Folder

If someone wants to run it themselves:

1. **Zip the project**:
   ```bash
   cd /Users/morhasson/Documents
   zip -r exercise-game-app.zip exercise-game-app -x "*.git*" "node_modules/*" ".next/*"
   ```

2. **They need to**:
   - Extract the zip
   - Run `npm install`
   - Run `npm run dev`
   - Open `http://localhost:3000`

---

## Production Build (For Sharing)

The app is already built! To rebuild:

```bash
npm run build
npm start
```

This runs the optimized production version on port 3000.

---

## Important Notes

✅ **Camera Access**: Works on HTTPS (Vercel/Netlify provide this automatically)  
✅ **Data Storage**: All progress saved in browser localStorage  
✅ **Port**: Default port is 3000 (configurable)  
✅ **Requirements**: Node.js 18+ required to run locally  

---

## Best Option for Sharing

**Use Vercel** - It's:
- ✅ Free
- ✅ Automatic HTTPS (needed for camera)
- ✅ Easy to update
- ✅ Fast global CDN
- ✅ One command to deploy

Just run `vercel` and share the URL!

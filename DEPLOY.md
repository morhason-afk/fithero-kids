# How to Share/Deploy Your Exercise Game App

## Option 1: Deploy to Vercel (Easiest - Recommended)

Vercel is the easiest way to deploy Next.js apps:

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Users/morhasson/Documents/exercise-game-app
   vercel
   ```
   
   Follow the prompts. It will give you a URL like `https://your-app.vercel.app`

3. **Share the URL** - Anyone can access it!

## Option 2: Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the app**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Option 3: Build and Share Locally

1. **Build the production version**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Share your local IP**:
   - Find your IP: `ifconfig | grep "inet "` (Mac) or `ipconfig` (Windows)
   - Others on your network can access: `http://YOUR_IP:3000`

## Option 4: Export as Static Site (Limited)

For static export (no server-side features):
```bash
npm run build
npm run export
```

Then upload the `out` folder to any static hosting (GitHub Pages, etc.)

## Quick Share Options

### Share via ngrok (for testing):
```bash
npm run dev
# In another terminal:
ngrok http 3000
# Share the ngrok URL
```

### Share via GitHub:
1. Create a GitHub repo
2. Push your code
3. Deploy via Vercel/Netlify (they auto-detect GitHub repos)

## Important Notes

- **Camera access**: Requires HTTPS in production (Vercel/Netlify provide this)
- **LocalStorage**: Data is saved in browser (per device)
- **Port**: App runs on port 3000 by default

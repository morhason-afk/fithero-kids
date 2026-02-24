# Deploy FitHero Kids to Netlify (GitHub + Netlify)

Your project is ready to deploy. Follow these steps to get it online and shareable.

---

## Step 1: Push to GitHub

If you haven’t pushed this repo yet:

1. **Create a new repo on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Name it e.g. `fithero-kids` or `exercise-game-app`
   - Leave “Add a README” unchecked (you already have code)
   - Create the repo

2. **Add the remote and push** (in your project folder):

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

---

## Step 2: Connect and deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and log in (or sign up with GitHub).

2. **Add new site → Import an existing project**
   - Choose **GitHub** and authorize Netlify if asked.
   - Select the repo you pushed in Step 1.

3. **Build settings** (Netlify should detect them from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: leave default (the Next.js plugin sets it)
   - Click **Deploy site**.

4. Wait for the build to finish. You’ll get a URL like `https://random-name-123.netlify.app`.

---

## Step 3: Add your custom domain (optional)

If you bought **fitherokids.app**:

1. In Netlify: **Site → Domain management → Add domain** (or **Options → Domain settings**).
2. Enter `fitherokids.app` and follow the steps.
3. In your domain registrar’s DNS:
   - Either set **Netlify DNS** (nameservers Netlify gives you), or
   - Add the **A** and **CNAME** records Netlify shows you.
4. Wait for DNS to propagate (minutes to a few hours).

---

## Step 4: Share and manage

- **Share the app:** Send your Netlify URL (or `https://fitherokids.app`) to friends.
- **Admin:** Open `https://YOUR-SITE.netlify.app/admin` to change config, clear progress, toggle subscription.
- **Analytics:** Open `https://YOUR-SITE.netlify.app/admin/analytics` for the dashboard.

---

## Environment variables (optional)

If you use **Resend** for weekly-goal emails:

1. In Netlify: **Site → Site configuration → Environment variables**.
2. Add:
   - `RESEND_API_KEY` = your Resend API key
   - `RESEND_FROM_EMAIL` = optional verified sender (e.g. `FitHero <noreply@fitherokids.app>`)

Then trigger a **Clear cache and deploy site** so the build uses the new variables.

---

## After the first deploy

- Every **git push** to `main` will trigger a new deploy.
- You can also trigger a deploy from Netlify’s **Deploys** tab.

You’re done. Share the link and use `/admin` and `/admin/analytics` as needed.

# 📧 Email Notifications Setup Guide

## Quick Setup Steps

### 1. Sign up for Resend (Free)

1. Go to **https://resend.com**
2. Click **"Sign Up"** (or "Get Started")
3. Create a free account (no credit card required for free tier)

### 2. Get Your API Key

1. After signing in, go to **https://resend.com/api-keys**
2. Click **"Create API Key"** button
3. Give it a name (e.g., "Exercise Game App")
4. Copy the API key (it starts with `re_`)

### 3. Add API Key to Your Project

1. Open the file `.env.local` in the root of your project
2. Paste your API key after `RESEND_API_KEY=`
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```
3. Save the file

### 4. Restart Your Development Server

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## Testing Email Notifications

1. Open the app in your browser
2. Click the ⚙️ button next to "Weekly Goal"
3. Select **"Email"** as the notification method
4. Enter your email address
5. Set a weekly goal (e.g., 5 stars)
6. Complete challenges to earn stars
7. When the goal is reached, you should receive an email!

## Troubleshooting

### "Email service not configured" error
- Make sure `.env.local` exists and has `RESEND_API_KEY=re_...`
- Restart the dev server after adding the key
- Check that the API key starts with `re_`

### Email not sending
- Check the browser console for error messages
- Verify your API key is correct in Resend dashboard
- Make sure you're using the latest API key (they can expire)

### Using a custom domain (optional)
- In Resend dashboard, go to "Domains"
- Add and verify your domain
- Update `RESEND_FROM_EMAIL` in `.env.local`:
  ```
  RESEND_FROM_EMAIL=Exercise Game <noreply@yourdomain.com>
  ```

## Free Tier Limits

Resend free tier includes:
- 3,000 emails per month
- 100 emails per day
- Perfect for testing and small projects!

## Production Deployment

When deploying to Vercel/Netlify:
1. Go to your project settings
2. Add environment variable: `RESEND_API_KEY`
3. Paste your API key value
4. Redeploy

**Important**: Never commit `.env.local` to git - it's already in `.gitignore`

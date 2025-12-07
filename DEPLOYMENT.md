# VoiceUp - Deployment Guide

Complete guide for deploying VoiceUp to production.

## Prerequisites

- Completed local setup
- GitHub account (for code hosting)
- Vercel or Netlify account (free tier)

## Option 1: Deploy to Vercel (Recommended)

Vercel provides the best experience for React/Vite applications.

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - VoiceUp"
git branch -M main
git remote add origin https://github.com/yourusername/voiceup.git
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Via Web Interface (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
6. Click "Deploy"

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts and set environment variables when asked
```

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Option 2: Deploy to Netlify

### Step 1: Build the Project

```bash
npm run build
```

This creates a `dist` folder with your production build.

### Step 2: Deploy to Netlify

#### Via Web Interface

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" > "Deploy manually"
3. Drag and drop the `dist` folder
4. Your site is live!

#### Via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Step 3: Configure Environment Variables

1. In Netlify dashboard, go to your site
2. Click "Site settings" > "Environment variables"
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy the site

## Option 3: Deploy to GitHub Pages

GitHub Pages is free but requires some additional configuration.

### Step 1: Update vite.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/voiceup/', // Replace with your repo name
});
```

### Step 2: Add Deployment Script

In `package.json`, add:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Step 3: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 4: Deploy

```bash
npm run deploy
```

Your site will be live at: `https://yourusername.github.io/voiceup/`

## Backend (Supabase) - Already Deployed!

Your Supabase backend is automatically deployed and managed by Supabase. No additional configuration needed!

### Supabase Production Checklist

1. **Enable Email Auth** (if using email confirmation):
   - Go to Authentication > Settings
   - Configure email templates

2. **Set Up Custom Domain** (optional):
   - Go to Project Settings > Custom Domains
   - Add your domain

3. **Configure Storage**:
   - Storage buckets are already configured
   - Policies are set up for secure access

4. **Database Backup**:
   - Supabase automatically backs up your database
   - Enable point-in-time recovery in Project Settings

## Post-Deployment Checklist

- [ ] Test all user flows (citizen, authority, admin)
- [ ] Create test accounts for each role
- [ ] Test issue creation and image uploads
- [ ] Test upvoting and commenting
- [ ] Test status updates (authority)
- [ ] Test user management (admin)
- [ ] Test on mobile devices
- [ ] Check that environment variables are correct
- [ ] Verify database RLS policies are working
- [ ] Test authentication flow
- [ ] Check that images upload correctly

## Performance Optimization

### Enable Caching

Add this to your `vercel.json` (if using Vercel):

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Image Optimization

Consider adding image optimization:

1. In Supabase, enable image transformations
2. Use Supabase's CDN URLs for images
3. Set up responsive images with srcset

## Monitoring

### Vercel Analytics

1. In Vercel dashboard, go to your project
2. Click "Analytics"
3. Enable Web Analytics (free)

### Supabase Monitoring

1. In Supabase dashboard, go to "Reports"
2. Monitor:
   - API requests
   - Database performance
   - Storage usage
   - Authentication activity

## Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Always use environment variables in deployment platform

2. **Rotate API keys regularly**
   - Can be done in Supabase Project Settings

3. **Monitor RLS policies**
   - Ensure policies are restrictive
   - Test with different user roles

4. **Enable rate limiting**
   - Configure in Supabase dashboard if needed

5. **Review user permissions regularly**
   - Use admin dashboard to audit user roles

## Updating Your Deployment

### Vercel

Push to GitHub, and Vercel auto-deploys:

```bash
git add .
git commit -m "Update feature"
git push
```

### Netlify CLI

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Manual Netlify

1. Build locally: `npm run build`
2. Drag and drop `dist` folder to Netlify dashboard

## Rollback

### Vercel

1. Go to "Deployments"
2. Find the previous working deployment
3. Click "Promote to Production"

### Netlify

1. Go to "Deploys"
2. Find the previous deployment
3. Click "Publish deploy"

## Custom Domain Setup

### Buy a Domain

- Namecheap (~$10/year)
- Google Domains (~$12/year)
- Cloudflare (~$10/year)

### Configure DNS

1. In your domain registrar, set nameservers to:
   - Vercel: Add A record pointing to Vercel IP
   - Netlify: Add CNAME record pointing to your Netlify URL

2. In deployment platform, add custom domain

3. Wait for SSL certificate to be issued (automatic)

## Cost Estimate

### Free Tier (Recommended for ASEP)

- **Supabase:** Free (500MB database, 1GB storage, 50,000 monthly active users)
- **Vercel:** Free (100GB bandwidth, unlimited deployments)
- **Total:** $0/month

### Paid Tier (If Needed Later)

- **Supabase Pro:** $25/month (8GB database, 100GB storage)
- **Vercel Pro:** $20/month (1TB bandwidth)
- **Custom Domain:** $10-15/year
- **Total:** ~$50/month + domain

## Troubleshooting

### "Environment variables not found"

Add variables in deployment platform, then redeploy.

### "Database connection failed"

Check Supabase project is active and URL is correct.

### "Images not uploading"

Verify storage bucket exists and policies are correct.

### "404 on page refresh"

Add a `_redirects` file (Netlify) or configure Vercel rewrites.

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Supabase: [supabase.com/docs](https://supabase.com/docs)

## Demo Site

After deployment, you'll have:
- **Live URL:** `https://voiceup.vercel.app` (or your custom domain)
- **API:** Handled by Supabase (already configured)
- **Database:** Supabase hosted (production ready)

Perfect for demonstrating to your professors and peers!

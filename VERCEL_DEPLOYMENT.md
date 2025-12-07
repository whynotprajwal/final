# VoiceUp - Vercel Deployment Guide

## Quick Start (5 Minutes)

This guide will help you deploy the VoiceUp React Frontend to Vercel in just a few minutes.

---

## Prerequisites

✅ **Required**:
- GitHub account with access to whynotprajwal/final repository
- Vercel account (free tier available at https://vercel.com)
- Supabase project URL and API key

---

## Step 1: Create Vercel Account & Connect GitHub

### 1.1 Sign Up for Vercel
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Complete account setup

### 1.2 Import Repository
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for `whynotprajwal/final`
4. Click "Import"

---

## Step 2: Configure Environment Variables

### 2.1 Get Your Supabase Credentials
1. Log in to Supabase dashboard
2. Select your VoiceUp project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Public Key** (VITE_SUPABASE_ANON_KEY)

### 2.2 Add to Vercel Dashboard
1. In the import screen, under "Environment Variables", add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example**:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Framework Detection
- **Framework Preset**: Select `Other` or let Vercel auto-detect
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## Step 3: Deploy!

### 3.1 Start Deployment
1. Click **"Deploy"** button
2. Vercel will:
   - Install dependencies
   - Run build command
   - Generate optimized build
   - Deploy to CDN

### 3.2 Monitor Deployment
- You'll see build logs in real-time
- Deployment typically completes in 2-3 minutes
- Status shows: `Success ✓` when complete

### 3.3 Access Your App
- Vercel assigns a URL like: `https://final-whynotprajwal.vercel.app`
- Click the URL or visit the Deployments tab to access your app

---

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain
1. In Vercel dashboard, go to **Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `voiceup.yourdomain.com`)
4. Follow DNS configuration instructions

### 4.2 DNS Setup
- For Namecheap, GoDaddy, etc: Add CNAME record
  - Name: `voiceup`
  - Value: `cname.vercel-dns.com`
  - TTL: 3600
- DNS changes take 15-30 minutes to propagate

---

## Testing the Deployment

### Verify All Features
- [ ] Navigate to the deployed URL
- [ ] Try citizen login at `/login`
- [ ] Try authority login at `/authority/login`
- [ ] Access dashboard pages
- [ ] Test issue listing and filtering
- [ ] Verify Supabase connection (check browser console)

### Check Build Logs
1. Go to Deployments tab
2. Click on the latest deployment
3. View build logs for any warnings/errors

---

## Continuous Deployment Setup

### Auto-Deploy on GitHub Push
Vercel automatically deploys when you push to the main branch!

**How it works**:
1. Make changes locally
2. Commit: `git commit -m "message"`
3. Push: `git push origin main`
4. Vercel automatically:
   - Detects the push
   - Runs build
   - Deploys new version
   - Generates preview URL for PRs

### Preview URLs for Pull Requests
- When you create a PR, Vercel generates a preview URL
- Share preview with team for testing
- Merge to main when ready

---

## Environment Variables Reference

### Required Variables
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

### Optional Variables (if needed)
```bash
VITE_APP_NAME=VoiceUp
VITE_APP_VERSION=1.0.0
```

---

## Troubleshooting

### Issue: Build Fails
**Solution**: 
1. Check build logs in Vercel dashboard
2. Look for TypeScript errors
3. Ensure all dependencies in package.json
4. Run locally: `npm run build`

### Issue: Blank Page
**Solution**:
1. Check browser console for errors
2. Verify environment variables are set
3. Check Supabase connection
4. Ensure .env variables use `VITE_` prefix

### Issue: Supabase Connection Error
**Solution**:
1. Verify URLs are correct (with https://)
2. Check Anon key is correct
3. Verify Row-Level Security (RLS) policies allow read access
4. Check browser console for specific error

### Issue: Routing Not Working
**Solution**:
1. Vercel auto-configures rewrites for SPAs
2. If routing breaks, add `vercel.json` file (see below)

---

## vercel.json Configuration

If needed, create a `vercel.json` file in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Performance Optimization

### Vercel Features (Automatic)
- ✅ CDN edge caching
- ✅ Automatic compression (Gzip, Brotli)
- ✅ Image optimization
- ✅ Serverless functions
- ✅ DDoS protection

### Build Optimization
- Vite uses automatic code splitting
- Production build is already optimized
- Bundle size: ~150-200KB (gzipped)

### Monitoring
1. Go to **Analytics** tab
2. View:
   - Page loads
   - Serverless function usage
   - Edge network performance
   - Error rates

---

## Security Best Practices

✅ **Already Configured**:
- HTTPS enabled by default
- Environment variables encrypted
- Supabase public key is safe (RLS handles security)
- Never commit `.env` files

⚠️ **Important**:
- Keep Supabase URL and Anon Key in Vercel environment variables
- Don't share Supabase service role key
- Configure RLS policies properly in Supabase

---

## Rollback to Previous Version

1. Go to **Deployments** tab
2. Find a previous successful deployment
3. Click **"..."** menu
4. Select **"Promote to Production"**
5. App instantly reverts to that version

---

## View Logs and Monitoring

### Real-time Logs
1. Deployments → Select deployment
2. View build and runtime logs

### Function Logs
1. Analytics → Serverless Functions
2. See function execution details

### Error Tracking
1. Check browser DevTools
2. Check Vercel Function logs
3. Check Supabase logs

---

## Team Collaboration

### Invite Team Members
1. Settings → Team
2. Click **"Invite"**
3. Enter email address
4. Set permissions (Admin, Member, Viewer)

### Shared Environment
- All team members see same URL
- Deployments synchronized across team
- Everyone can promote versions

---

## Useful Links

- 🌐 **Vercel Dashboard**: https://vercel.com/dashboard
- 📚 **Vercel Docs**: https://vercel.com/docs
- 🔐 **Supabase**: https://app.supabase.com
- 🛠️ **GitHub**: https://github.com/whynotprajwal/final

---

## Support & Help

**If you encounter issues**:
1. Check this guide's Troubleshooting section
2. Check Vercel docs: https://vercel.com/docs
3. Check Supabase docs: https://supabase.com/docs
4. Check project README.md

---

## Summary

✅ **Deployment Complete!**

Your VoiceUp app is now live on Vercel:
- **Live URL**: `https://[your-project].vercel.app`
- **Auto-deploy**: Enabled on main branch
- **Preview URLs**: Generated for pull requests
- **Performance**: Optimized with CDN edge caching
- **Security**: HTTPS and environment variables encrypted

**Next**: Test the deployed app and share the link with your team!

---

**Deployment Date**: December 6, 2025
**VoiceUp Version**: Authority Portal Ready
**Stack**: React + TypeScript + Vite + Supabase

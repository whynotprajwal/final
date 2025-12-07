# VoiceUp - Quick Start Guide

Get up and running with VoiceUp in 5 minutes!

## Prerequisites

- Node.js installed (v18+)
- A Supabase account (free tier)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - Project name: `voiceup`
   - Database password: (create a strong password)
   - Region: Choose closest to you
4. Click "Create new project" and wait 2 minutes

### 3. Get Your Supabase Credentials

1. In your Supabase project, click the "Settings" icon (gear)
2. Go to "API"
3. Copy:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - anon/public key (starts with `eyJhbGc...`)

### 4. Configure Environment

1. Create `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and paste your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Set Up Database

The database schema is already created automatically via migrations when you run the app.
All tables, indexes, and security policies are set up for you!

### 6. Run the Application

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Create Test Accounts

### Create a Citizen Account

1. Go to `/signup` or click "Get Started"
2. Fill in the form:
   - Name: Test Citizen
   - Email: citizen@test.com
   - Password: test123456
3. Click "Sign Up"

### Create an Authority Account

1. Sign up with different credentials:
   - Name: Test Authority
   - Email: authority@test.com
   - Password: test123456
2. After signup, go to Supabase Dashboard
3. Click "Table Editor" > "profiles"
4. Find the authority@test.com user
5. Edit the row and change `role` to `AUTHORITY`
6. Log out and log back in

### Create an Admin Account

1. Sign up with different credentials:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: test123456
2. Go to Supabase Dashboard
3. Click "Table Editor" > "profiles"
4. Find the admin@test.com user
5. Edit the row and change `role` to `ADMIN`
6. Log out and log back in

## Add Sample Data (Optional)

To populate your database with sample issues:

1. Open Supabase Dashboard
2. Go to "SQL Editor"
3. Open `seed-data.sql` from the project folder
4. Replace `YOUR_USER_ID_HERE` with your actual user ID
   - To get your user ID: Run `SELECT id FROM profiles WHERE email = 'your-email@test.com';`
5. Click "Run"

## Test the Application

### As a Citizen:
1. Log in as citizen@test.com
2. Click "Report Issue" and create a new issue
3. Browse issues and upvote them
4. Click on an issue to see details
5. Verify issues and add comments
6. Go to "Dashboard" to see your stats

### As an Authority:
1. Log in as authority@test.com
2. Click "Dashboard" to see issues
3. Update issue status
4. Add comments with updates

### As an Admin:
1. Log in as admin@test.com
2. Click "Admin Panel"
3. View all users and change roles
4. See system-wide analytics

## Common Issues

### "Missing Supabase environment variables"

Make sure your `.env` file exists and has correct values.

### "Failed to load"

Check that your Supabase project is active and credentials are correct.

### Build errors

Try:
```bash
rm -rf node_modules
npm install
npm run build
```

## Next Steps

- Customize the design and colors
- Add more features
- Deploy to Vercel or Netlify (see DEPLOYMENT.md)
- Show it off to your professors!

## Need Help?

Check the main README.md for detailed documentation.

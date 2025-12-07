# VoiceUp - Civic Issue Reporting & Escalation Platform

A full-stack web application for reporting, tracking, and resolving civic issues. Built for academic purposes (ASEP) with React, Supabase, and TypeScript.

## Features

### For Citizens
- Report civic issues with photos, location, and detailed descriptions
- Browse and filter issues by category and status
- Upvote issues to increase visibility
- Verify issues to help escalate them to authorities
- Track personal contributions and achievements in a dedicated dashboard
- Comment on issues and engage with the community

### For Authorities
- View and manage assigned issues
- Update issue status (In Progress, Resolved)
- Add comments and updates for citizens
- Track resolution metrics and performance

### For Admins
- Manage all users and their roles
- View comprehensive system analytics
- Monitor platform-wide statistics
- Change user permissions

## Tech Stack

- **Frontend:** React 18, TypeScript, TailwindCSS, Vite
- **Backend:** Supabase (PostgreSQL database, Authentication, Storage)
- **Icons:** Lucide React
- **Styling:** Tailwind CSS with custom design system

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier works)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd project
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be provisioned (takes ~2 minutes)
4. Go to Project Settings > API
5. Copy your project URL and anon/public key

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

The database schema has already been created via migration. It includes:

- **profiles** - User profiles with roles (CITIZEN, AUTHORITY, ADMIN)
- **issues** - Civic issues with status tracking
- **upvotes** - Issue upvoting system
- **verifications** - Community verification system
- **comments** - Discussion threads for issues
- **status_history** - Complete audit trail of status changes

All tables have Row Level Security (RLS) enabled for secure access control.

### 5. Create Demo Users

To test the application, you'll need to create users for each role:

1. **Citizen Account:**
   - Sign up at `/signup`
   - Use role: CITIZEN (default)

2. **Authority Account:**
   - Sign up at `/signup`
   - After signup, update the role in Supabase dashboard:
     - Go to Table Editor > profiles
     - Find the user and change role to "AUTHORITY"

3. **Admin Account:**
   - Sign up at `/signup`
   - After signup, update the role in Supabase dashboard:
     - Go to Table Editor > profiles
     - Find the user and change role to "ADMIN"

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
project/
├── src/
│   ├── components/          # Reusable components (none yet)
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── hooks/               # Custom React hooks
│   │   └── useNavigate.ts   # Navigation utilities
│   ├── lib/                 # Library configurations
│   │   ├── supabase.ts      # Supabase client
│   │   └── database.types.ts # TypeScript types
│   ├── pages/               # Page components
│   │   ├── Landing.tsx      # Landing page
│   │   ├── Login.tsx        # Login page
│   │   ├── Signup.tsx       # Signup page
│   │   ├── IssuesList.tsx   # Browse issues
│   │   ├── IssueDetails.tsx # Issue details & timeline
│   │   ├── ReportIssue.tsx  # Report new issue
│   │   ├── CitizenDashboard.tsx
│   │   ├── AuthorityDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (create this)
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md                # This file
```

## User Flows

### Citizen Flow
1. Sign up / Login
2. Browse existing issues on `/issues`
3. Report a new issue at `/report`
4. Upvote issues you care about
5. Verify issues to help them get attention
6. Track your contributions at `/dashboard/citizen`

### Authority Flow
1. Login with authority credentials
2. View assigned issues at `/dashboard/authority`
3. Update issue status (In Progress, Resolved)
4. Add comments with updates
5. Track resolution metrics

### Admin Flow
1. Login with admin credentials
2. Access admin panel at `/dashboard/admin`
3. Manage user roles
4. View system-wide analytics
5. Monitor platform health

## API Endpoints (via Supabase)

All API calls are handled through Supabase client:

### Authentication
- `supabase.auth.signUp()` - Register new user
- `supabase.auth.signInWithPassword()` - Login
- `supabase.auth.signOut()` - Logout

### Issues
- `supabase.from('issues').select()` - Get issues
- `supabase.from('issues').insert()` - Create issue
- `supabase.from('issues').update()` - Update issue

### Upvotes
- `supabase.from('upvotes').insert()` - Upvote issue
- `supabase.from('upvotes').delete()` - Remove upvote

### Comments
- `supabase.from('comments').insert()` - Add comment
- `supabase.from('comments').select()` - Get comments

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## Deployment

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Backend (Supabase)

The backend is already hosted on Supabase. No additional deployment needed.

### Alternative: Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

4. Set environment variables in Netlify dashboard

## Security Notes

- All database tables have Row Level Security (RLS) enabled
- Users can only access data they're authorized to see
- Image uploads are scoped to user folders
- Authentication tokens are securely managed by Supabase
- All API requests require authentication

## Features Demo

### Issue Categories
- Garbage
- Roads
- Water
- Electricity
- Safety
- Other

### Issue Statuses
- **OPEN** - Newly reported
- **VERIFIED** - Verified by 3+ citizens
- **IN_PROGRESS** - Being worked on by authorities
- **RESOLVED** - Fixed and closed

### Achievement System
Citizens earn badges based on contributions:
- **New Citizen** - Just started
- **Bronze Reporter** - 1+ issues reported
- **Silver Reporter** - 5+ issues reported
- **Gold Reporter** - 10+ issues reported

## Troubleshooting

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Connection Issues
- Verify `.env` file has correct credentials
- Check Supabase project is active
- Ensure RLS policies are properly configured

### Image Upload Issues
- Verify storage bucket `issue-images` exists
- Check storage policies are enabled
- Ensure file size is under limit

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Credits

Built for ASEP (Academic Project) as a demonstration of full-stack web development capabilities.

## License

MIT License - Free to use for academic and learning purposes.

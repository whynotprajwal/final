# VoiceUp Civic Issue Reporting Platform - Comprehensive Fixes

## Overview
This document outlines ALL fixes needed for the VoiceUp platform to be fully functional end-to-end.

## ISSUE #1: Foreign Key Constraint Error (FIXED)
**Status**: COMPLETED
**Error**: insert or update on table "profiles" violates foreign key constraint
**Root Cause**: loadProfile() was using .eq('id') instead of .eq('user_id')
**Fix Applied**: Updated AuthContext.tsx line 58 to use .eq('user_id', userid)

## ISSUE #2: Email Validation Not Clearing Errors
**Status**: COMPLETED
**Error**: Red alert persists after signup form loads
**Root Cause**: useEffect not clearing alert after form renders
**Fix Applied**: Added useEffect in Signup.tsx to clear alert on component mount

## ISSUE #3: Supabase Storage Bucket Missing
**Status**: PENDING
**Error**: Image uploads fail in ReportIssue component
**Root Cause**: Storage bucket not created in Supabase
**Fix Needed**:
1. Create bucket named "issue-images" in Supabase
2. Set bucket visibility to Public
3. Add RLS policy for authenticated users to upload

## ISSUE #4: Missing RLS Policies
**Status**: PENDING
**Error**: API calls fail with permission denied
**Tables affected**: profiles, issues, comments
**Fix Needed**:
1. Enable RLS on all tables
2. Create SELECT policy: Allow authenticated users to read own data
3. Create INSERT policy: Allow authenticated users to create own data
4. Create UPDATE policy: Allow authenticated users to update own data
5. Create DELETE policy: Allow authenticated users to delete own data

## ISSUE #5: Backend API Endpoints
**Status**: PENDING
**Missing Endpoints**:
1. POST /api/issues - Create new issue report
2. GET /api/issues - List all issues
3. GET /api/issues/:id - Get single issue
4. POST /api/comments - Add comment to issue
5. POST /api/auth/signup - User registration
6. POST /api/auth/login - User login

**Fix Needed**:
- Create api/ folder with route handlers
- Implement Supabase queries
- Add error handling
- Add authentication middleware

## ISSUE #6: Frontend API Integration
**Status**: PENDING
**Problem**: Components not properly calling backend APIs
**Fix Needed**:
1. ReportIssue.tsx - Implement proper API call for issue submission
2. IssueList.tsx - Implement proper API call for fetching issues
3. IssueDetail.tsx - Implement proper API call for fetching single issue
4. Signup.tsx - Verify auth API integration
5. Add global error handling middleware

## ISSUE #7: Form Validation
**Status**: PENDING
**Problem**: Forms not validating input properly
**Fix Needed**:
1. Add client-side validation for all forms
2. Display validation errors to user
3. Prevent form submission on validation errors
4. Add loading states during submission

## ISSUE #8: Project Structure
**Status**: PENDING
**Current State**: Files scattered in root
**Recommended Structure**:
```
final/
├── src/
│   ├── components/
│   │   ├── Signup.tsx
│   │   ├── IssueList.tsx
│   │   ├── ReportIssue.tsx
│   │   └── IssueDetail.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── styles/
│   └── App.tsx
├── pages/
│   └── api/
│       ├── issues.ts
│       ├── comments.ts
│       └── auth/
│           └── signup.ts
├── public/
├── docs/
│   └── API_DOCUMENTATION.md
├── .env.local
├── package.json
└── tsconfig.json
```

## Testing Checklist
- [ ] User signup with valid email
- [ ] User signup with invalid email (validation error)
- [ ] User login with valid credentials
- [ ] User login with invalid credentials (error)
- [ ] Create new issue report
- [ ] Upload image with issue
- [ ] View issue list
- [ ] View issue details
- [ ] Add comment to issue
- [ ] Filter issues by category
- [ ] Search issues
- [ ] Delete own issue
- [ ] Cannot delete others' issues

## Deployment Steps
1. Fix all database issues (RLS, storage)
2. Create all API endpoints
3. Fix frontend components
4. Run full test suite
5. Deploy to Vercel
6. Test live application

## Next Steps
1. Start with Supabase storage bucket creation
2. Implement RLS policies
3. Create backend API endpoints
4. Connect frontend to APIs
5. Test complete workflow

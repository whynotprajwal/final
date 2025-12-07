# Authority Portal Features

## Overview
VoiceUp now includes a dedicated **Authority Login Portal** and enhanced **Authority Dashboard** for government and municipal authorities to efficiently manage, verify, and resolve civic issues reported by citizens.

## New Features Implemented

### 1. Dedicated Authority Login Portal
**File**: `src/pages/AuthorityLogin.tsx`

#### Features:
- **Role-Based Authentication**: Only users with the 'AUTHORITY' role can access the portal
- **Enhanced UI**: Professional authority-specific interface with:
  - Building icon representing government/authority
  - Clear feature list highlighting key capabilities
  - Quick redirect option to citizen login
  - Error handling and validation

#### Login Flow:
1. Authority user enters email and password
2. System verifies credentials via Supabase authentication
3. Role validation ensures only AUTHORITY users can proceed
4. Non-authority users are logged out and shown an error message
5. Valid authorities are redirected to the Authority Dashboard

#### URL: `/authority/login`

### 2. Enhanced Authority Dashboard
**File**: `src/pages/AuthorityDashboard.tsx`

#### Key Features:

**Issue Management**:
- View all assigned civic issues
- Filter issues by status (VERIFIED, IN_PROGRESS, RESOLVED)
- Display issue details including:
  - Issue title, description, and category
  - Location information
  - Reporter name and report date
  - Current status with color-coded badges

**Issue Verification & Status Update**:
- **Verify Issues**: Authorities can review and verify reported issues
- **Update Status**: Change issue status from:
  - `PENDING` → `VERIFIED` (after verification)
  - `VERIFIED` → `IN_PROGRESS` (start working on issue)
  - `IN_PROGRESS` → `RESOLVED` (issue resolved)

**Progress Tracking**:
- Add detailed comments for each status update
- Comments are stored for audit trail and transparency
- Automatic assignment tracking

**Dashboard Statistics**:
- Total Issues count
- Verified Issues count
- In Progress Issues count
- Resolved Issues count

### 3. Routing Integration
**File**: `src/App.tsx`

#### Changes Made:
- Added import for `AuthorityLogin` component
- Added route handler for `/authority/login`
- Seamless navigation between citizen login and authority login

#### Route Structure:
```
/login                    - Citizens & General users
/authority/login          - Authority portal access
/dashboard/citizen        - Citizen dashboard
/dashboard/authority      - Authority dashboard (protected)
/dashboard/admin          - Admin dashboard (protected)
```

## Usage Guide

### For Authorities:

#### Step 1: Access Authority Login
Navigate to `/authority/login` or click the "Authority Login" option on the main login page.

#### Step 2: Authenticate
- Enter your authority email
- Enter your password
- Click "Sign In as Authority"

#### Step 3: View Issues
On the Authority Dashboard, you'll see:
- Summary statistics at the top
- List of issues that need attention
- Status badges showing issue condition

#### Step 4: Verify Issues
- Review issue details
- Click "Update Status" on an issue
- Select "IN_PROGRESS" to start verification
- Optionally add a verification comment

#### Step 5: Update Status
- Click "Update Status" on an in-progress issue
- Select "RESOLVED" to mark as complete
- Add final comment (optional) describing resolution
- Click "Update Status" to confirm

#### Step 6: Track Progress
- Dashboard statistics update in real-time
- See resolved issues count increase
- Monitor remaining open issues

## Technical Details

### Database Integration
The system integrates with Supabase:
- **Authentication**: Supabase Auth with email/password
- **Role Verification**: Queries `profiles` table for role
- **Issue Management**: CRUD operations on `issues` table
- **Comments**: Stores progress updates in `comments` table
- **Status History**: Tracked in `status_history` table (optional)

### Status Workflow
```
PENDING 
  ↓
VERIFIED (after authority verification)
  ↓
IN_PROGRESS (work has started)
  ↓
RESOLVED (work completed)
```

### Role-Based Access Control
- `/authority/login`: Requires no prior auth (public)
- `/dashboard/authority`: Requires AUTHORITY role
- Comments and updates: Tracked with authority user_id

## Security Features

1. **Role Validation**: Only AUTHORITY role users can access the dashboard
2. **Row-Level Security (RLS)**: Supabase RLS policies protect data
3. **Session Management**: Automatic logout on role mismatch
4. **Audit Trail**: All actions logged with timestamp and user ID

## Future Enhancements

1. **Issue Assignment**: Assign issues to specific authority staff
2. **Photo Attachments**: Allow authorities to add resolution photos
3. **Notifications**: Notify citizens of status updates
4. **Reports**: Generate authority performance reports
5. **SLA Tracking**: Monitor resolution time targets
6. **Bulk Operations**: Update multiple issues at once
7. **Export Functionality**: Export issues to CSV/PDF
8. **Integration**: Connect with municipal systems

## API Endpoints Used

### Authentication
- `supabase.auth.signInWithPassword(email, password)`
- `supabase.auth.signOut()`

### Data Queries
- GET issues with filters and sorting
- UPDATE issue status and assignment
- INSERT comments for progress tracking
- SELECT profile role for verification

## Testing the Feature

1. Create test authority account with role='AUTHORITY'
2. Navigate to `/authority/login`
3. Login with authority credentials
4. Create test civic issues as a citizen
5. Verify issue from authority dashboard
6. Update status through workflow
7. Verify citizen sees updated status

## Troubleshooting

**Issue**: Cannot login as authority
- Check that user role is set to 'AUTHORITY' in profiles table
- Verify email and password are correct
- Check browser console for error messages

**Issue**: Issues not showing in dashboard
- Verify issues are in database
- Check Supabase RLS policies allow read access
- Ensure filter conditions match issue statuses

**Issue**: Status update fails
- Verify user has AUTHORITY role
- Check database connection
- Ensure status value is valid (IN_PROGRESS, RESOLVED)

## Contributing

When extending authority features:
1. Maintain role-based access patterns
2. Add appropriate error handling
3. Update RLS policies as needed
4. Document new workflows
5. Add user feedback (toasts/notifications)

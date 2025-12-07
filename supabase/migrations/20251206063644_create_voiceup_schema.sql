/*
  # VoiceUp Civic Issue Reporting Platform - Database Schema

  ## Overview
  Complete database schema for the VoiceUp platform including user profiles, 
  civic issues, upvotes, verifications, comments, and status tracking.

  ## New Tables

  1. **profiles**
     - `id` (uuid, FK to auth.users) - User identifier
     - `email` (text) - User email
     - `name` (text) - User display name
     - `role` (text) - User role: CITIZEN, AUTHORITY, or ADMIN
     - `created_at` (timestamptz) - Account creation timestamp

  2. **issues**
     - `id` (uuid, PK) - Issue identifier
     - `title` (text) - Issue title
     - `description` (text) - Detailed description
     - `category` (text) - Issue category (Garbage, Roads, Water, etc.)
     - `location` (text) - Location description
     - `status` (text) - Current status (OPEN, VERIFIED, IN_PROGRESS, RESOLVED)
     - `image_url` (text, nullable) - Uploaded image URL
     - `user_id` (uuid, FK) - Reporter's user ID
     - `assigned_to` (uuid, FK, nullable) - Assigned authority user ID
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  3. **upvotes**
     - `id` (uuid, PK) - Upvote identifier
     - `issue_id` (uuid, FK) - Related issue
     - `user_id` (uuid, FK) - User who upvoted
     - `created_at` (timestamptz) - Upvote timestamp
     - Unique constraint on (issue_id, user_id)

  4. **verifications**
     - `id` (uuid, PK) - Verification identifier
     - `issue_id` (uuid, FK) - Related issue
     - `user_id` (uuid, FK) - User who verified
     - `created_at` (timestamptz) - Verification timestamp
     - Unique constraint on (issue_id, user_id)

  5. **comments**
     - `id` (uuid, PK) - Comment identifier
     - `issue_id` (uuid, FK) - Related issue
     - `user_id` (uuid, FK) - Comment author
     - `content` (text) - Comment content
     - `created_at` (timestamptz) - Comment timestamp

  6. **status_history**
     - `id` (uuid, PK) - History entry identifier
     - `issue_id` (uuid, FK) - Related issue
     - `status` (text) - New status
     - `changed_by` (uuid, FK) - User who changed status
     - `comment` (text, nullable) - Optional comment about status change
     - `image_url` (text, nullable) - Optional proof image URL
     - `created_at` (timestamptz) - Change timestamp

  ## Security
  - Enable RLS on all tables
  - Citizens can create issues and view public issues
  - Authorities can update assigned issues
  - Admins have full access
  - Users can only upvote/verify once per issue
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'AUTHORITY', 'ADMIN')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Garbage', 'Roads', 'Water', 'Electricity', 'Safety', 'Other')),
  location text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED')),
  image_url text,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Create upvotes table
CREATE TABLE IF NOT EXISTS upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(issue_id, user_id)
);

ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Create verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(issue_id, user_id)
);

ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create status_history table
CREATE TABLE IF NOT EXISTS status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('OPEN', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED')),
  changed_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Issues RLS Policies
CREATE POLICY "Anyone can view issues"
  ON issues FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create issues"
  ON issues FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own issues"
  ON issues FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authorities can update assigned issues"
  ON issues FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('AUTHORITY', 'ADMIN'))
  )
  WITH CHECK (
    auth.uid() = assigned_to OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('AUTHORITY', 'ADMIN'))
  );

-- Upvotes RLS Policies
CREATE POLICY "Anyone can view upvotes"
  ON upvotes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create upvotes"
  ON upvotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own upvotes"
  ON upvotes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Verifications RLS Policies
CREATE POLICY "Anyone can view verifications"
  ON verifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create verifications"
  ON verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Comments RLS Policies
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Status History RLS Policies
CREATE POLICY "Anyone can view status history"
  ON status_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authorities can create status history"
  ON status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('AUTHORITY', 'ADMIN'))
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS issues_user_id_idx ON issues(user_id);
CREATE INDEX IF NOT EXISTS issues_assigned_to_idx ON issues(assigned_to);
CREATE INDEX IF NOT EXISTS issues_status_idx ON issues(status);
CREATE INDEX IF NOT EXISTS issues_category_idx ON issues(category);
CREATE INDEX IF NOT EXISTS issues_created_at_idx ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS upvotes_issue_id_idx ON upvotes(issue_id);
CREATE INDEX IF NOT EXISTS verifications_issue_id_idx ON verifications(issue_id);
CREATE INDEX IF NOT EXISTS comments_issue_id_idx ON comments(issue_id);
CREATE INDEX IF NOT EXISTS status_history_issue_id_idx ON status_history(issue_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for issues table
DROP TRIGGER IF EXISTS update_issues_updated_at ON issues;
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create status history when issue status changes
CREATE OR REPLACE FUNCTION create_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO status_history (issue_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO status_history (issue_id, status, changed_by)
    VALUES (NEW.id, NEW.status, NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic status history
DROP TRIGGER IF EXISTS auto_status_history ON issues;
CREATE TRIGGER auto_status_history
  AFTER INSERT OR UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION create_status_history();

-- Create storage bucket for issue images
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-images', 'issue-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for issue images
CREATE POLICY "Anyone can view issue images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'issue-images');

CREATE POLICY "Authenticated users can upload issue images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'issue-images');

CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]);
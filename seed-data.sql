-- VoiceUp Sample Seed Data
-- Run this SQL in your Supabase SQL Editor after setting up the schema
-- and creating at least one test user account

-- NOTE: Before running this script:
-- 1. Create a test user account via the signup page
-- 2. Get the user ID from the profiles table
-- 3. Replace 'YOUR_USER_ID_HERE' below with your actual user ID

-- Sample issues for demonstration
INSERT INTO issues (title, description, category, location, status, user_id)
VALUES
  (
    'Overflowing garbage bins on Main Street',
    'The garbage bins near the community center have been overflowing for the past week. This is creating a health hazard and attracting pests. Immediate attention is needed.',
    'Garbage',
    'Main Street near Community Center',
    'OPEN',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Large pothole on Oak Avenue',
    'There is a massive pothole on Oak Avenue that has been growing larger. It is causing damage to vehicles and is a safety hazard for cyclists. The pothole is approximately 2 feet wide and 6 inches deep.',
    'Roads',
    'Oak Avenue between 5th and 6th Street',
    'VERIFIED',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Water leak in residential area',
    'Continuous water leak observed at the corner of Elm Street and Park Road. Water has been flowing for 3 days now, causing wastage and potential damage to the road infrastructure.',
    'Water',
    'Corner of Elm Street and Park Road',
    'IN_PROGRESS',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Street light not working',
    'The street light near the school crossing has not been working for two weeks. This creates a dangerous situation for children and pedestrians during early morning and evening hours.',
    'Electricity',
    'School crossing on Maple Avenue',
    'OPEN',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Broken sidewalk causing trip hazard',
    'Several concrete slabs on the sidewalk are broken and uneven, creating trip hazards for pedestrians, especially elderly residents and parents with strollers.',
    'Roads',
    'Lincoln Boulevard sidewalk',
    'VERIFIED',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Broken traffic signal',
    'The traffic signal at the intersection of 1st Avenue and Washington Street has been malfunctioning. It is stuck on red for all directions, causing traffic confusion and potential accidents.',
    'Safety',
    'Intersection of 1st Ave and Washington St',
    'RESOLVED',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Illegal dumping in park',
    'Someone has been illegally dumping construction waste in the community park. This includes broken tiles, concrete pieces, and other debris. It is making the park unsafe for children.',
    'Garbage',
    'Community Park near playground',
    'OPEN',
    'YOUR_USER_ID_HERE'
  ),
  (
    'No water supply for 3 days',
    'Our neighborhood has been without water supply for the past 3 days. No prior notice was given, and residents are facing severe difficulties. We need immediate resolution.',
    'Water',
    'Green Valley Residences',
    'IN_PROGRESS',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Damaged road sign',
    'The stop sign at the school zone intersection is bent and barely visible. This is a serious safety concern as drivers may not notice it, especially during foggy conditions.',
    'Safety',
    'School zone intersection on Cedar Street',
    'VERIFIED',
    'YOUR_USER_ID_HERE'
  ),
  (
    'Power outages in residential area',
    'Frequent power outages (3-4 times daily) in our residential area for the past week. Each outage lasts 15-30 minutes. This is affecting work-from-home residents and causing food spoilage.',
    'Electricity',
    'Riverside Apartments, Building A-C',
    'OPEN',
    'YOUR_USER_ID_HERE'
  );

-- Sample comments (optional - only if you want pre-populated discussions)
-- Replace issue IDs with actual IDs from your database after inserting issues
-- INSERT INTO comments (issue_id, user_id, content)
-- VALUES
--   ('ISSUE_ID_1', 'YOUR_USER_ID_HERE', 'I also noticed this issue. It has been getting worse every day.'),
--   ('ISSUE_ID_2', 'YOUR_USER_ID_HERE', 'This pothole damaged my car tire last week. Please fix it urgently!');

-- To get your user ID, run this query in Supabase SQL Editor:
-- SELECT id, email FROM profiles WHERE email = 'your-email@example.com';

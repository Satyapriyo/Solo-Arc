-- Check if RLS is enabled and what policies exist
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Test if we can query profiles without RLS (as admin)
SELECT COUNT(*) as total_profiles FROM profiles;

-- Try to query your specific profile
SELECT id, name, email FROM profiles WHERE id = '0399431a-98d1-42fa-9643-8da3093c13fb';

-- DISABLE RLS TEMPORARILY FOR TESTING
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;  
ALTER TABLE workouts DISABLE ROW LEVEL SECURITY;

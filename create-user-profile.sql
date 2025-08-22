-- Create profile for your actual Civic Auth user (with conflict handling)
INSERT INTO profiles (id, name, email, level, total_xp, current_xp, strength, endurance, discipline, agility, intelligence, luck, streak, created_at, updated_at)
VALUES (
  '0399431a-98d1-42fa-9643-8da3093c13fb',
  'Satyapriyo Biswas',
  'satyapriyobiswas1@gmail.com',
  1,
  0,
  0,
  10,
  10,
  10,
  10,
  10,
  10,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  updated_at = NOW();

-- Optional: Create some sample tasks for your user
INSERT INTO tasks (user_id, name, description, type, difficulty, xp_reward, completed, created_at, updated_at)
VALUES 
  ('0399431a-98d1-42fa-9643-8da3093c13fb', 'First Push-up', 'Complete your first push-up set', 'daily', 'easy', 10, false, NOW(), NOW()),
  ('0399431a-98d1-42fa-9643-8da3093c13fb', 'Morning Run', 'Go for a 5-minute morning jog', 'daily', 'medium', 20, false, NOW(), NOW()),
  ('0399431a-98d1-42fa-9643-8da3093c13fb', 'Daily Plank', 'Hold a plank for 30 seconds', 'daily', 'medium', 20, false, NOW(), NOW());

-- Optional: Create a sample workout for your user  
INSERT INTO workouts (user_id, name, type, duration, xp_earned, completed_at, created_at)
VALUES (
  '0399431a-98d1-42fa-9643-8da3093c13fb',
  'Beginner Workout',
  'strength',
  15,
  25,
  NOW(),
  NOW()
);

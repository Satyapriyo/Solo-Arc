# 🗄️ Database Setup for Solo Leveling App

## ✅ **Quick Fix (2 minutes)**

Your Civic Auth is working perfectly! The errors are just missing database tables. Here's how to fix it:

### **Step 1: Go to Supabase SQL Editor**
1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/gzjgziopokzsaxlnnlzz)
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### **Step 2: Copy and Paste the SQL**
Copy the entire contents of `database/quick-setup.sql` and paste it into the SQL editor, then click **"Run"**.

Or manually copy this:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    current_xp INTEGER DEFAULT 0,
    strength INTEGER DEFAULT 10,
    endurance INTEGER DEFAULT 10,
    discipline INTEGER DEFAULT 10,
    agility INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    luck INTEGER DEFAULT 10,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    xp_reward INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create your profile
INSERT INTO public.profiles (id, email, name, level, total_xp) 
VALUES ('0399431a-98d1-42fa-9643-8da3093c13fb', 'satyapriyobiswas1@gmail.com', 'Satyapriyo Biswas', 1, 0)
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name;

-- Add sample data
INSERT INTO public.tasks (user_id, name, description, type, difficulty, xp_reward) VALUES
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Morning Workout', 'Complete a 30-minute workout session', 'daily', 'medium', 50),
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Read for 30 minutes', 'Read a book or educational material', 'daily', 'easy', 25),
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Complete a coding challenge', 'Solve a programming problem', 'daily', 'hard', 75)
ON CONFLICT DO NOTHING;
```

### **Step 3: Test Your App**
After running the SQL, restart your app and the errors should be gone!

## 🎯 **What This Does**

✅ **Creates all missing tables**: profiles, tasks, workouts  
✅ **Sets up your user profile** with your Civic Auth ID  
✅ **Adds sample data** so you can see the app working  
✅ **Matches your TypeScript types** exactly  

## 🔧 **Current Status Analysis**

From your debug logs, I can see:

✅ **Civic Auth Working**: 
- Access token: ✅
- User info: ✅ (Satyapriyo Biswas, satyapriyobiswas1@gmail.com)
- User ID: ✅ (0399431a-98d1-42fa-9643-8da3093c13fb)

❌ **Missing Database Tables**:
- profiles table: Missing
- tasks table: Missing  
- workouts table: Missing

## 🚀 **After Database Setup**

Once you run the SQL script, your app will:
- ✅ Show your profile data
- ✅ Display tasks you can complete  
- ✅ Track workouts and XP
- ✅ Update your level and stats

The authentication is perfect - you just need the database tables! 🎉

---

**Run the SQL script and your app will be fully functional!**

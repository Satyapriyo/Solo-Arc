-- Quick Database Setup for Solo Leveling App
-- Run this in your Supabase SQL Editor

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

-- Create your profile with the Civic Auth user ID
INSERT INTO public.profiles (id, email, name, level, total_xp) 
VALUES ('0399431a-98d1-42fa-9643-8da3093c13fb', 'satyapriyobiswas1@gmail.com', 'Satyapriyo Biswas', 1, 0)
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name;

-- Insert some sample tasks
INSERT INTO public.tasks (user_id, name, description, type, difficulty, xp_reward) VALUES
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Morning Workout', 'Complete a 30-minute workout session', 'daily', 'medium', 50),
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Read for 30 minutes', 'Read a book or educational material', 'daily', 'easy', 25),
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Complete a coding challenge', 'Solve a programming problem', 'daily', 'hard', 75),
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Weekly Meal Prep', 'Prepare healthy meals for the week', 'weekly', 'medium', 100)
ON CONFLICT DO NOTHING;

-- Insert some sample workouts
INSERT INTO public.workouts (user_id, name, type, duration, xp_earned, completed_at) VALUES
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Push-up Challenge', 'strength', 15, 30, NOW() - INTERVAL '1 day'),
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Morning Run', 'cardio', 30, 60, NOW() - INTERVAL '2 days'),
('0399431a-98d1-42fa-9643-8da3093c13fb', 'Yoga Session', 'flexibility', 45, 75, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

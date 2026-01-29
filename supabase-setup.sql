-- ============================================
-- HealthGuard AI - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height_cm DECIMAL(5,2),
  medical_history TEXT[],
  family_history TEXT[],
  allergies TEXT[],
  disclaimer_accepted BOOLEAN DEFAULT false,
  disclaimer_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create body_metrics table (Height, Weight, BMI)
CREATE TABLE IF NOT EXISTS body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  bmi DECIMAL(4,2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create health_logs table (Daily tracking)
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  temperature DECIMAL(4,2),
  heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  sleep_hours DECIMAL(3,1),
  activity_minutes INTEGER,
  fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 10),
  mood TEXT,
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create symptom_logs table
CREATE TABLE IF NOT EXISTS symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  symptoms TEXT[],
  follow_up_answers JSONB,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  ai_analysis JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) Policies
-- Each user can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);

-- Body metrics policies
CREATE POLICY "Users can view own body_metrics" 
  ON body_metrics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body_metrics" 
  ON body_metrics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body_metrics" 
  ON body_metrics FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own body_metrics" 
  ON body_metrics FOR DELETE 
  USING (auth.uid() = user_id);

-- Health logs policies
CREATE POLICY "Users can view own health_logs" 
  ON health_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health_logs" 
  ON health_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health_logs" 
  ON health_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health_logs" 
  ON health_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Symptom logs policies
CREATE POLICY "Users can view own symptom_logs" 
  ON symptom_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom_logs" 
  ON symptom_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom_logs" 
  ON symptom_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom_logs" 
  ON symptom_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- Trigger to auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Indexes for better query performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_body_metrics_user_id ON body_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_body_metrics_recorded_at ON body_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_health_logs_user_id ON health_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_health_logs_recorded_at ON health_logs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_id ON symptom_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_recorded_at ON symptom_logs(recorded_at);

-- ============================================
-- Setup complete! 
-- Your HealthGuard AI database is ready.
-- ============================================

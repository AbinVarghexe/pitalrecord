-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE key_scope AS ENUM ('read', 'read_write');
CREATE TYPE access_action AS ENUM ('key_used', 'record_viewed', 'rx_added', 'key_revoked');

-- =========================================
-- TABLES
-- =========================================

-- 1. Users table (Extending Supabase Auth users)
-- Supabase handles auth itself in auth.users, so we map our custom fields to public.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'patient'::user_role NOT NULL,
  mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Family Profiles table
CREATE TABLE public.family_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(120) NOT NULL,
  dob DATE NOT NULL,
  blood_group VARCHAR(8),
  allergies TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Prescriptions table
CREATE TABLE public.prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.family_profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  visit_date DATE,
  hospital_name VARCHAR(255),
  attending_doctor VARCHAR(120),
  diagnosis TEXT[],
  raw_text TEXT,
  ai_confidence NUMERIC(4,3),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Medicines table
CREATE TABLE public.medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(80),
  frequency VARCHAR(80),
  duration VARCHAR(80),
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Doctor Access Keys table
CREATE TABLE public.doctor_access_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.family_profiles(id) ON DELETE CASCADE NOT NULL,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  scope key_scope NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Access Logs table
CREATE TABLE public.access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  access_key_id UUID REFERENCES public.doctor_access_keys(id) ON DELETE CASCADE NOT NULL,
  action access_action NOT NULL,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_access_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own user record
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- Family Profiles Policies
CREATE POLICY "Users can view own family profiles" 
ON public.family_profiles FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own family profiles" 
ON public.family_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family profiles" 
ON public.family_profiles FOR UPDATE 
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Prescriptions Policies
-- Note: A doctor accessing via a valid access key will bypass RLS via a postgres function/RPC with SECURITY DEFINER
-- or by setting a custom claim in the session. For standard queries, only the owner can see them.
CREATE POLICY "Users can view prescriptions for own profiles" 
ON public.prescriptions FOR SELECT 
USING (
  profile_id IN (SELECT id FROM public.family_profiles WHERE user_id = auth.uid() AND deleted_at IS NULL)
  AND deleted_at IS NULL
);

CREATE POLICY "Users can insert prescriptions for own profiles" 
ON public.prescriptions FOR INSERT 
WITH CHECK (
  profile_id IN (SELECT id FROM public.family_profiles WHERE user_id = auth.uid() AND deleted_at IS NULL)
);

CREATE POLICY "Users can update prescriptions for own profiles" 
ON public.prescriptions FOR UPDATE 
USING (
  profile_id IN (SELECT id FROM public.family_profiles WHERE user_id = auth.uid() AND deleted_at IS NULL)
  AND deleted_at IS NULL
);

-- Medicines Policies
CREATE POLICY "Users can view own medicines" 
ON public.medicines FOR SELECT 
USING (
  prescription_id IN (
    SELECT p.id FROM public.prescriptions p
    JOIN public.family_profiles fp ON fp.id = p.profile_id
    WHERE fp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own medicines" 
ON public.medicines FOR INSERT 
WITH CHECK (
  prescription_id IN (
    SELECT p.id FROM public.prescriptions p
    JOIN public.family_profiles fp ON fp.id = p.profile_id
    WHERE fp.user_id = auth.uid()
  )
);

-- Doctor Access Keys Policies
CREATE POLICY "Users can view keys for own profiles" 
ON public.doctor_access_keys FOR SELECT 
USING (
  profile_id IN (SELECT id FROM public.family_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert keys for own profiles" 
ON public.doctor_access_keys FOR INSERT 
WITH CHECK (
  profile_id IN (SELECT id FROM public.family_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can modify keys for own profiles" 
ON public.doctor_access_keys FOR UPDATE 
USING (
  profile_id IN (SELECT id FROM public.family_profiles WHERE user_id = auth.uid())
);

-- Access Logs Policies
CREATE POLICY "Users can view access logs for own profiles" 
ON public.access_logs FOR SELECT 
USING (
  access_key_id IN (
    SELECT ak.id FROM public.doctor_access_keys ak
    JOIN public.family_profiles fp ON fp.id = ak.profile_id
    WHERE fp.user_id = auth.uid()
  )
);

-- =========================================
-- TRIGGERS & FUNCTIONS
-- =========================================

-- Create a function to handle new user signups from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'patient'::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically add a row to public.users when a new user signs up in Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_family_profiles_updated_at BEFORE UPDATE ON public.family_profiles FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX idx_family_profiles_user_id ON public.family_profiles(user_id);
CREATE INDEX idx_prescriptions_profile_id ON public.prescriptions(profile_id);
CREATE INDEX idx_medicines_prescription_id ON public.medicines(prescription_id);
CREATE INDEX idx_doctor_access_keys_profile_id ON public.doctor_access_keys(profile_id);
CREATE INDEX idx_access_logs_key_id ON public.access_logs(access_key_id);

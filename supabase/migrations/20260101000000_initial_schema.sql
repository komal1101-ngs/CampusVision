-- ==============================================================================
-- VisionCampus: AI-Powered Campus Safety, Accessibility & Infrastructure Intelligence Platform
-- Migration: 20260101000000_initial_schema.sql
-- ==============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'SAFETY_OFFICER', 'FACILITY_MANAGER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE overall_status AS ENUM ('SAFE', 'ISSUES_FOUND', 'REVIEW_REQUIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_category AS ENUM ('SAFETY', 'ACCESSIBILITY', 'INFRASTRUCTURE', 'CROWD_OPERATIONAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_status AS ENUM ('NEW', 'REVIEWED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Campus Locations Hierarchy Tables
CREATE TABLE IF NOT EXISTS public.campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(campus_id, code)
);

CREATE TABLE IF NOT EXISTS public.floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
    level TEXT NOT NULL, -- e.g., 'Ground Floor', 'Floor 1', 'Basement'
    sequence_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_id UUID NOT NULL REFERENCES public.floors(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'East Corridor', 'Room 204', 'Main Entrance'
    room_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Inspections Table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    campus_id UUID NOT NULL REFERENCES public.campuses(id),
    building_id UUID NOT NULL REFERENCES public.buildings(id),
    floor_id UUID NOT NULL REFERENCES public.floors(id),
    area_id UUID NOT NULL REFERENCES public.areas(id),
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    overall_status overall_status NOT NULL DEFAULT 'REVIEW_REQUIRED',
    inspection_summary TEXT NOT NULL,
    raw_ai_response JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Detected Issues Table
CREATE TABLE IF NOT EXISTS public.issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
    area_id UUID NOT NULL REFERENCES public.areas(id),
    category issue_category NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity issue_severity NOT NULL,
    status issue_status NOT NULL DEFAULT 'NEW',
    confidence_score NUMERIC(3, 2) NOT NULL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    visual_evidence TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Issue Audit Logs / History Table
CREATE TABLE IF NOT EXISTS public.issue_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES public.profiles(id),
    previous_status issue_status,
    new_status issue_status NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_inspections_user ON public.inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_inspections_location ON public.inspections(campus_id, building_id, floor_id, area_id);
CREATE INDEX IF NOT EXISTS idx_issues_inspection ON public.issues(inspection_id);
CREATE INDEX IF NOT EXISTS idx_issues_status_severity ON public.issues(status, severity);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);

-- Row Level Security (RLS) Rules
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function to Check User Role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can read all profiles; users can update only their own profile
DROP POLICY IF EXISTS "Read profiles" ON public.profiles;
CREATE POLICY "Read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Update self profile" ON public.profiles;
CREATE POLICY "Update self profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Locations: Everyone authenticated can read location hierarchy
DROP POLICY IF EXISTS "Read locations" ON public.campuses;
CREATE POLICY "Read locations" ON public.campuses FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Read buildings" ON public.buildings;
CREATE POLICY "Read buildings" ON public.buildings FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Read floors" ON public.floors;
CREATE POLICY "Read floors" ON public.floors FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Read areas" ON public.areas;
CREATE POLICY "Read areas" ON public.areas FOR SELECT USING (auth.role() = 'authenticated');

-- Admin Location Management
DROP POLICY IF EXISTS "Admin modify campuses" ON public.campuses;
CREATE POLICY "Admin modify campuses" ON public.campuses FOR ALL USING (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin modify buildings" ON public.buildings;
CREATE POLICY "Admin modify buildings" ON public.buildings FOR ALL USING (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin modify floors" ON public.floors;
CREATE POLICY "Admin modify floors" ON public.floors FOR ALL USING (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin modify areas" ON public.areas;
CREATE POLICY "Admin modify areas" ON public.areas FOR ALL USING (public.get_user_role(auth.uid()) = 'ADMIN');

-- Inspections: All authenticated users can read inspections; Users can insert their own inspections
DROP POLICY IF EXISTS "Read inspections" ON public.inspections;
CREATE POLICY "Read inspections" ON public.inspections FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Insert own inspection" ON public.inspections;
CREATE POLICY "Insert own inspection" ON public.inspections FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Issues: All authenticated users can read issues;
DROP POLICY IF EXISTS "Read issues" ON public.issues;
CREATE POLICY "Read issues" ON public.issues FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Update issue status" ON public.issues;
CREATE POLICY "Update issue status" ON public.issues FOR UPDATE USING (
  public.get_user_role(auth.uid()) IN ('SAFETY_OFFICER', 'FACILITY_MANAGER', 'ADMIN')
);

-- Audit Logs: All authenticated users can read logs; Authorized roles can insert logs
DROP POLICY IF EXISTS "Read audit logs" ON public.issue_audit_logs;
CREATE POLICY "Read audit logs" ON public.issue_audit_logs FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Insert audit log" ON public.issue_audit_logs;
CREATE POLICY "Insert audit log" ON public.issue_audit_logs FOR INSERT WITH CHECK (
  auth.uid() = changed_by AND
  public.get_user_role(auth.uid()) IN ('SAFETY_OFFICER', 'FACILITY_MANAGER', 'ADMIN')
);

-- ==============================================================================
-- GMRIT (GMR Institute of Technology) Initial Seed Data
-- Location: Rajam, Vizianagaram, Andhra Pradesh
-- ==============================================================================

-- 1. Insert Campus
INSERT INTO public.campuses (id, name, code, latitude, longitude)
VALUES (
  'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
  'GMR Institute of Technology (GMRIT)',
  'GMRIT-RAJAM',
  18.4674,
  83.6603
) ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- 2. Insert Buildings
INSERT INTO public.buildings (id, campus_id, name, code, latitude, longitude)
VALUES 
  ('b1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Main Block', 'MB', 18.4678, 83.6601),
  ('b2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Civil & Mechanical Block', 'CMB', 18.4671, 83.6608),
  ('b3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Electrical & Electronics Block', 'EEE', 18.4682, 83.6596),
  ('b4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Student Activity Center & Canteen', 'SAC', 18.4665, 83.6612)
ON CONFLICT (campus_id, code) DO UPDATE 
SET name = EXCLUDED.name, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- 3. Insert Floors
INSERT INTO public.floors (id, building_id, level, sequence_order)
VALUES
  ('c1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'b1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Ground Floor', 0),
  ('c2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'b1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Floor 1', 1),
  ('c3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'b2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Ground Floor', 0),
  ('c4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'b2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Floor 1', 1),
  ('c5b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'b3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Ground Floor', 0),
  ('c6b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'b3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Floor 1', 1),
  ('c7b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'b4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Ground Floor', 0)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Areas
INSERT INTO public.areas (id, floor_id, name, room_number)
VALUES
  -- Main Block (MB)
  ('d1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Central Administrative Corridor', 'MB-G01'),
  ('d2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Main Entrance', 'MB-MAIN'),
  ('d3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Dean Office Hallway', 'MB-101'),
  ('d4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Computer Labs Passageway', 'MB-LAB'),

  -- Civil & Mechanical Block (CMB)
  ('d5b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Heavy Machinery Lab Area', 'CMB-G02'),
  ('d6b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'East Exit Ramp', 'CMB-RAMP'),
  ('d7b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Structural Engineering Corridor', 'CMB-105'),
  ('d8b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Emergency Stairwell', 'CMB-STAIR'),

  -- Electrical & Electronics Block (EEE)
  ('d9b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c5b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Power Systems Lab', 'EEE-PSL'),
  ('da12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c5b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'High Voltage Bay Entrance', 'EEE-HVB'),
  ('db12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c6b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Electronics Workshop Corridor', 'EEE-108'),

  -- Student Activity Center & Canteen (SAC)
  ('dc12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c7b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Dining Area Pathway', 'SAC-DINE'),
  ('dd12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'c7b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Kitchen Egress Corridor', 'SAC-KITCH')
ON CONFLICT (id) DO NOTHING;


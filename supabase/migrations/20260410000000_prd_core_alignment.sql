-- PRD core alignment: AI pipeline fields, versioning, retention helpers, and access/audit alignment.

-- =========================================
-- ACCESS ACTION ENUM EXTENSIONS
-- =========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'records_viewed'
      AND enumtypid = 'access_action'::regtype
  ) THEN
    ALTER TYPE access_action ADD VALUE 'records_viewed';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'prescription_added'
      AND enumtypid = 'access_action'::regtype
  ) THEN
    ALTER TYPE access_action ADD VALUE 'prescription_added';
  END IF;
END $$;

-- =========================================
-- PRESCRIPTION AI + VERSIONING
-- =========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'prescriptions'
      AND column_name = 'extraction_status'
  ) THEN
    ALTER TABLE public.prescriptions
      ADD COLUMN extraction_status VARCHAR(32) DEFAULT 'pending' NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'prescriptions'
      AND column_name = 'follow_up_date'
  ) THEN
    ALTER TABLE public.prescriptions
      ADD COLUMN follow_up_date DATE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'prescriptions'
      AND column_name = 'extraction_data'
  ) THEN
    ALTER TABLE public.prescriptions
      ADD COLUMN extraction_data JSONB;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'prescriptions'
      AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE public.prescriptions
      ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.prescription_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (prescription_id, version_number)
);

ALTER TABLE public.prescription_versions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prescription_versions'
      AND policyname = 'Users can view versions for own prescriptions'
  ) THEN
    CREATE POLICY "Users can view versions for own prescriptions"
    ON public.prescription_versions FOR SELECT
    USING (
      prescription_id IN (
        SELECT p.id FROM public.prescriptions p
        JOIN public.family_profiles fp ON fp.id = p.profile_id
        WHERE fp.user_id = auth.uid()
      )
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prescription_versions'
      AND policyname = 'Users can insert versions for own prescriptions'
  ) THEN
    CREATE POLICY "Users can insert versions for own prescriptions"
    ON public.prescription_versions FOR INSERT
    WITH CHECK (
      prescription_id IN (
        SELECT p.id FROM public.prescriptions p
        JOIN public.family_profiles fp ON fp.id = p.profile_id
        WHERE fp.user_id = auth.uid()
      )
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_prescription_versions_prescription_id
  ON public.prescription_versions(prescription_id);

CREATE INDEX IF NOT EXISTS idx_prescriptions_extraction_status
  ON public.prescriptions(extraction_status);

-- =========================================
-- RETENTION-RELATED INDEXES FOR SOFT DELETE
-- =========================================
CREATE INDEX IF NOT EXISTS idx_family_profiles_deleted_at
  ON public.family_profiles(deleted_at);

CREATE INDEX IF NOT EXISTS idx_prescriptions_deleted_at
  ON public.prescriptions(deleted_at);

CREATE OR REPLACE FUNCTION public.purge_expired_soft_deletes()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.prescriptions
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';

  DELETE FROM public.family_profiles
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

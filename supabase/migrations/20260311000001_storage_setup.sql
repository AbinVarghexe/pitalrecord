-- =========================================
-- STORAGE CONFIGURATION
-- =========================================

-- Insert the 'prescriptions' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage Policies

-- 1. Users can upload files to the prescriptions bucket
-- They must be authenticated and the bucket_id must be 'prescriptions'
CREATE POLICY "Users can upload prescription images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'prescriptions'
);

-- 2. Users can view their own files in the prescriptions bucket
-- Security rule: we check if the path (which will be linked in public.prescriptions.file_url)
-- belongs to a prescription the user owns via family_profiles
CREATE POLICY "Users can view their own prescription images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'prescriptions' AND
  -- Check if the object name matches a file_url owned by the user
  EXISTS (
    SELECT 1 FROM public.prescriptions p
    JOIN public.family_profiles fp ON fp.id = p.profile_id
    WHERE fp.user_id = auth.uid()
    AND p.file_url = name
  )
);

-- 3. Users can delete their own files
CREATE POLICY "Users can delete their own prescription images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'prescriptions' AND
  -- Check if the object name matches a file_url owned by the user
  EXISTS (
    SELECT 1 FROM public.prescriptions p
    JOIN public.family_profiles fp ON fp.id = p.profile_id
    WHERE fp.user_id = auth.uid()
    AND p.file_url = name
  )
);

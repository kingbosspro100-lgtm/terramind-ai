-- Migration Supabase pour la persistance des photos de profil et les règles RLS

-- 1. S'assurer de la présence des colonnes dans public.users_profile
ALTER TABLE public.users_profile
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT;

-- 2. Activer RLS sur users_profile
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

-- 3. Politiques RLS pour users_profile (SELECT, INSERT, UPDATE)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users_profile' AND policyname = 'Users can select their own profile'
  ) THEN
    CREATE POLICY "Users can select their own profile" ON public.users_profile
      FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users_profile' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" ON public.users_profile
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users_profile' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" ON public.users_profile
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- 4. Créer le bucket "avatars" dans Supabase Storage si inexistant
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Politiques RLS pour le bucket storage.objects "avatars"
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Read Avatars'
  ) THEN
    CREATE POLICY "Public Read Avatars" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar" ON storage.objects
      FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);
  END IF;
END $$;

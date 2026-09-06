-- Migration Supabase pour la table user_reviews et les politiques RLS
CREATE TABLE IF NOT EXISTS public.user_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    location TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activer Row Level Security (RLS)
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_reviews
DO $$ 
BEGIN
  -- 1. Lecture publique : Tout le monde (y compris utilisateurs anonymes) peut lire les avis autorisés à être publics (is_public = true)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_reviews' AND policyname = 'user_reviews_select_public'
  ) THEN
    CREATE POLICY "user_reviews_select_public" ON public.user_reviews
      FOR SELECT USING (is_public = true);
  END IF;

  -- 2. Insertion : Tout utilisateur peut créer son avis
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_reviews' AND policyname = 'user_reviews_insert_any'
  ) THEN
    CREATE POLICY "user_reviews_insert_any" ON public.user_reviews
      FOR INSERT WITH CHECK (true);
  END IF;

  -- 3. Administration : Les utilisateurs enregistrés dans admin_users peuvent tout lire, modifier et supprimer
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_reviews' AND policyname = 'user_reviews_admin_all'
  ) THEN
    CREATE POLICY "user_reviews_admin_all" ON public.user_reviews
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
      );
  END IF;
END $$;

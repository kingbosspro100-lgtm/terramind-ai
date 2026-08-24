-- Migration Supabase pour le système de suivi hebdomadaire des publicités récompensées TerraMind AI
CREATE TABLE IF NOT EXISTS public.ai_weekly_ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    week_start DATE NOT NULL,
    ads_watched INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_week_start UNIQUE (user_id, week_start)
);

-- Index pour accélérer les requêtes par utilisateur et semaine
CREATE INDEX IF NOT EXISTS idx_ai_weekly_ads_user_week ON public.ai_weekly_ads (user_id, week_start);

-- Activer Row Level Security (RLS)
ALTER TABLE public.ai_weekly_ads ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_weekly_ads' AND policyname = 'Users can view their own ai_weekly_ads'
  ) THEN
    CREATE POLICY "Users can view their own ai_weekly_ads" ON public.ai_weekly_ads
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_weekly_ads' AND policyname = 'Users can update their own ai_weekly_ads'
  ) THEN
    CREATE POLICY "Users can update their own ai_weekly_ads" ON public.ai_weekly_ads
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_weekly_ads' AND policyname = 'Users can insert their own ai_weekly_ads'
  ) THEN
    CREATE POLICY "Users can insert their own ai_weekly_ads" ON public.ai_weekly_ads
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

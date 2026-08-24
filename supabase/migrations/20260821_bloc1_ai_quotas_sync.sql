-- Migration de synchronisation pour le BLOC 1 TerraMind AI (Quotas, Récompenses et Suivi des Pubs)

-- 1. Ajouter les colonnes manquantes dans ai_usage si nécessaire
ALTER TABLE public.ai_usage 
  ADD COLUMN IF NOT EXISTS rewarded_messages INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rewarded_claimed INTEGER NOT NULL DEFAULT 0;

-- 2. Ajouter les colonnes manquantes dans ai_usage_quotas si nécessaire
ALTER TABLE public.ai_usage_quotas 
  ADD COLUMN IF NOT EXISTS rewarded_claimed INTEGER NOT NULL DEFAULT 0;

-- 3. Index de performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_month ON public.ai_usage (user_id, month_start);
CREATE INDEX IF NOT EXISTS idx_ai_usage_quotas_user_month ON public.ai_usage_quotas (user_id, usage_month);

-- 4. Politiques RLS de sécurité
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_quotas ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'Users can view their own ai_usage'
  ) THEN
    CREATE POLICY "Users can view their own ai_usage" ON public.ai_usage
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'Users can update their own ai_usage'
  ) THEN
    CREATE POLICY "Users can update their own ai_usage" ON public.ai_usage
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'Users can insert their own ai_usage'
  ) THEN
    CREATE POLICY "Users can insert their own ai_usage" ON public.ai_usage
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

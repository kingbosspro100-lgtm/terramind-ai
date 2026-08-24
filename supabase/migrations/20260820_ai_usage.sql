-- Migration Supabase pour la table de comptabilisation mensuelle ai_usage
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month_start DATE NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_month_start UNIQUE (user_id, month_start)
);

-- Index pour accélérer les requêtes par utilisateur et mois
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_month_start ON public.ai_usage (user_id, month_start);

-- Activer Row Level Security (RLS)
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view their own AI usage"
  ON public.ai_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI usage"
  ON public.ai_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI usage"
  ON public.ai_usage FOR UPDATE
  USING (auth.uid() = user_id);

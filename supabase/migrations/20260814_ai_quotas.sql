-- Table de suivi des quotas mensuels pour l'assistant IA TerraMind AI
CREATE TABLE IF NOT EXISTS public.ai_usage_quotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  usage_month VARCHAR(7) NOT NULL DEFAULT to_char(CURRENT_DATE, 'YYYY-MM'),
  messages_used INT NOT NULL DEFAULT 0,
  rewarded_messages INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_usage_month UNIQUE (user_id, usage_month)
);

-- Index pour accélérer la recherche par utilisateur et mois
CREATE INDEX IF NOT EXISTS idx_ai_usage_quotas_user_month ON public.ai_usage_quotas (user_id, usage_month);

-- Activer Row Level Security (RLS)
ALTER TABLE public.ai_usage_quotas ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view their own AI usage"
  ON public.ai_usage_quotas FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own AI usage"
  ON public.ai_usage_quotas FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = auth.uid()::text);

CREATE POLICY "Users can update their own AI usage"
  ON public.ai_usage_quotas FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = auth.uid()::text);

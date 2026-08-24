-- Migration Supabase : Audit & Renforcement des Politiques RLS de Sécurité
-- Principe strict : Un utilisateur ne peut lire/modifier que ses propres données (auth.uid() = user_id).

-- 1. Table users_profile
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users_profile' AND policyname = 'users_profile_select_own') THEN
    CREATE POLICY "users_profile_select_own" ON public.users_profile FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users_profile' AND policyname = 'users_profile_insert_own') THEN
    CREATE POLICY "users_profile_insert_own" ON public.users_profile FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users_profile' AND policyname = 'users_profile_update_own') THEN
    CREATE POLICY "users_profile_update_own" ON public.users_profile FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- 2. Table farms
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'farms' AND policyname = 'farms_select_own') THEN
    CREATE POLICY "farms_select_own" ON public.farms FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'farms' AND policyname = 'farms_insert_own') THEN
    CREATE POLICY "farms_insert_own" ON public.farms FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'farms' AND policyname = 'farms_update_own') THEN
    CREATE POLICY "farms_update_own" ON public.farms FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'farms' AND policyname = 'farms_delete_own') THEN
    CREATE POLICY "farms_delete_own" ON public.farms FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Table transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'transactions_select_own') THEN
    CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'transactions_insert_own') THEN
    CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'transactions_update_own') THEN
    CREATE POLICY "transactions_update_own" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'transactions_delete_own') THEN
    CREATE POLICY "transactions_delete_own" ON public.transactions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Table ai_usage
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'ai_usage_select_own') THEN
    CREATE POLICY "ai_usage_select_own" ON public.ai_usage FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'ai_usage_insert_own') THEN
    CREATE POLICY "ai_usage_insert_own" ON public.ai_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'ai_usage_update_own') THEN
    CREATE POLICY "ai_usage_update_own" ON public.ai_usage FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Table ai_weekly_ads
ALTER TABLE public.ai_weekly_ads ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_weekly_ads' AND policyname = 'ai_weekly_ads_select_own') THEN
    CREATE POLICY "ai_weekly_ads_select_own" ON public.ai_weekly_ads FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_weekly_ads' AND policyname = 'ai_weekly_ads_insert_own') THEN
    CREATE POLICY "ai_weekly_ads_insert_own" ON public.ai_weekly_ads FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_weekly_ads' AND policyname = 'ai_weekly_ads_update_own') THEN
    CREATE POLICY "ai_weekly_ads_update_own" ON public.ai_weekly_ads FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

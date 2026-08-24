-- Migration Supabase : Colonnes et Politiques RLS pour FedaPay dans la table payments

-- 1. S'assurer des colonnes requises dans public.payments
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'fedapay',
  ADD COLUMN IF NOT EXISTS provider_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Index pour accélérer la recherche par provider et provider_transaction_id
CREATE INDEX IF NOT EXISTS idx_payments_provider_tx_id ON public.payments (provider, provider_transaction_id);

-- 2. Activer RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 3. Mettre à jour les politiques RLS si nécessaire
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'users_view_own_payments'
  ) THEN
    CREATE POLICY "users_view_own_payments" ON public.payments
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'users_insert_own_payments'
  ) THEN
    CREATE POLICY "users_insert_own_payments" ON public.payments
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'users_update_own_payments'
  ) THEN
    CREATE POLICY "users_update_own_payments" ON public.payments
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

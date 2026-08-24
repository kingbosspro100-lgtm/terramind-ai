-- Migration Supabase pour le système de paiements et d'abonnements TerraMind AI

-- 1. Table des abonnements (subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'FCFA',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Index pour accélérer la recherche d'abonnement par utilisateur
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions (user_id);

-- 2. Table des paiements (payments)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'FCFA',
    reference TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT 'mobile_money',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la recherche par référence de transaction et utilisateur
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments (reference);

-- 3. Activer Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS pour subscriptions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can view their own subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can insert their own subscriptions'
  ) THEN
    CREATE POLICY "Users can insert their own subscriptions" ON public.subscriptions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can update their own subscriptions'
  ) THEN
    CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Politiques RLS pour payments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can view their own payments'
  ) THEN
    CREATE POLICY "Users can view their own payments" ON storage.payments
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can insert their own payments'
  ) THEN
    CREATE POLICY "Users can insert their own payments" ON public.payments
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can update their own payments'
  ) THEN
    CREATE POLICY "Users can update their own payments" ON public.payments
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

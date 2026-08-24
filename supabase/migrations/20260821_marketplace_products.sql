-- Phase: Marketplace Real Products Table Schema
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Récoltes, Outils & Matériels, Semences, Engrais
    price NUMERIC DEFAULT 0 NOT NULL,
    quantity NUMERIC DEFAULT 0 NOT NULL,
    unit TEXT DEFAULT 'unités' NOT NULL,
    description TEXT,
    image_url TEXT,
    visits INTEGER DEFAULT 0 NOT NULL,
    sales INTEGER DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL, -- active, draft, out_of_stock
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Products
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.products
    FOR DELETE USING (auth.uid() = user_id);

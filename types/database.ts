export type SupportedCountry = "Bénin" | "Côte d'Ivoire" | "Cameroun" | "Sénégal";

export interface Exploitation {
  id: string;
  user_id: string;
  name: string;
  country: SupportedCountry;
  city: string;
  latitude: number | null;
  longitude: number | null;
  surface_hectares: number;
  main_crops: string[];
  created_at: string;
  updated_at: string;
}

export interface Culture {
  id: string;
  user_id: string;
  exploitation_id: string;
  name: string;
  variety: string | null;
  surface_hectares: number;
  planting_date: string | null;
  status: string;
  expected_yield_kg: number | null;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  unit_price_fcfa: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount_fcfa: number;
  category: string;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type StoreProductCategory = "semences" | "engrais" | "phytosanitaire" | "matériel" | "produits";

export interface StoreProduct {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  category: StoreProductCategory;
  price_fcfa: number;
  available_quantity: number;
  unit: string;
  location_city: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketPrice {
  id: string;
  product_name: string;
  market_name: string;
  country: SupportedCountry;
  department?: string | null;
  price_fcfa: number;
  unit: string;
  recorded_at: string;
}

export type AbonnementPlan = "FREE" | "PRO" | "ENTREPRISE";
export type AbonnementStatus = "active" | "trialing" | "expired" | "cancelled" | "past_due";

export interface Abonnement {
  id: string;
  user_id: string;
  plan: AbonnementPlan;
  status: AbonnementStatus;
  trial_start: string | null;
  trial_end: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiUsage {
  user_id: string;
  month_start: string;
  message_count: number;
  rewarded_bonus_messages: number;
  rewarded_messages?: number | null;
  rewarded_claimed?: number | null;
  created_at: string;
  updated_at: string;
}
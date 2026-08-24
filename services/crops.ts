import { supabase } from "@/lib/supabase";

export async function getCrops(farmId: string) {
  const { data, error } = await supabase
    .from("crops")
    .select("*")
    .eq("farm_id", farmId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createCrop(crop: {
  farm_id: string;
  name: string;
  sowing_date: string;
  harvest_date: string;
}) {
  const { data, error } = await supabase
    .from("crops")
    .insert([crop])
    .select();

  if (error) throw error;

  return data;
}

export async function deleteCrop(id: string) {
  const { error } = await supabase
    .from("crops")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
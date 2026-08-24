import { createClient } from "@/lib/client";

export async function createFarm(farm: {
  name: string;
  country: string;
  city: string;
  main_crop: string;
  area: number;
  latitude?: number | null;
  longitude?: number | null;
  gps_coordinates?: string | null;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non connecté.");
  }

  const { gps_coordinates, ...farmPayload } = farm;

  const { data, error } = await supabase
    .from("farms")
    .insert([
      {
        ...farmPayload,
        latitude: farm.latitude ?? null,
        longitude: farm.longitude ?? null,
        user_id: user.id,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}

export async function getFarms() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("farms")
    .select(`
      *,
      crops (*)
    `)
    .eq("user_id", user.id);

  if (error) throw error;

  return data;
}

export async function deleteFarm(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("farms")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateFarm(
  id: string,
  farm: {
    name: string;
    country: string;
    city: string;
    main_crop: string;
    area: number;
    latitude?: number | null;
    longitude?: number | null;
    gps_coordinates?: string | null;
  }
) {
  const supabase = createClient();

  const { gps_coordinates, ...farmPayload } = farm;

  const { data, error } = await supabase
    .from("farms")
    .update({
      ...farmPayload,
      latitude: farm.latitude ?? null,
      longitude: farm.longitude ?? null,
    })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}
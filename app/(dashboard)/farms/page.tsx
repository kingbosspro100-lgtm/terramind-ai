import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import FarmsPageClient from "./FarmsPageClient";

export default async function FarmsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  let farms: any[] = [];
  try {
    const { data } = await supabase
      .from("farms")
      .select(`
        *,
        crops (
          id,
          name,
          status
        ) 
      `)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });
    if (data) farms = data;
  } catch (err) {
    console.error("Farms fetch error:", err);
  }

  return <FarmsPageClient farmList={farms} />;
}
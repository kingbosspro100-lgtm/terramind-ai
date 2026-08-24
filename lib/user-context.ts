import { createClient } from "@/lib/server";
import { ensureValidUuid } from "@/lib/ai-quota";

export async function getUserAgronomicContext(userId: string): Promise<string> {
  if (!userId) return "";

  try {
    const supabase = await createClient();
    const dbUserId = ensureValidUuid(userId);

    // 1. Récupérer uniquement les exploitations de l'utilisateur connecté
    const { data: farms, error: farmsError } = await supabase
      .from("farms")
      .select("id, name, location, gps_coordinates, area_hectares")
      .eq("user_id", dbUserId);

    if (farmsError || !farms || farms.length === 0) {
      return "[Informations du compte : Cet utilisateur n'a pas encore créé d'exploitation agricole dans son profil.]";
    }

    const farmIds = farms.map((f) => f.id);

    // 2. Récupérer les parcelles associées aux exploitations de cet utilisateur
    const { data: plots } = await supabase
      .from("plots")
      .select("id, farm_id, name, area_hectares, soil_type, status")
      .in("farm_id", farmIds);

    const plotIds = (plots || []).map((p) => p.id);

    // 3. Récupérer les cultures présentes sur les parcelles de cet utilisateur
    let crops: any[] = [];
    if (plotIds.length > 0) {
      const { data: cropsData } = await supabase
        .from("crops")
        .select("id, plot_id, name, variety, planting_date, expected_harvest_date, status, estimated_yield_kg, notes")
        .in("plot_id", plotIds);
      crops = cropsData || [];
    }

    // 4. Formater le contexte pour l'Assistant IA TerraMind
    const lines: string[] = [];
    lines.push("--- DONNÉES AGRONOMIQUES DE L'UTILISATEUR CONNECTÉ (CONFIDENTIEL) ---");

    for (const farm of farms) {
      lines.push(
        `• Exploitation : "${farm.name}" (Surface : ${farm.area_hectares || 0} ha${
          farm.location ? `, Lieu : ${farm.location}` : ""
        })`
      );

      const farmPlots = (plots || []).filter((p) => p.farm_id === farm.id);
      if (farmPlots.length === 0) {
        lines.push("  - Aucune parcelle enregistrée pour cette exploitation.");
      } else {
        for (const plot of farmPlots) {
          lines.push(
            `  - Parcelle "${plot.name}" (${plot.area_hectares || 0} ha${
              plot.soil_type ? `, Sol : ${plot.soil_type}` : ""
            }, Statut : ${plot.status || "actif"})`
          );

          const plotCrops = crops.filter((c) => c.plot_id === plot.id);
          if (plotCrops.length > 0) {
            for (const crop of plotCrops) {
              lines.push(
                `    * Culture : ${crop.name}${crop.variety ? ` (Variété : ${crop.variety})` : ""}, Statut : ${
                  crop.status || "en croissance"
                }${crop.planting_date ? `, Planté le : ${crop.planting_date}` : ""}${
                  crop.estimated_yield_kg ? `, Rendement estimé : ${crop.estimated_yield_kg} kg` : ""
                }`
              );
            }
          }
        }
      }
    }

    lines.push("--- FIN DES DONNÉES DE L'UTILISATEUR ---");
    return lines.join("\n");
  } catch (err) {
    console.warn("Remarque chargement contexte agronomique utilisateur:", err);
    return "[Informations du compte : Contexte agronomique non disponible pour cet utilisateur.]";
  }
}

import { AI_QUOTA_CONFIG } from "../lib/ai-quota-config";
import {
  getPlanMonthlyQuota,
  getMaxMonthlyRewardedAds,
  getMaxImagesPerMessage,
} from "../lib/subscription";

async function testBloc1GptLogic() {
  console.log("=== VERIFICATION LOGIQUE BLOC 1 TERRAMIND AI (GPT REWARDED ADS) ===");

  console.log("FREE Plan:", {
    quota: getPlanMonthlyQuota("free"),
    maxAds: getMaxMonthlyRewardedAds("free"),
    maxImages: getMaxImagesPerMessage("free"),
  });
  console.log("PRO Plan:", {
    quota: getPlanMonthlyQuota("pro"),
    maxAds: getMaxMonthlyRewardedAds("pro"),
    maxImages: getMaxImagesPerMessage("pro"),
  });
  console.log("ENTERPRISE Plan:", {
    quota: getPlanMonthlyQuota("enterprise", 500),
    maxAds: getMaxMonthlyRewardedAds("enterprise"),
    maxImages: getMaxImagesPerMessage("enterprise"),
  });

  // Assertions de conformité
  if (getPlanMonthlyQuota("free") !== 5) throw new Error("Free quota doit être 5");
  if (getPlanMonthlyQuota("pro") !== 50) throw new Error("Pro quota doit être 50");
  if (getPlanMonthlyQuota("enterprise") !== 500) throw new Error("Enterprise quota doit être 500");

  if (getMaxMonthlyRewardedAds("free") !== 2) throw new Error("Free max ads doit être 2 (mis à jour)");
  if (getMaxMonthlyRewardedAds("pro") !== 10) throw new Error("Pro max ads doit être 10");
  if (getMaxMonthlyRewardedAds("enterprise") !== 50) throw new Error("Enterprise max ads doit être 50");

  if (getMaxImagesPerMessage("free") !== 1) throw new Error("Free max images doit être 1");
  if (getMaxImagesPerMessage("pro") !== 2) throw new Error("Pro max images doit être 2");
  if (getMaxImagesPerMessage("enterprise") !== 5) throw new Error("Enterprise max images doit être 5");

  console.log("✅ Toutes les règles (Free = 2 ads/mois) sont VALIDES.");
}

testBloc1GptLogic().catch((e) => {
  console.error("❌ Test échoué:", e);
});

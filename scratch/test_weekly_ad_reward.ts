import {
  getAiQuota,
  claimAdReward,
  incrementAiUsage,
  getWeekStartDateString,
  getMonthStartDateString,
} from "../lib/ai-quota";

async function runTestSuite() {
  const testUserId = "00000000-0000-4000-a000-000000000099"; // Free test user UUID
  console.log("==================================================");
  console.log("TEST AUTOMATISÉ : SYSTÈME PUBLICITÉS RÉCOMPENSÉES HEBDOMADAIRES");
  console.log("==================================================\n");

  const today = new Date();
  const currentWeekStart = getWeekStartDateString(today);
  console.log(`[INFO] Date d'exécution: ${today.toISOString().slice(0, 10)}`);
  console.log(`[INFO] Semaine courante (Monday UTC): ${currentWeekStart}`);

  // Étape 1: Statut initial Free
  console.log("\n--- Etape 1: Tester statut initial Free ---");
  const initialQuota = await getAiQuota(testUserId);
  console.log(`Plan: ${initialQuota.plan}`);
  console.log(`Message Count Used: ${initialQuota.messagesUsed}`);
  console.log(`Rewarded Messages (solde bonus): ${initialQuota.rewardedMessages}`);
  console.log(`Ads Watched (cette semaine): ${initialQuota.adsWatched}`);
  console.log(`Max Weekly Rewards: ${initialQuota.maxWeeklyRewards}`);
  console.log(`Can Claim Reward: ${initialQuota.canClaimReward}`);

  // Étape 2: Regarder une publicité (claimAdReward)
  console.log("\n--- Etape 2 & 3 & 4: Regarder 1 publicité récompensée ---");
  const claimRes = await claimAdReward(testUserId);
  console.log(`Succès réclamation: ${claimRes.success}`);
  console.log(`Message serveur: ${claimRes.message}`);

  const postClaimQuota = claimRes.quota;
  console.log(`[Vérification +1 message] Solde bonus rewardedMessages: ${postClaimQuota.rewardedMessages} (Attendu: 1)`);
  console.log(`[Vérification adsWatched] Pubs regardées cette semaine: ${postClaimQuota.adsWatched} (Attendu: 1)`);
  console.log(`[Vérification canClaimReward] Pubs disponibles == 0 ? canClaimReward = ${postClaimQuota.canClaimReward} (Attendu: false)`);

  if (postClaimQuota.rewardedMessages !== 1 || postClaimQuota.adsWatched !== 1 || postClaimQuota.canClaimReward !== false) {
    console.error("❌ ÉCHEC ÉTAPE 2/3/4 !");
    process.exit(1);
  }

  // Tentative d'une 2ème pub la même semaine (doit échouer côté serveur)
  console.log("\n--- Test Sécurité Serveur: Tentative de 2ème pub la même semaine ---");
  const doubleClaimRes = await claimAdReward(testUserId);
  console.log(`Résultat 2ème réclamation: success = ${doubleClaimRes.success}`);
  console.log(`Message serveur: ${doubleClaimRes.message}`);
  if (doubleClaimRes.success) {
    console.error("❌ ÉCHEC SÉCURITÉ : La 2ème réclamation la même semaine aurait dû être rejetée !");
    process.exit(1);
  }

  // Étape 5 & 6 & 7: Utiliser le message bonus
  console.log("\n--- Etape 5 & 6 & 7: Consommer le message bonus (+1 envoi IA) ---");
  const postUsageQuota = await incrementAiUsage(testUserId);
  console.log(`[Vérification bonus = 0] Solde bonus rewardedMessages: ${postUsageQuota.rewardedMessages} (Attendu: 0)`);
  console.log(`[Vérification adsWatched inchangé] Pubs regardées cette semaine: ${postUsageQuota.adsWatched} (Attendu: 1)`);
  console.log(`[Vérification canClaimReward reste false] canClaimReward = ${postUsageQuota.canClaimReward} (Attendu: false)`);

  if (postUsageQuota.rewardedMessages !== 0 || postUsageQuota.adsWatched !== 1 || postUsageQuota.canClaimReward !== false) {
    console.error("❌ ÉCHEC ÉTAPE 5/6/7 : La consommation du message bonus a réactivé la pub !");
    process.exit(1);
  }

  // Étape 8 & 9: Simuler un refresh de page (re-fetch du quota depuis Supabase)
  console.log("\n--- Etape 8 & 9: Actualiser la page / Re-fetch getAiQuota depuis Supabase ---");
  const refreshedQuota = await getAiQuota(testUserId);
  console.log(`Solde bonus après refresh: ${refreshedQuota.rewardedMessages}`);
  console.log(`Pubs regardées après refresh: ${refreshedQuota.adsWatched}`);
  console.log(`[Vérification pub reste indisponible après refresh] canClaimReward = ${refreshedQuota.canClaimReward} (Attendu: false)`);

  if (refreshedQuota.canClaimReward !== false || refreshedQuota.adsWatched !== 1) {
    console.error("❌ ÉCHEC ÉTAPE 8/9 : Le refresh de page a réinitialisé la limite !");
    process.exit(1);
  }

  // Étape 10 & 11: Simuler une nouvelle semaine (+7 jours)
  console.log("\n--- Etape 10 & 11: Simuler le passage à la semaine suivante (+7 jours) ---");
  const nextWeekDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextWeekStart = getWeekStartDateString(nextWeekDate);
  console.log(`Nouvelle date simulée: ${nextWeekDate.toISOString().slice(0, 10)}`);
  console.log(`Semaine suivante (Monday UTC): ${nextWeekStart}`);

  const nextWeekQuota = await getAiQuota(testUserId, nextWeekDate);
  console.log(`Pubs regardées la semaine suivante: ${nextWeekQuota.adsWatched} (Attendu: 0)`);
  console.log(`[Vérification pub redevient disponible] canClaimReward = ${nextWeekQuota.canClaimReward} (Attendu: true)`);

  if (nextWeekQuota.adsWatched !== 0 || nextWeekQuota.canClaimReward !== true) {
    console.error("❌ ÉCHEC ÉTAPE 10/11 : La publicité n'est pas redevenue disponible la semaine suivante !");
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("✅ TOUS LES 11 TESTS DU CAHIER DES CHARGES ONT RÉUSSI AVEC SUCCÈS !");
  console.log("==================================================");
}

runTestSuite().catch((err) => {
  console.error("Erreur exécution suite de tests:", err);
  process.exit(1);
});

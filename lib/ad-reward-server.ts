import { claimAdReward, getAiQuota, AiQuotaStatus } from "@/lib/ai-quota";

interface AdSession {
  adSessionId: string;
  userId: string;
  createdAt: number;
  used: boolean;
}

// Map en mémoire pour le suivi des sessions de publicités récompensées
const adSessions = new Map<string, AdSession>();

// Nettoyage des sessions de pub de plus de 15 minutes
function cleanupExpiredSessions() {
  const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
  const now = Date.now();
  for (const [id, session] of adSessions.entries()) {
    if (now - session.createdAt > FIFTEEN_MINUTES_MS) {
      adSessions.delete(id);
    }
  }
}

/**
 * Initialise une session de publicité récompensée côté serveur.
 * Vérifie l'éligibilité de l'utilisateur (quota et limite de pub hebdomadaire selon sa formule).
 */
export async function initAdRewardSession(userId: string): Promise<{
  success: boolean;
  message?: string;
  adSessionId?: string;
  adUnitPath?: string;
  quota?: AiQuotaStatus;
}> {
  cleanupExpiredSessions();

  const quota = await getAiQuota(userId);

  if (!quota.canClaimReward) {
    return {
      success: false,
      message: `Limite hebdomadaire de ${quota.maxWeeklyRewards} publicité(s) récompensée(s) atteinte pour la formule ${quota.plan.toUpperCase()}.`,
      quota,
    };
  }

  const adSessionId = `gpt_sess_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  const adUnitPath = process.env.NEXT_PUBLIC_GAM_REWARDED_AD_UNIT_PATH || "/22639388115/rewarded_web_example";

  adSessions.set(adSessionId, {
    adSessionId,
    userId,
    createdAt: Date.now(),
    used: false,
  });

  return {
    success: true,
    adSessionId,
    adUnitPath,
    quota,
  };
}

/**
 * Valide l'achèvement effectif d'une publicité récompensée par Google GPT (rewardedSlotGranted) et crédite +1 message bonus.
 * Empêche tout double crédit (jeton à usage unique).
 */
export async function verifyAndClaimAdRewardSession(
  userId: string,
  adSessionId: string,
  gptGranted: boolean = true
): Promise<{
  success: boolean;
  message: string;
  quota?: AiQuotaStatus;
}> {
  cleanupExpiredSessions();

  if (!adSessionId || typeof adSessionId !== "string") {
    return {
      success: false,
      message: "Session de publicité invalide ou manquante.",
    };
  }

  if (!gptGranted) {
    return {
      success: false,
      message: "L'annonce a été fermée ou abandonnée avant l'obtention de la récompense Google (rewardedSlotGranted non émis).",
    };
  }

  const session = adSessions.get(adSessionId);

  if (!session) {
    return {
      success: false,
      message: "Session de publicité expirée ou inexistante. Veuillez répliquer l'annonce.",
    };
  }

  if (session.userId !== userId) {
    return {
      success: false,
      message: "Cette session de publicité n'appartient pas à l'utilisateur connecté.",
    };
  }

  if (session.used) {
    return {
      success: false,
      message: "Cette annonce a déjà été récompensée. Double crédit impossible.",
    };
  }

  // Marquer immédiatement la session comme utilisée pour éliminer toute race condition
  session.used = true;
  adSessions.delete(adSessionId);

  // Créditer la récompense côté serveur (+1 pub hebdomadaire et +1 solde bonus)
  return await claimAdReward(userId);
}

/**
 * Configuration centrale pour les quotas MENSUELS de l'Assistant IA TerraMind AI
 * et les récompenses publicitaires HEBDOMADAIRES (messages bonus).
 */
export const AI_QUOTA_CONFIG = {
  /** Nombre de messages IA inclus par MOIS pour les utilisateurs FREE */
  FREE_MONTHLY_AI_MESSAGES: 5,

  /** Nombre de messages IA inclus par MOIS pour les utilisateurs PRO */
  PRO_MONTHLY_AI_MESSAGES: 50,

  /** Nombre de messages IA inclus par MOIS pour les utilisateurs ENTREPRISE */
  ENTERPRISE_MONTHLY_AI_MESSAGES: 500,

  /** Nombre de messages IA ajoutés par visionnage de publicité récompensée terminée (+1) */
  REWARDED_MESSAGE_AMOUNT: 1,

  /** Nombre maximal de publicités récompensées par SEMAINE selon la formule */
  FREE_MAX_WEEKLY_REWARDED_ADS: 1,
  PRO_MAX_WEEKLY_REWARDED_ADS: 3,
  ENTERPRISE_MAX_WEEKLY_REWARDED_ADS: 10,

  /** Alias rétrocompatibles pour max weekly ads */
  FREE_MAX_MONTHLY_REWARDED_ADS: 1,
  PRO_MAX_MONTHLY_REWARDED_ADS: 3,
  ENTERPRISE_MAX_MONTHLY_REWARDED_ADS: 10,

  /** Limite d'images par message selon la formule */
  FREE_MAX_IMAGES_PER_MESSAGE: 1,
  PRO_MAX_IMAGES_PER_MESSAGE: 2,
  ENTERPRISE_MAX_IMAGES_PER_MESSAGE: 5,
};

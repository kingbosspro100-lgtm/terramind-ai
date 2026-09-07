/**
 * Service d'intégration officiel SASPAY - TerraMind AI
 * 
 * IMPORTANT:
 * - Aucune clé secrète ne doit être exposée dans le frontend, Git ou les logs.
 * - Ne simule JAMAIS un paiement réussi.
 * - Si les clés SASPAY ne sont pas encore configurées dans .env.local,
 *   signaler l'obligation de configuration manuelle.
 */

export type SasPayEnvironment = "sandbox" | "live" | "production";

export type SasPayTransactionStatus = "pending" | "approved" | "completed" | "failed" | "canceled" | "declined";

export interface SasPayTransactionParams {
  amount: number;
  currency?: string;
  description: string;
  reference: string;
  plan: "pro" | "enterprise";
  customerEmail?: string;
  customerName?: string;
  callbackUrl: string;
}

function getSasPayConfig() {
  const clientId = process.env.SASPAY_CLIENT_ID || "";
  const clientSecret = process.env.SASPAY_CLIENT_SECRET || "";
  const secretKey = process.env.SASPAY_SECRET_KEY || "";
  const baseUrl = (process.env.SASPAY_BASE_URL || "https://api.saspay.net/v1").replace(/\/$/, "");
  const env = (process.env.SASPAY_ENVIRONMENT as SasPayEnvironment) || "sandbox";

  const isConfigured = Boolean(secretKey || (clientId && clientSecret));

  return {
    clientId,
    clientSecret,
    secretKey,
    baseUrl,
    env,
    isConfigured,
  };
}

/**
 * Crée une transaction de paiement auprès de l'API officielle SASPAY.
 */
export async function createSasPayTransaction(params: SasPayTransactionParams): Promise<{
  success: boolean;
  transactionId?: string;
  reference: string;
  redirectUrl?: string;
  message?: string;
  requiresManualConfig?: boolean;
}> {
  const config = getSasPayConfig();

  if (!config.isConfigured) {
    console.warn("[SASPAY] Clés d'API non renseignées dans .env.local");
    return {
      success: false,
      reference: params.reference,
      message: "Configuration SASPAY incomplète. Veuillez renseigner SASPAY_SECRET_KEY ou SASPAY_CLIENT_ID et SASPAY_CLIENT_SECRET dans .env.local.",
      requiresManualConfig: true,
    };
  }

  try {
    const payload = {
      client_id: config.clientId,
      amount: params.amount,
      currency: params.currency || "XOF",
      description: params.description,
      reference: params.reference,
      customer: {
        email: params.customerEmail || "client@terramind.ai",
        name: params.customerName || "Utilisateur TerraMind",
      },
      redirect_url: params.callbackUrl,
      callback_url: params.callbackUrl,
      metadata: {
        plan: params.plan,
        reference: params.reference,
      },
    };

    const res = await fetch(`${config.baseUrl}/checkout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.secretKey || config.clientSecret}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || data.error || `Erreur HTTP ${res.status} lors de l'initialisation SASPAY.`;
      console.error("[SASPAY] Erreur création transaction:", errorMsg);
      return {
        success: false,
        reference: params.reference,
        message: errorMsg,
      };
    }

    const transactionId = data.transaction_id || data.id || data.reference || params.reference;
    const redirectUrl = data.checkout_url || data.redirect_url || data.payment_url;

    return {
      success: true,
      transactionId: String(transactionId),
      reference: params.reference,
      redirectUrl: redirectUrl || `${params.callbackUrl}&tx_id=${transactionId}`,
    };
  } catch (err: any) {
    console.error("[SASPAY] Exception serveur API SASPAY:", err);
    return {
      success: false,
      reference: params.reference,
      message: "Erreur de connexion aux serveurs SASPAY.",
    };
  }
}

/**
 * Interroge l'API officielle SASPAY pour vérifier le statut réel d'une transaction.
 * Ne simule JAMAIS la réussite du paiement.
 */
export async function getSasPayTransactionStatus(transactionIdOrRef: string): Promise<{
  success: boolean;
  status: SasPayTransactionStatus;
  amount?: number;
  reference?: string;
  metadata?: Record<string, any>;
  message?: string;
  requiresManualConfig?: boolean;
}> {
  const config = getSasPayConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      status: "pending",
      message: "Impossible de vérifier le paiement : clés SASPAY absentes dans .env.local.",
      requiresManualConfig: true,
    };
  }

  try {
    const res = await fetch(`${config.baseUrl}/transactions/${encodeURIComponent(transactionIdOrRef)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${config.secretKey || config.clientSecret}`,
        "Accept": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        status: "pending",
        message: data.message || "Vérification de la transaction non confirmée par SASPAY.",
      };
    }

    const rawStatus = (data.status || data.state || "pending").toLowerCase();
    const isApproved =
      rawStatus === "approved" ||
      rawStatus === "completed" ||
      rawStatus === "success" ||
      rawStatus === "paid";

    const status: SasPayTransactionStatus = isApproved
      ? "approved"
      : rawStatus === "failed" || rawStatus === "declined"
      ? "failed"
      : rawStatus === "canceled"
      ? "canceled"
      : "pending";

    return {
      success: true,
      status,
      amount: Number(data.amount) || undefined,
      reference: data.reference || transactionIdOrRef,
      metadata: data.metadata || {},
    };
  } catch (err: any) {
    console.error("[SASPAY] Erreur vérification transaction:", err);
    return {
      success: false,
      status: "pending",
      message: "Erreur réseau lors de la vérification SASPAY.",
    };
  }
}

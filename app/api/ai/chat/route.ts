import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helper";
import { getAiQuota, incrementAiUsage } from "@/lib/ai-quota";
import { getUserAgronomicContext } from "@/lib/user-context";
import { generateAIResponse, ChatMessage } from "@/services/ai";

// Dictionnaire simple pour le contrôle anti-spam des requêtes simultanées par utilisateur
const activeRequests = new Set<string>();

export async function POST(request: Request) {
  // 1. Authentification Supabase / Session
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message: "Authentification requise pour utiliser l'Assistant IA TerraMind.",
      },
      { status: 401 }
    );
  }

  // 2. Protection Anti-Spam (contrôle des requêtes simultanées par utilisateur)
  if (activeRequests.has(user.id)) {
    return NextResponse.json(
      {
        error: "TOO_MANY_REQUESTS",
        message: "Une analyse est déjà en cours d'exécution. Veuillez patienter.",
      },
      { status: 429 }
    );
  }

  activeRequests.add(user.id);

  try {
    // 3. Vérification du quota MENSUEL depuis Supabase (source de vérité serveur)
    const quota = await getAiQuota(user.id);

    if (!quota.canSendMessage) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message: "Votre quota mensuel de messages IA est épuisé.",
          plan: quota.plan,
          limit: quota.monthlyQuota,
          used: quota.messagesUsed,
          quota,
        },
        { status: 429 }
      );
    }

    // 4. Validation des données du corps de la requête
    const body = await request.json().catch(() => ({}));
    const userMessage: string = body.message?.trim() || "";
    const MAX_MESSAGE_LENGTH = 4000;

    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: "MESSAGE_TOO_LONG",
          message: `Votre message est trop long. La limite est de ${MAX_MESSAGE_LENGTH} caractères.`,
        },
        { status: 400 }
      );
    }

    // Traitement des images jointes (compatibilité image unique et tableau d'images)
    const rawImages: string[] = [];
    if (body.images && Array.isArray(body.images)) {
      rawImages.push(...body.images.filter((img: any) => typeof img === "string" && img.startsWith("data:")));
    }
    const singleImagePayload: string | undefined = body.file || body.image;
    if (singleImagePayload && typeof singleImagePayload === "string" && singleImagePayload.startsWith("data:")) {
      if (!rawImages.includes(singleImagePayload)) {
        rawImages.push(singleImagePayload);
      }
    }

    // Verification du respect de la limite d'images par message côté SERVEUR
    const maxAllowedImages = quota.maxImagesPerMessage;
    if (rawImages.length > maxAllowedImages) {
      return NextResponse.json(
        {
          error: "TOO_MANY_IMAGES",
          message: `Votre formule ${quota.plan.toUpperCase()} autorise un maximum de ${maxAllowedImages} image${
            maxAllowedImages > 1 ? "s" : ""
          } par message. Vous en avez envoyé ${rawImages.length}.`,
          limit: maxAllowedImages,
          provided: rawImages.length,
          plan: quota.plan,
        },
        { status: 400 }
      );
    }

    if (!userMessage && rawImages.length === 0) {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "Veuillez saisir un message ou joindre une image/fichier.",
        },
        { status: 400 }
      );
    }

    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];

    // 5. Préparation des messages à transmettre au service IA (avec historique récent)
    const messagesToAI: ChatMessage[] = [];

    if (history.length > 0) {
      const recentHistory = history.slice(-10).map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
        image: m.image,
        images: m.images,
      }));
      messagesToAI.push(...recentHistory);
    }

    // Ajouter le nouveau message s'il n'est pas déjà dans l'historique
    const lastHistoryMsg = history[history.length - 1];
    if (!lastHistoryMsg || lastHistoryMsg.content !== userMessage) {
      messagesToAI.push({
        role: "user",
        content: userMessage || "Merci d'analyser les images/fichiers joints.",
        image: rawImages[0],
        images: rawImages,
      });
    }

    // 6. Extraction sécurisée du contexte agronomique de l'utilisateur connecté (exploitations & cultures)
    const userContext = await getUserAgronomicContext(user.id);

    // 7. Appel au fournisseur IA (Gemini Flash dynamique)
    let aiResponseText = "";
    try {
      aiResponseText = await generateAIResponse(messagesToAI, undefined, userContext);
    } catch (aiError: any) {
      console.error("Erreur lors de l'appel au fournisseur IA:", aiError);
      // Ne PAS consommer de quota si le fournisseur IA échoue
      return NextResponse.json(
        {
          error: "AI_PROVIDER_ERROR",
          message: "Le service IA est temporairement indisponible ou surchargé. Réessayez dans un instant.",
        },
        { status: 502 }
      );
    }

    // 8. Incrémentation/Consommation du quota mensuel UNIQUEMENT après succès de la réponse IA
    const updatedQuota = await incrementAiUsage(user.id);

    // 9. Retour de la réponse au client
    return NextResponse.json({
      message: aiResponseText,
      quota: updatedQuota,
    });
  } catch (error: any) {
    console.error("Erreur serveur dans /api/ai/chat:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Une erreur interne est survenue lors du traitement de votre demande.",
      },
      { status: 500 }
    );
  } finally {
    activeRequests.delete(user.id);
  }
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message: "Authentification requise.",
      },
      { status: 401 }
    );
  }

  const quota = await getAiQuota(user.id);
  return NextResponse.json({ quota });
}

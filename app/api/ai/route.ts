import { POST as chatPOST, GET as chatGET } from "./chat/route";

/**
 * Route /api/ai pour assurer la compatibilité ascendante avec les anciens appels.
 * Redirige l'ensemble du traitement vers la route principale /api/ai/chat.
 */
export async function POST(request: Request) {
  return chatPOST(request);
}

export async function GET() {
  return chatGET();
}

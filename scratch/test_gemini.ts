import { generateAIResponse } from "../services/ai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testFixedAI() {
  console.log("=== TEST DE RESOLUTION IA TERRAMIND ===");
  try {
    const response = await generateAIResponse([
      { role: "user", content: "Bonjour TerraMind ! Quel est ton rôle ?" }
    ]);
    console.log("✅ RÉPONSE IA REÇUE AVEC SUCCÈS :");
    console.log(response);
  } catch (err: any) {
    console.error("❌ ERREUR GENERATION IA:", err.message);
  }
}

testFixedAI();

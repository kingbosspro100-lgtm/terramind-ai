import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function listAndTest() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 12)}...` : "MISSING");

  if (!apiKey) return;

  const ai = new GoogleGenAI({ apiKey });

  const modelsToTest = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

  for (const m of modelsToTest) {
    try {
      console.log(`Testing model: ${m}...`);
      const res = await ai.models.generateContent({
        model: m,
        contents: "Bonjour !",
      });
      console.log(`✅ SUCCESS with ${m}:`, res.text);
      return;
    } catch (e: any) {
      console.error(`❌ ERROR with ${m}:`, e.message);
    }
  }
}

listAndTest();

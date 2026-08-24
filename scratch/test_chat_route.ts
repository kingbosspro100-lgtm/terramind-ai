import { getAiQuota, incrementAiUsage, ensureValidUuid } from "../lib/ai-quota";

async function testQuotaFlow() {
  console.log("=== TEST RESILIENCE COMPTEUR & USER ID NON-UUID ===");

  const testUserId = "google-user-id-test-123";
  const validUuid = ensureValidUuid(testUserId);
  console.log("Input User ID:", testUserId);
  console.log("Deterministic UUID:", validUuid);

  // 1. Fetch quota for non-UUID user ID
  const quota = await getAiQuota(testUserId);
  console.log("Quota fetched cleanly:", quota.plan, "Available:", quota.totalMessagesAvailable);

  // 2. Increment AI usage cleanly
  const updated = await incrementAiUsage(testUserId);
  console.log("Quota incremented cleanly. Used:", updated.messagesUsed);

  console.log("✅ SUCCÈS : Aucune exception 500 n'a été levée.");
}

testQuotaFlow().catch((e) => {
  console.error("❌ ECHEC TEST:", e);
});

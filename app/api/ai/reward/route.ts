import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helper";
import {
  initAdRewardSession,
  verifyAndClaimAdRewardSession,
} from "@/lib/ad-reward-server";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      { message: "Authentification requise pour réclamer une récompense." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const action = body.action || "verify";

  if (action === "init") {
    const initResult = await initAdRewardSession(user.id);
    if (!initResult.success) {
      return NextResponse.json(
        { message: initResult.message, quota: initResult.quota },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      adSessionId: initResult.adSessionId,
      adUnitPath: initResult.adUnitPath,
      quota: initResult.quota,
    });
  }

  const adSessionId = body.adSessionId;
  const gptGranted = body.gptGranted !== false; // true par défaut sauf si transmis comme false

  const result = await verifyAndClaimAdRewardSession(user.id, adSessionId, gptGranted);

  if (!result.success) {
    return NextResponse.json(
      { message: result.message, quota: result.quota },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: result.message,
    quota: result.quota,
  });
}

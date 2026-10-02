import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { isSupportedCountry } from "@/lib/services/exploitations";
import { isAdmin } from "@/services/admin";

const MAX_IMPORT_ROWS = 500;
const MAX_REQUEST_BYTES = 1_000_000;

type IncomingPrice = {
  product_name?: unknown;
  market_name?: unknown;
  country?: unknown;
  department?: unknown;
  price_fcfa?: unknown;
  unit?: unknown;
  recorded_at?: unknown;
};

function parsePrice(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const normalized = String(value).replace(/[\s\u00a0]/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  const amount = Number(normalized);
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

function parseRecordedAt(value: unknown): string | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  const dateInput = /^\d{4}-\d{2}-\d{2}$/.test(normalized)
    ? `${normalized}T12:00:00.000Z`
    : normalized;
  const date = new Date(dateInput);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Le fichier dépasse la taille maximale autorisée." }, { status: 413 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.prices) || body.prices.length === 0) {
    return NextResponse.json({ error: "Aucun relevé valide à importer." }, { status: 400 });
  }
  if (body.prices.length > MAX_IMPORT_ROWS) {
    return NextResponse.json({ error: `La limite est de ${MAX_IMPORT_ROWS} relevés par import.` }, { status: 400 });
  }

  const invalidRows: number[] = [];
  const rows = body.prices.flatMap((item: IncomingPrice, index: number) => {
    if (!item || typeof item !== "object") {
      invalidRows.push(index + 2);
      return [];
    }

    const productName = typeof item.product_name === "string" ? item.product_name.trim() : "";
    const marketName = typeof item.market_name === "string" ? item.market_name.trim() : "";
    const country = typeof item.country === "string" ? item.country.trim() : "";
    const department = typeof item.department === "string" ? item.department.trim() : "";
    const unit = typeof item.unit === "string" ? item.unit.trim() : "";
    const price = parsePrice(item.price_fcfa);
    const recordedAt = parseRecordedAt(item.recorded_at);

    if (
      !productName || productName.length > 120 ||
      !marketName || marketName.length > 120 ||
      !isSupportedCountry(country) ||
      department.length > 120 ||
      !unit || unit.length > 40 ||
      price === null || recordedAt === null
    ) {
      invalidRows.push(index + 2);
      return [];
    }

    return [{
      product_name: productName,
      market_name: marketName,
      country,
      ...(department ? { department } : {}),
      price_fcfa: price,
      unit,
      ...(recordedAt ? { recorded_at: recordedAt } : {}),
    }];
  });

  if (invalidRows.length > 0) {
    return NextResponse.json({
      error: "Import annulé : certaines lignes sont invalides.",
      invalidRows: invalidRows.slice(0, 30),
      invalidRowCount: invalidRows.length,
    }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("market_prices")
      .insert(rows)
      .select("id");

    if (error) {
      console.error("Import des prix de marché impossible:", error.message);
      return NextResponse.json({ error: "L’enregistrement des relevés a échoué." }, { status: 500 });
    }

    return NextResponse.json({ imported: data?.length ?? rows.length });
  } catch (error) {
    console.error("Import des prix de marché impossible:", error);
    return NextResponse.json({ error: "Le service d’import est indisponible." }, { status: 500 });
  }
}
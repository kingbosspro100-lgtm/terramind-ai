"use client";

import { ChangeEvent, useState } from "react";
import { ArrowLeft, Check, FileSpreadsheet, Upload } from "lucide-react";
import * as XLSX from "xlsx";

type MarketPriceRow = {
  product_name: string;
  market_name: string;
  country: string;
  department?: string;
  price_fcfa: string | number;
  unit: string;
  recorded_at?: string;
};

type ImportResult = {
  imported?: number;
  error?: string;
  invalidRows?: number[];
  invalidRowCount?: number;
};

const HEADER_ALIASES: Record<keyof MarketPriceRow, string[]> = {
  product_name: ["product_name", "produit", "nom_produit"],
  market_name: ["market_name", "marche", "nom_marche"],
  country: ["country", "pays"],
  department: ["department", "departement", "region", "région"],
  price_fcfa: ["price_fcfa", "prix_fcfa", "prix"],
  unit: ["unit", "unite"],
  recorded_at: ["recorded_at", "date", "date_releve"],
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function mapRows(rows: Record<string, unknown>[]): MarketPriceRow[] {
  return rows.map((row) => {
    const normalized = new Map(
      Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]),
    );
    const getValue = (field: keyof MarketPriceRow) => {
      const key = HEADER_ALIASES[field].find((alias) => normalized.has(alias));
      return key ? normalized.get(key) : "";
    };
    const dateValue = getValue("recorded_at");

    return {
      product_name: String(getValue("product_name") ?? "").trim(),
      market_name: String(getValue("market_name") ?? "").trim(),
      country: String(getValue("country") ?? "").trim(),
      department: String(getValue("department") ?? "").trim(),
      price_fcfa: String(getValue("price_fcfa") ?? "").trim(),
      unit: String(getValue("unit") ?? "").trim(),
      ...(dateValue instanceof Date
        ? { recorded_at: dateValue.toISOString() }
        : dateValue
          ? { recorded_at: String(dateValue).trim() }
          : {}),
    };
  }).filter((row) => Object.values(row).some(Boolean));
}

export default function AdminMarketPricesPage() {
  const [fileName, setFileName] = useState("");
  const [prices, setPrices] = useState<MarketPriceRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [invalidRows, setInvalidRows] = useState<number[]>([]);
  const [imported, setImported] = useState<number | null>(null);

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPrices([]);
    setImported(null);
    setInvalidRows([]);
    setError("");
    setFileName(file?.name ?? "");
    if (!file) return;

    if (file.size > 2_000_000) {
      setError("Le fichier ne peut pas dépasser 2 Mo.");
      return;
    }

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!firstSheet) {
        setError("Le fichier ne contient aucune feuille exploitable.");
        return;
      }
      const sourceRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
        defval: "",
        raw: false,
      });
      const parsedRows = mapRows(sourceRows);
      if (parsedRows.length === 0) {
        setError("Aucun relevé trouvé dans la première feuille.");
        return;
      }
      if (parsedRows.length > 500) {
        setError("La limite est de 500 relevés par import.");
        return;
      }
      setPrices(parsedRows);
    } catch {
      setError("Ce fichier n’a pas pu être lu. Utilisez un CSV ou un classeur Excel valide.");
    }
  }

  async function importPrices() {
    if (prices.length === 0 || busy) return;
    setBusy(true);
    setError("");
    setInvalidRows([]);
    setImported(null);
    try {
      const response = await fetch("/api/admin/market-prices/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices }),
      });
      const result = (await response.json()) as ImportResult;
      if (!response.ok) {
        setError(result.error || "L’import a échoué.");
        setInvalidRows(result.invalidRows ?? []);
        return;
      }
      setImported(result.imported ?? prices.length);
      setPrices([]);
      setFileName("");
    } catch {
      setError("Impossible de joindre le service d’import. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <a href="/admin" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
          <ArrowLeft size={16} aria-hidden="true" /> Administration
        </a>
        <header className="mt-6 border-b border-white/10 pb-6">
          <p className="text-sm font-medium text-emerald-400">TerraMind AI</p>
          <h1 className="mt-1 text-3xl font-bold">Import des prix de marché</h1>
          <p className="mt-2 text-sm text-slate-400">Importez des relevés vérifiés depuis un fichier CSV ou Excel.</p>
        </header>

        <section className="mt-8 space-y-5">
          <div>
            <label htmlFor="market-file" className="mb-2 block text-sm font-medium text-slate-200">
              Fichier de relevés
            </label>
            <input
              id="market-file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={selectFile}
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:font-medium file:text-white hover:file:bg-emerald-600"
            />
            <p className="mt-2 text-xs text-slate-400">
              Colonnes requises : produit, marché, pays, prix_fcfa, unité. Département/région et date (AAAA-MM-JJ) facultatifs. 500 lignes maximum, 2 Mo.
            </p>
          </div>

          {fileName && prices.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
              <p className="flex items-center gap-2 text-sm text-slate-200">
                <FileSpreadsheet size={18} className="text-emerald-400" aria-hidden="true" />
                <span>{fileName} · {prices.length} relevé(s)</span>
              </p>
              <button
                type="button"
                onClick={importPrices}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload size={16} aria-hidden="true" />
                {busy ? "Import en cours…" : `Importer ${prices.length} relevé(s)`}
              </button>
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              <p>{error}</p>
              {invalidRows.length > 0 && (
                <p className="mt-1">Lignes à corriger : {invalidRows.join(", ")}{invalidRows.length >= 30 ? "…" : ""}</p>
              )}
            </div>
          )}

          {imported !== null && (
            <p role="status" className="flex items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
              <Check size={17} aria-hidden="true" /> {imported} relevé(s) enregistré(s).
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
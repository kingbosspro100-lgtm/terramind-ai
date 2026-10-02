import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const RESEND_URL = "https://api.resend.com/emails";
const MAX_FARMS_PER_RUN = 1000;
const CONCURRENCY = 4;

type Farm = {
  id: string;
  user_id: string;
  name: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
};

type AuthUser = { id: string; email?: string | null };
type WeatherAlert = { code: string; title: string; recommendation: string };

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

async function loadExploitations(admin: ReturnType<typeof createAdminClient>): Promise<Farm[]> {
  const farms: Farm[] = [];
  for (let offset = 0; offset < MAX_FARMS_PER_RUN; offset += 500) {
    const { data, error } = await admin
      .from("exploitations")
      .select("id,user_id,name,country,city,latitude,longitude")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .range(offset, Math.min(offset + 499, MAX_FARMS_PER_RUN - 1));
    if (error) throw error;
    farms.push(...((data ?? []) as Farm[]));
    if (!data || data.length < 500) break;
  }
  return farms.filter((farm) => ["Bénin", "Côte d'Ivoire", "Cameroun", "Sénégal"].includes(farm.country));
}

async function loadUserEmails(admin: ReturnType<typeof createAdminClient>) {
  const emails = new Map<string, string>();
  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const users = data.users as AuthUser[];
    for (const user of users) if (user.email) emails.set(user.id, user.email);
    if (users.length < 1000) break;
  }
  return emails;
}

async function getWeatherAlerts(farm: Farm): Promise<WeatherAlert[]> {
  const params = new URLSearchParams({
    latitude: String(farm.latitude),
    longitude: String(farm.longitude),
    hourly: "precipitation,wind_speed_10m,temperature_2m",
    forecast_hours: "24",
    timezone: "auto",
  });
  const response = await fetch(`${OPEN_METEO_URL}?${params}`, { next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);

  const result = await response.json();
  const precipitation = (result.hourly?.precipitation ?? []).reduce((sum: number, value: number) => sum + (Number(value) || 0), 0);
  const maxWind = Math.max(0, ...(result.hourly?.wind_speed_10m ?? []).map(Number));
  const maxTemp = Math.max(-100, ...(result.hourly?.temperature_2m ?? []).map(Number));
  const alerts: WeatherAlert[] = [];

  if (precipitation > 20) alerts.push({ code: "rain", title: `Forte pluie attendue (${Math.round(precipitation)} mm/24 h)`, recommendation: "Suspendre les épandages et vérifier le drainage des parcelles." });
  if (maxWind > 40) alerts.push({ code: "wind", title: `Vent fort attendu (${Math.round(maxWind)} km/h)`, recommendation: "Éviter les pulvérisations et sécuriser les jeunes plants." });
  if (maxTemp >= 40) alerts.push({ code: "heat", title: `Chaleur extrême attendue (${Math.round(maxTemp)} °C)`, recommendation: "Prévoir l’irrigation tôt le matin et protéger les cultures sensibles." });
  if (precipitation < 1 && maxTemp >= 35) alerts.push({ code: "dry", title: "Risque de stress hydrique", recommendation: "Contrôler l’humidité du sol et planifier l’irrigation." });
  return alerts;
}

async function sendAlertEmail(email: string, farm: Farm, alerts: WeatherAlert[]) {
  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [email],
      subject: `Alerte météo agricole · ${farm.name}`,
      text: [
        `Exploitation : ${farm.name}`,
        `Lieu : ${farm.city}, ${farm.country}`,
        "",
        ...alerts.flatMap((alert) => [`• ${alert.title}`, `  Recommandation : ${alert.recommendation}`]),
        "",
        "Prévisions fournies par Open-Meteo.",
      ].join("\n"),
    }),
  });
  if (!response.ok) throw new Error(`Resend HTTP ${response.status}`);
}

async function processFarm(
  admin: ReturnType<typeof createAdminClient>,
  farm: Farm,
  email: string | undefined,
  alertDate: string,
) {
  if (!email) return { sent: 0, skipped: 1, failed: 0 };
  const alerts = await getWeatherAlerts(farm);
  if (!alerts.length) return { sent: 0, skipped: 1, failed: 0 };

  const signature = alerts.map((alert) => alert.code).sort().join(",");
  const { data: reservation, error: reserveError } = await admin
    .from("weather_alert_deliveries")
    .insert({ farm_source: "exploitations", farm_id: farm.id, alert_date: alertDate, alert_signature: signature })
    .select("id")
    .maybeSingle();

  if (reserveError?.code === "23505") return { sent: 0, skipped: 1, failed: 0 };
  if (reserveError) throw reserveError;
  if (!reservation) return { sent: 0, skipped: 1, failed: 0 };

  try {
    await sendAlertEmail(email, farm, alerts);
    return { sent: 1, skipped: 0, failed: 0 };
  } catch (error) {
    await admin.from("weather_alert_deliveries").delete().eq("id", reservation.id);
    console.error(`Envoi d’alerte météo impossible pour l’exploitation ${farm.id}:`, error);
    return { sent: 0, skipped: 0, failed: 1 };
  }
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json({ error: "Configurer SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY et RESEND_FROM_EMAIL pour activer les alertes e-mail." }, { status: 503 });
  }

  try {
    const admin = createAdminClient();
    const [farms, emails] = await Promise.all([loadExploitations(admin), loadUserEmails(admin)]);
    const alertDate = new Date().toISOString().slice(0, 10);
    const totals = { scanned: farms.length, sent: 0, skipped: 0, failed: 0 };

    for (let start = 0; start < farms.length; start += CONCURRENCY) {
      const batch = farms.slice(start, start + CONCURRENCY);
      const results = await Promise.all(batch.map((farm) => processFarm(admin, farm, emails.get(farm.user_id), alertDate)
        .catch((error) => {
          console.error(`Analyse météo impossible pour l’exploitation ${farm.id}:`, error);
          return { sent: 0, skipped: 0, failed: 1 };
        })));
      for (const result of results) {
        totals.sent += result.sent;
        totals.skipped += result.skipped;
        totals.failed += result.failed;
      }
    }

    return NextResponse.json({ success: true, ...totals });
  } catch (error) {
    console.error("Cron d’alertes météo en échec:", error);
    return NextResponse.json({ error: "Impossible de traiter les alertes météo." }, { status: 500 });
  }
}

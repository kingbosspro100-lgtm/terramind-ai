import { createAdminClient } from "@/lib/supabase-admin";

type Row = Record<string, unknown>;
type AuthUserRow = {
  id: string;
  email?: string | null;
  phone?: string | null;
  created_at: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

type UserCounts = {
  exploitations: number;
  cultures: number;
  stockItems: number;
  transactions: number;
  payments: number;
  products: number;
  aiMessages: number;
};

export type AdminUserRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  role: string;
  plan: "Free" | "Pro" | "Entreprise";
  status: "Actif" | "Suspendu" | "Suppression prévue";
  createdAt: string;
  counts: UserCounts;
};

async function fetchAllRows<T extends Row>(
  admin: ReturnType<typeof createAdminClient>,
  table: string,
  columns: string,
): Promise<T[]> {
  const rows: T[] = [];
  const pageSize = 1000;

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await admin
      .from(table)
      .select(columns)
      .range(offset, offset + pageSize - 1);

    if (error) {
      if (error.code === "42P01" || error.code === "PGRST205") return rows;
      throw new Error(`Lecture admin de ${table} impossible: ${error.message}`);
    }

    const page = (data ?? []) as unknown as T[];
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

function incrementCounts(rows: Row[], key: string, counts: Map<string, number>) {
  for (const row of rows) {
    const userId = row[key];
    if (typeof userId === "string") counts.set(userId, (counts.get(userId) ?? 0) + 1);
  }
}

function countFor(counts: Map<string, number>, userId: string) {
  return counts.get(userId) ?? 0;
}

function normalizedPlan(value: unknown): AdminUserRecord["plan"] {
  const plan = String(value ?? "").toLowerCase();
  if (plan === "pro") return "Pro";
  if (plan === "entreprise" || plan === "enterprise") return "Entreprise";
  return "Free";
}

export async function getAdminUserDirectory(): Promise<AdminUserRecord[]> {
  const admin = createAdminClient();
  const authUsers: AuthUserRow[] = [];

  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Lecture des comptes Auth impossible: ${error.message}`);
    const users = data.users as AuthUserRow[];
    authUsers.push(...users);
    if (users.length < 1000) break;
  }

  const [
    userProfiles,
    profiles,
    farms,
    exploitations,
    plots,
    crops,
    cultures,
    stock,
    stocks,
    inventoryItems,
    transactions,
    payments,
    subscriptions,
    abonnements,
    aiUsage,
    products,
    storeProducts,
  ] = await Promise.all([
    fetchAllRows<Row>(admin, "users_profile", "id,full_name,phone,company_name,role"),
    fetchAllRows<Row>(admin, "profiles", "id,full_name,phone,country,created_at"),
    fetchAllRows<Row>(admin, "farms", "id,user_id"),
    fetchAllRows<Row>(admin, "exploitations", "id,user_id"),
    fetchAllRows<Row>(admin, "plots", "id,farm_id"),
    fetchAllRows<Row>(admin, "crops", "id,plot_id"),
    fetchAllRows<Row>(admin, "cultures", "id,user_id"),
    fetchAllRows<Row>(admin, "stock", "id,user_id"),
    fetchAllRows<Row>(admin, "stocks", "id,user_id"),
    fetchAllRows<Row>(admin, "inventory_items", "id,user_id"),
    fetchAllRows<Row>(admin, "transactions", "id,user_id"),
    fetchAllRows<Row>(admin, "payments", "id,user_id"),
    fetchAllRows<Row>(admin, "subscriptions", "id,user_id,plan,status,amount"),
    fetchAllRows<Row>(admin, "abonnements", "id,user_id,plan,status,expires_at"),
    fetchAllRows<Row>(admin, "ai_usage", "user_id,message_count,month_start"),
    fetchAllRows<Row>(admin, "products", "id,user_id"),
    fetchAllRows<Row>(admin, "store_products", "id,seller_id"),
  ]);

  const profilesById = new Map(profiles.map((row) => [String(row.id), row]));
  const userProfilesById = new Map(userProfiles.map((row) => [String(row.id), row]));
  const farmOwners = new Map(farms.map((row) => [String(row.id), String(row.user_id)]));
  const plotOwners = new Map<string, string>();
  for (const plot of plots) {
    const userId = farmOwners.get(String(plot.farm_id));
    if (userId) plotOwners.set(String(plot.id), userId);
  }

  const legacyCropCounts = new Map<string, number>();
  for (const crop of crops) {
    const userId = plotOwners.get(String(crop.plot_id));
    if (userId) legacyCropCounts.set(userId, (legacyCropCounts.get(userId) ?? 0) + 1);
  }

  const exploitationCounts = new Map<string, number>();
  const cultureCounts = new Map<string, number>();
  const stockCounts = new Map<string, number>();
  const transactionCounts = new Map<string, number>();
  const paymentCounts = new Map<string, number>();
  const productCounts = new Map<string, number>();
  const messageCounts = new Map<string, number>();
  incrementCounts(farms, "user_id", exploitationCounts);
  incrementCounts(exploitations, "user_id", exploitationCounts);
  incrementCounts(cultures, "user_id", cultureCounts);
  incrementCounts(stock, "user_id", stockCounts);
  incrementCounts(stocks, "user_id", stockCounts);
  incrementCounts(inventoryItems, "user_id", stockCounts);
  incrementCounts(transactions, "user_id", transactionCounts);
  incrementCounts(payments, "user_id", paymentCounts);
  incrementCounts(products, "user_id", productCounts);
  incrementCounts(storeProducts, "seller_id", productCounts);
  for (const usage of aiUsage) {
    const userId = usage.user_id;
    if (typeof userId === "string") {
      messageCounts.set(userId, (messageCounts.get(userId) ?? 0) + Number(usage.message_count ?? 0));
    }
  }

  const planByUser = new Map<string, { plan: AdminUserRecord["plan"]; active: boolean }>();
  for (const subscription of subscriptions) {
    if (typeof subscription.user_id === "string") {
      const active = String(subscription.status).toLowerCase() === "active";
      planByUser.set(subscription.user_id, { plan: normalizedPlan(subscription.plan), active });
    }
  }
  for (const subscription of abonnements) {
    if (typeof subscription.user_id === "string") {
      const status = String(subscription.status).toLowerCase();
      const expiresAt = subscription.expires_at ? new Date(String(subscription.expires_at)).getTime() : Infinity;
      const active = (status === "active" || status === "trialing") && expiresAt > Date.now();
      planByUser.set(subscription.user_id, { plan: normalizedPlan(active ? subscription.plan : "free"), active });
    }
  }

  return authUsers.map((user) => {
    const profile = profilesById.get(user.id);
    const userProfile = userProfilesById.get(user.id);
    const plan = planByUser.get(user.id);
    const userMetadata = user.user_metadata ?? {};
    const pendingDeletion = Boolean(user.app_metadata?.pending_deletion_at);

    return {
      id: user.id,
      fullName: String(userProfile?.full_name || profile?.full_name || userMetadata.full_name || "Utilisateur"),
      email: user.email ?? "",
      phone: String(user.phone || userProfile?.phone || profile?.phone || userMetadata.phone || ""),
      companyName: String(userProfile?.company_name || userMetadata.company_name || ""),
      country: String(profile?.country || ""),
      role: String(userProfile?.role || "Agriculteur"),
      plan: plan?.active ? plan.plan : "Free",
      status: pendingDeletion ? "Suppression prévue" : "Actif",
      createdAt: user.created_at,
      counts: {
        exploitations: countFor(exploitationCounts, user.id),
        cultures: countFor(cultureCounts, user.id) + countFor(legacyCropCounts, user.id),
        stockItems: countFor(stockCounts, user.id),
        transactions: countFor(transactionCounts, user.id),
        payments: countFor(paymentCounts, user.id),
        products: countFor(productCounts, user.id),
        aiMessages: countFor(messageCounts, user.id),
      },
    };
  });
}

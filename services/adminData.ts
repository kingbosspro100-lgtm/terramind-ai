import { createAdminClient } from "@/lib/supabase-admin";
import { getAdminUserDirectory } from "@/services/adminUsers";

export type AdminPayment = {
  id: string;
  user_id: string;
  amount: number | string | null;
  status: string | null;
  created_at: string | null;
  plan: string | null;
  payment_method: string | null;
  reference: string | null;
};

type BillingRow = {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  amount?: number | string | null;
  created_at: string | null;
  updated_at: string | null;
  expires_at?: string | null;
};

type PaymentRow = AdminPayment;
type ExpenseRow = { amount: number | string | null };
type DataRow = Record<string, unknown>;

async function fetchRows<T extends DataRow>(table: string, columns: string): Promise<T[]> {
  const admin = createAdminClient();
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

async function getBillingRows() {
  const [legacySubscriptions, v1Subscriptions, payments, expenses] = await Promise.all([
    fetchRows<BillingRow>("subscriptions", "id,user_id,plan,status,amount,created_at,updated_at"),
    fetchRows<BillingRow>("abonnements", "id,user_id,plan,status,created_at,updated_at,expires_at"),
    fetchRows<PaymentRow>("payments", "id,user_id,amount,status,created_at,plan,payment_method,reference"),
    fetchRows<ExpenseRow>("acquisition_expenses", "amount"),
  ]);

  const subscriptionsByUser = new Map<string, BillingRow>();
  for (const subscription of legacySubscriptions) subscriptionsByUser.set(subscription.user_id, subscription);
  for (const subscription of v1Subscriptions) subscriptionsByUser.set(subscription.user_id, subscription);

  return {
    subscriptions: [...subscriptionsByUser.values()],
    payments,
    expenses,
  };
}

function monthlyAmount(subscription: BillingRow): number {
  const storedAmount = Number(subscription.amount ?? 0);
  if (storedAmount > 0) return storedAmount;
  const plan = subscription.plan.toLowerCase();
  if (plan === "pro") return 2500;
  if (plan === "entreprise" || plan === "enterprise") return 25000;
  return 0;
}

function startDate(subscription: BillingRow): Date {
  return new Date(subscription.created_at ?? 0);
}

function endDate(subscription: BillingRow): Date | null {
  const status = subscription.status.toLowerCase();
  if (status === "expired" && subscription.expires_at) return new Date(subscription.expires_at);
  if (status === "cancelled" || status === "expired" || status === "past_due") {
    return new Date(subscription.updated_at ?? subscription.created_at ?? 0);
  }
  if (subscription.expires_at) return new Date(subscription.expires_at);
  return null;
}

function activeAt(subscription: BillingRow, date: Date): boolean {
  const status = subscription.status.toLowerCase();
  if (status !== "active" && status !== "trialing") return false;
  const started = startDate(subscription);
  const ends = endDate(subscription);
  return started <= date && (!ends || ends > date);
}

function monthStartDate(offset: number, now: Date) {
  return new Date(now.getFullYear(), now.getMonth() + offset, 1);
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

export async function getAdminAnalytics() {
  const [{ subscriptions, payments, expenses }, users] = await Promise.all([
    getBillingRows(),
    getAdminUserDirectory(),
  ]);
  const currentDate = new Date();
  const activeSubscriptions = subscriptions.filter((subscription) => activeAt(subscription, currentDate));
  const activeCustomers = new Set(activeSubscriptions.map((subscription) => subscription.user_id));
  const paidStatuses = new Set(["approved", "paid", "completed"]);
  const confirmedPayments = payments.filter((payment) => paidStatuses.has(String(payment.status).toLowerCase()));
  const totalRevenue = confirmedPayments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const mrr = activeSubscriptions.reduce((sum, subscription) => sum + monthlyAmount(subscription), 0);
  const arpu = activeCustomers.size ? mrr / activeCustomers.size : 0;
  const acquisitionExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);
  const cac = activeCustomers.size ? acquisitionExpenses / activeCustomers.size : 0;
  const cancelledSubscriptions = subscriptions.filter((subscription) => {
    const status = subscription.status.toLowerCase();
    return status === "cancelled" || status === "expired" || status === "past_due";
  });
  const churnRate = subscriptions.length ? cancelledSubscriptions.length / subscriptions.length : 0;
  const ltv = arpu / (churnRate || 0.01);
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  return {
    users: {
      total: users.length,
      free: users.filter((user) => user.plan === "Free").length,
      pro: users.filter((user) => user.plan === "Pro").length,
      enterprise: users.filter((user) => user.plan === "Entreprise").length,
      paying: activeCustomers.size,
    },
    revenue: { total: totalRevenue, mrr, arpu },
    acquisition: { totalExpenses: acquisitionExpenses, cac },
    churn: { rate: churnRate, cancelled: cancelledSubscriptions.length },
    ltv: { value: ltv, ratio: ltvCacRatio, healthy: ltvCacRatio >= 3 },
    subscriptions: { active: activeSubscriptions.length, total: subscriptions.length },
  };
}

export async function getAdminPayments(): Promise<AdminPayment[]> {
  const { payments } = await getBillingRows();
  return payments
    .filter((payment) => ["approved", "paid", "completed"].includes(String(payment.status).toLowerCase()))
    .sort((left, right) => new Date(right.created_at ?? 0).getTime() - new Date(left.created_at ?? 0).getTime());
}

export async function getMonthlyMRR(months = 6) {
  const { subscriptions } = await getBillingRows();
  const now = new Date();
  const result: { month: string; mrr: number }[] = [];

  for (let offset = 1 - months; offset <= 0; offset += 1) {
    const month = monthStartDate(offset, now);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
    const mrr = subscriptions
      .filter((subscription) => activeAt(subscription, end))
      .reduce((sum, subscription) => sum + monthlyAmount(subscription), 0);
    result.push({ month: monthLabel(month), mrr });
  }

  return result;
}

export async function getMonthlyGrowth(months = 6) {
  const { subscriptions } = await getBillingRows();
  const now = new Date();
  const result: { month: string; newCustomers: number; churnedCustomers: number; mrr: number }[] = [];

  for (let offset = 1 - months; offset <= 0; offset += 1) {
    const start = monthStartDate(offset, now);
    const end = monthStartDate(offset + 1, now);
    const churnedCustomers = subscriptions.filter((subscription) => {
      const ended = endDate(subscription);
      return ended && ended >= start && ended < end && ["cancelled", "expired", "past_due"].includes(subscription.status.toLowerCase());
    }).length;
    const mrr = subscriptions
      .filter((subscription) => activeAt(subscription, new Date(end.getTime() - 1)))
      .reduce((sum, subscription) => sum + monthlyAmount(subscription), 0);

    result.push({
      month: monthLabel(start),
      newCustomers: subscriptions.filter((subscription) => startDate(subscription) >= start && startDate(subscription) < end).length,
      churnedCustomers,
      mrr,
    });
  }

  return result;
}

export async function getMonthlyChurn(months = 6) {
  const { subscriptions } = await getBillingRows();
  const now = new Date();
  const result: { month: string; startingCustomers: number; cancelledCustomers: number; churnRate: number }[] = [];

  for (let offset = 1 - months; offset <= 0; offset += 1) {
    const start = monthStartDate(offset, now);
    const end = monthStartDate(offset + 1, now);
    const startingCustomers = subscriptions.filter((subscription) => activeAt(subscription, start)).length;
    const cancelledCustomers = subscriptions.filter((subscription) => {
      const ended = endDate(subscription);
      return ended && ended >= start && ended < end && ["cancelled", "expired", "past_due"].includes(subscription.status.toLowerCase());
    }).length;

    result.push({
      month: monthLabel(start),
      startingCustomers,
      cancelledCustomers,
      churnRate: startingCustomers ? cancelledCustomers / startingCustomers : 0,
    });
  }

  return result;
}

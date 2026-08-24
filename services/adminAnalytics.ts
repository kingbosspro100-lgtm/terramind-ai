import { createClient } from "@/lib/server";

export async function getAdminAnalytics() {
  const supabase = await createClient();

  const [
    profilesResult,
    subscriptionsResult,
    paymentsResult,
    acquisitionResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, plan, subscription_status, created_at"),

    supabase
      .from("subscriptions")
      .select(
        "id, user_id, plan, status, monthly_price, started_at, cancelled_at, created_at"
      ),

    supabase
      .from("payments")
      .select(
        "id, user_id, amount, currency, plan, status, payment_method, transaction_id, created_at"
      )
      .eq("status", "paid"),

    supabase
      .from("acquisition_expenses")
      .select(
        "id, amount, description, period_start, period_end, created_at"
      ),
  ]);

  if (profilesResult.error) {
    throw new Error(
      `Erreur profiles: ${profilesResult.error.message}`
    );
  }

  if (subscriptionsResult.error) {
    throw new Error(
      `Erreur subscriptions: ${subscriptionsResult.error.message}`
    );
  }

  if (paymentsResult.error) {
    throw new Error(
      `Erreur payments: ${paymentsResult.error.message}`
    );
  }

  if (acquisitionResult.error) {
    throw new Error(
      `Erreur acquisition_expenses: ${acquisitionResult.error.message}`
    );
  }

  const profiles = profilesResult.data ?? [];
  const subscriptions = subscriptionsResult.data ?? [];
  const payments = paymentsResult.data ?? [];
  const acquisitionExpenses =
    acquisitionResult.data ?? [];

  /*
   * UTILISATEURS
   */

  const totalUsers = profiles.length;

  const freeUsers = profiles.filter(
    (profile) =>
      profile.plan?.toLowerCase() === "free"
  ).length;

  const proUsers = profiles.filter(
    (profile) =>
      profile.plan?.toLowerCase() === "pro"
  ).length;

  const enterpriseUsers = profiles.filter(
    (profile) =>
      profile.plan?.toLowerCase() ===
      "enterprise"
  ).length;

  /*
   * ABONNEMENTS ACTIFS
   */

  const activeSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.status?.toLowerCase() ===
        "active"
    );

  /*
   * MRR
   */

  const mrr = activeSubscriptions.reduce(
    (total, subscription) =>
      total +
      Number(subscription.monthly_price ?? 0),
    0
  );

  /*
   * REVENUS TOTAUX
   */

  const totalRevenue = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount ?? 0),
    0
  );

  /*
   * CLIENTS PAYANTS
   */

  const payingUsers = new Set(
    activeSubscriptions.map(
      (subscription) => subscription.user_id
    )
  );

  const payingCustomers = payingUsers.size;

  /*
   * ARPU
   */

  const arpu =
    payingCustomers > 0
      ? mrr / payingCustomers
      : 0;

  /*
   * ACQUISITION
   */

  const totalAcquisitionExpenses =
    acquisitionExpenses.reduce(
      (total, expense) =>
        total + Number(expense.amount ?? 0),
      0
    );

  const cac =
    payingCustomers > 0
      ? totalAcquisitionExpenses /
        payingCustomers
      : 0;

  /*
   * CHURN
   */

  const cancelledSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.status?.toLowerCase() ===
          "cancelled" ||
        subscription.cancelled_at !== null
    );

  const churnRate =
    subscriptions.length > 0
      ? cancelledSubscriptions.length /
        subscriptions.length
      : 0;

  /*
   * LTV
   *
   * LTV = ARPU / churn
   */

  const monthlyChurn =
    churnRate > 0 ? churnRate : 0.01;

  const ltv = arpu / monthlyChurn;

  /*
   * LTV / CAC
   */

  const ltvCacRatio =
    cac > 0 ? ltv / cac : 0;

  return {
    users: {
      total: totalUsers,
      free: freeUsers,
      pro: proUsers,
      enterprise: enterpriseUsers,
      paying: payingCustomers,
    },

    revenue: {
      total: totalRevenue,
      mrr,
      arpu,
    },

    acquisition: {
      totalExpenses:
        totalAcquisitionExpenses,
      cac,
    },

    churn: {
      rate: churnRate,
      cancelled:
        cancelledSubscriptions.length,
    },

    ltv: {
      value: ltv,
      ratio: ltvCacRatio,
      healthy:
        ltvCacRatio >= 3,
    },

    subscriptions: {
      active: activeSubscriptions.length,
      total: subscriptions.length,
    },
  };
} 
export async function getMonthlyMRR(months = 6) {
  const supabase = await createClient();

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select(
      "id, user_id, plan, status, monthly_price, started_at, cancelled_at"
    );

  if (error) {
    throw new Error(
      `Erreur récupération MRR : ${error.message}`
    );
  }

  const rows = subscriptions ?? [];

  const now = new Date();

  const result: {
    month: string;
    mrr: number;
  }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth();

    const nextMonth = new Date(
      year,
      month + 1,
      1
    );

    const mrr = rows
      .filter((subscription) => {
        const startedAt = new Date(
          subscription.started_at
        );

        const cancelledAt =
          subscription.cancelled_at
            ? new Date(subscription.cancelled_at)
            : null;

        const activeAtStart =
          startedAt < nextMonth;

        const notCancelledBeforeMonth =
          !cancelledAt ||
          cancelledAt >= nextMonth;

        return (
          activeAtStart &&
          notCancelledBeforeMonth &&
          Number(subscription.monthly_price ?? 0) >
            0
        );
      })
      .reduce(
        (total, subscription) =>
          total +
          Number(
            subscription.monthly_price ?? 0
          ),
        0
      );

    result.push({
      month: date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      }),
      mrr,
    });
  }

  return result;
}
export async function getMonthlyGrowth(months = 6) {
  const supabase = await createClient();

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select(
      "id, user_id, monthly_price, started_at, cancelled_at"
    );

  if (error) {
    throw new Error(
      `Erreur récupération croissance : ${error.message}`
    );
  }

  const rows = subscriptions ?? [];
  const now = new Date();

  const result: {
    month: string;
    newCustomers: number;
    churnedCustomers: number;
    mrr: number;
  }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const end = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      1
    );

    const newCustomers = rows.filter((subscription) => {
      const startedAt = new Date(
        subscription.started_at
      );

      return (
        startedAt >= start &&
        startedAt < end
      );
    }).length;

    const churnedCustomers = rows.filter((subscription) => {
      if (!subscription.cancelled_at) {
        return false;
      }

      const cancelledAt = new Date(
        subscription.cancelled_at
      );

      return (
        cancelledAt >= start &&
        cancelledAt < end
      );
    }).length;

    const mrr = rows
      .filter((subscription) => {
        const startedAt = new Date(
          subscription.started_at
        );

        const cancelledAt =
          subscription.cancelled_at
            ? new Date(subscription.cancelled_at)
            : null;

        return (
          startedAt < end &&
          (!cancelledAt ||
            cancelledAt >= end) &&
          Number(subscription.monthly_price ?? 0) > 0
        );
      })
      .reduce(
        (total, subscription) =>
          total +
          Number(subscription.monthly_price ?? 0),
        0
      );

    result.push({
      month: start.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      }),
      newCustomers,
      churnedCustomers,
      mrr,
    });
  }

  return result;
}export async function getMonthlyChurn(months = 6) {
  const supabase = await createClient();

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select(
      "id, user_id, started_at, cancelled_at"
    );

  if (error) {
    throw new Error(
      `Erreur récupération churn : ${error.message}`
    );
  }

  const rows = subscriptions ?? [];
  const now = new Date();

  const result: {
    month: string;
    startingCustomers: number;
    cancelledCustomers: number;
    churnRate: number;
  }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const end = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      1
    );

    /*
     * Clients ayant un abonnement actif
     * au début du mois.
     */
    const startingCustomers = rows.filter(
      (subscription) => {
        const startedAt = new Date(
          subscription.started_at
        );

        const cancelledAt =
          subscription.cancelled_at
            ? new Date(subscription.cancelled_at)
            : null;

        const startedBeforeMonth =
          startedAt < start;

        const notCancelledBeforeMonth =
          !cancelledAt ||
          cancelledAt >= start;

        return (
          startedBeforeMonth &&
          notCancelledBeforeMonth
        );
      }
    ).length;

    /*
     * Clients qui ont résilié pendant le mois.
     */
    const cancelledCustomers = rows.filter(
      (subscription) => {
        if (!subscription.cancelled_at) {
          return false;
        }

        const cancelledAt = new Date(
          subscription.cancelled_at
        );

        return (
          cancelledAt >= start &&
          cancelledAt < end
        );
      }
    ).length;

    /*
     * Churn mensuel :
     *
     * clients perdus pendant le mois
     * --------------------------------
     * clients actifs au début du mois
     */
    const churnRate =
      startingCustomers > 0
        ? cancelledCustomers /
          startingCustomers
        : 0;

    result.push({
      month: start.toLocaleDateString(
        "fr-FR",
        {
          month: "short",
          year: "numeric",
        }
      ),

      startingCustomers,
      cancelledCustomers,
      churnRate,
    });
  }

  return result;
}
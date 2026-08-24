import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/auth-helper";

export async function getDashboardStats() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      totalFarms: 0,
      totalCrops: 0,
      totalArea: 0,
      totalCities: 0,
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: 0,
      farmsData: [],
      transactionsData: [],
      recentActivities: [],
    };
  }

  const supabase = await createClient();

  // ==========================
  // EXPLOITATIONS
  // ==========================

  let farms: any[] = [];

  try {
    const { data, error } = await supabase
      .from("farms")
      .select(`
        id,
        name,
        city,
        area,
        created_at,
        crops (
          id,
          name,
          created_at
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Dashboard farms fetch error:", error);
    } else if (data) {
      farms = data;
    }
  } catch (error) {
    console.error("Dashboard farms fetch error:", error);
  }

  // ==========================
  // TRANSACTIONS
  // ==========================

  let transactions: any[] = [];

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        type,
        category,
        description,
        amount,
        transaction_date,
        created_at
      `)
      .eq("user_id", user.id)
      .order("transaction_date", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Dashboard transactions fetch error:",
        error
      );
    } else if (data) {
      transactions = data;
    }
  } catch (error) {
    console.error(
      "Dashboard transactions fetch error:",
      error
    );
  }

  // ==========================
  // CALCULS EXPLOITATIONS
  // ==========================

  const totalFarms = farms.length;

  const totalArea = farms.reduce(
    (sum, farm) => sum + Number(farm.area || 0),
    0
  );

  const totalCities = new Set(
    farms
      .map((farm) => farm.city)
      .filter(Boolean)
  ).size;

  const totalCrops = farms.reduce(
    (sum, farm) => sum + (farm.crops?.length ?? 0),
    0
  );

  // ==========================
  // CALCULS FINANCIERS
  // ==========================

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  const totalBalance =
    totalIncome - totalExpense;

  // ==========================
  // CULTURES
  // ==========================

  const crops = farms.flatMap((farm) =>
    (farm.crops || []).map((crop: any) => ({
      ...crop,
      farm_name: farm.name,
      farm_city: farm.city,
    }))
  );

  // ==========================
  // ACTIVITÉS RÉCENTES RÉELLES
  // ==========================

  const recentActivities = [
    // Exploitations
    ...farms.map((farm) => ({
      id: `farm-${farm.id}`,
      type: "farm" as const,
      title: "Nouvelle exploitation ajoutée",
      description: `${farm.name}${farm.city ? ` • ${farm.city}` : ""
        }`,
      date: farm.created_at,
    })),

    // Cultures
    ...crops.map((crop) => ({
      id: `crop-${crop.id}`,
      type: "crop" as const,
      title: "Nouvelle culture créée",
      description: `${crop.name}${crop.farm_name
          ? ` • ${crop.farm_name}`
          : ""
        }`,
      date: crop.created_at,
    })),

    // Transactions
    ...transactions.map((transaction) => ({
      id: `transaction-${transaction.id}`,

      type:
        transaction.type === "income"
          ? ("income" as const)
          : ("expense" as const),

      title:
        transaction.type === "income"
          ? "Revenu enregistré"
          : "Dépense enregistrée",

      description:
        transaction.description ||
        transaction.category ||
        "Transaction",

      date:
        transaction.created_at ||
        transaction.transaction_date,

      amount: Number(
        transaction.amount || 0
      ),
    })),
  ]
    .filter((activity) => activity.date)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5);

  // ==========================
  // DONNÉES DU GRAPHIQUE
  // ==========================

  const transactionsData = transactions.map(
    (transaction) => ({
      id: transaction.id,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: Number(
        transaction.amount || 0
      ),
      transaction_date:
        transaction.transaction_date,
      created_at: transaction.created_at,
    })
  );

  // ==========================
  // RETOUR
  // ==========================

  return {
    totalFarms,
    totalCrops,
    totalArea,
    totalCities,

    totalIncome,
    totalExpense,
    totalBalance,

    farmsData: farms,
    transactionsData,

    recentActivities,
  };
}
import { createClient } from "@/lib/server";

export type MonthlyFinanceItem = {
  month: string;
  yearMonth: string;
  income: number;
  expense: number;
  balance: number;
};

export async function getTransactions() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      farms (
        id,
        name
      )
    `)
    .eq("user_id", user.id)
    .order("transaction_date", {
      ascending: false,
    });

  if (error) throw error;

  return data ?? [];
}

export async function getMonthlyFinanceEvolution(): Promise<MonthlyFinanceItem[]> {
  const transactions = await getTransactions();
  if (!transactions || transactions.length === 0) return [];

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const groupedMap = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const rawDate = t.transaction_date || t.created_at;
    if (!rawDate) continue;

    const dateObj = new Date(rawDate);
    if (isNaN(dateObj.getTime())) continue;

    const year = dateObj.getFullYear();
    const monthIdx = dateObj.getMonth();
    const yearMonth = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;

    if (!groupedMap.has(yearMonth)) {
      groupedMap.set(yearMonth, { income: 0, expense: 0 });
    }

    const current = groupedMap.get(yearMonth)!;
    const amount = Number(t.amount) || 0;
    if (t.type === "income") {
      current.income += amount;
    } else if (t.type === "expense") {
      current.expense += amount;
    }
  }

  const sortedKeys = Array.from(groupedMap.keys()).sort();

  return sortedKeys.map((ym) => {
    const [yearStr, monthStr] = ym.split("-");
    const monthIdx = parseInt(monthStr, 10) - 1;
    const monthLabel = `${monthNames[monthIdx]} ${yearStr}`;
    const data = groupedMap.get(ym)!;

    return {
      month: monthLabel,
      yearMonth: ym,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    };
  });
}
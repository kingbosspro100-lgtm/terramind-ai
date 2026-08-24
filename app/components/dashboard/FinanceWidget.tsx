import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

type Props = {
  income: number;
  expense: number;
};

export default function FinanceWidget({
  income,
  expense,
}: Props) {
  const balance = income - expense;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            💰 Finances
          </h2>

          <p className="text-gray-500">
            Situation financière
          </p>

        </div>

        <div className="rounded-2xl bg-emerald-100 p-4">

          <Wallet className="h-8 w-8 text-emerald-700" />

        </div>

      </div>

      <div className="space-y-5">

        <div className="flex items-center justify-between rounded-2xl bg-green-50 p-5">

          <div className="flex items-center gap-3">

            <TrendingUp className="text-green-600" />

            <span className="font-semibold">
              Revenus
            </span>

          </div>

          <span className="text-2xl font-bold text-green-700">
            {income.toLocaleString()} FCFA
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-red-50 p-5">

          <div className="flex items-center gap-3">

            <TrendingDown className="text-red-600" />

            <span className="font-semibold">
              Dépenses
            </span>

          </div>

          <span className="text-2xl font-bold text-red-700">
            {expense.toLocaleString()} FCFA
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-5">

          <div className="flex items-center gap-3">

            <PiggyBank className="text-blue-600" />

            <span className="font-semibold">
              Solde
            </span>

          </div>

          <span
            className={`text-2xl font-bold ${
              balance >= 0
                ? "text-blue-700"
                : "text-red-700"
            }`}
          >
            {balance.toLocaleString()} FCFA
          </span>

        </div>

      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/services/finance";
import { Plus, ReceiptText, Tag, AlignLeft, CalendarDays, Coins, AlertCircle, X as XIcon } from "lucide-react";
import TerraDialog from "@/app/components/ui/TerraDialog";

type Props = {
  farmId: string;
};

export default function TransactionForm({ farmId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogCustom, setDialogCustom] = useState({ isOpen: false, title: "", message: "", ctaText: "OK", icon: null as React.ReactNode });
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!category || !amount || !transactionDate) {
      setDialogCustom({ isOpen: true, title: "Champs manquants", message: "Veuillez remplir les champs obligatoires.", ctaText: "OK", icon: <AlertCircle size={28} /> });
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        farm_id: farmId,
        type,
        category,
        description,
        amount: Number(amount),
        transaction_date: transactionDate,
      });

      setCategory("");
      setDescription("");
      setAmount("");
      setTransactionDate("");

      setIsDialogOpen(true);

    } catch (error) {
      console.error(error);
      setDialogCustom({ isOpen: true, title: "Erreur", message: "Impossible d'ajouter la transaction.", ctaText: "OK", icon: <XIcon size={28} /> });
    } finally {
      setLoading(false);
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.refresh();
  };

  const handleCustomDialogClose = () => {
    setDialogCustom(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="rounded-3xl bg-[#0A100C] border border-emerald-900/30 shadow-sm mt-8 relative">
      
      <TerraDialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        title="Transaction ajoutée !"
        message="Le flux financier a bien été enregistré. L'IA mettra à jour vos prévisions de rentabilité d'ici quelques minutes."
        ctaText="Fermer"
        icon={<ReceiptText size={32} />}
      />

      <TerraDialog
        isOpen={dialogCustom.isOpen}
        onClose={handleCustomDialogClose}
        title={dialogCustom.title}
        message={dialogCustom.message}
        ctaText={dialogCustom.ctaText}
        icon={dialogCustom.icon}
      />

      <form onSubmit={handleSubmit} className="p-6 md:p-8 relative z-10">
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Type */}
          <div>
             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Type de flux
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  type === "expense"
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : "bg-[#0A100C] border-emerald-900/30 text-emerald-200/50 hover:bg-[#1C183B]"
                }`}
              >
                Dépense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  type === "income"
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                    : "bg-[#0A100C] border-emerald-900/30 text-emerald-200/50 hover:bg-[#1C183B]"
                }`}
              >
                Revenu
              </button>
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Montant (FCFA)
            </label>
            <div className="relative">
              <Coins className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="number"
                placeholder="Ex: 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Catégorie
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="text"
                placeholder="Ex: Semences, Carburant, Vente..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Date */}
          <div>
             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
              Date
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/50" />
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
           <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
            Description (Optionnelle)
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 h-4 w-4 text-emerald-400/50" />
            <textarea
              placeholder="Détails supplémentaires..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl bg-[#0B0914] border border-emerald-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-300/30 outline-none transition focus:border-emerald-500/50 min-h-[80px]"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-bold text-white transition hover:opacity-95 shadow-xl shadow-emerald-600/30 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? "Enregistrement..." : "Enregistrer la transaction"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
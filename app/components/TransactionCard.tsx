"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Building2,
  Wallet,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { updateTransaction, deleteTransaction } from "@/services/finance";

type Props = {
  transaction: any;
};

export default function TransactionCard({ transaction }: Props) {
  const router = useRouter();
  const isIncome = transaction.type === "income";

  // Modale de modification
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editType, setEditType] = useState<"income" | "expense">(transaction.type || "income");
  const [editCategory, setEditCategory] = useState(transaction.category || "");
  const [editDescription, setEditDescription] = useState(transaction.description || "");
  const [editAmount, setEditAmount] = useState(transaction.amount?.toString() || "");
  const [editDate, setEditDate] = useState(transaction.transaction_date || "");
  const [updating, setUpdating] = useState(false);

  // Modale de confirmation de suppression
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory || !editAmount || !editDate) return;

    setUpdating(true);
    try {
      await updateTransaction(transaction.id, {
        type: editType,
        category: editCategory,
        description: editDescription,
        amount: Number(editAmount),
        transaction_date: editDate,
      });
      setIsEditOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Erreur modification transaction:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(transaction.id);
      setIsDeleteConfirmOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Erreur suppression transaction:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group rounded-3xl border border-emerald-900/30 bg-[#0B0914]/80 p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/40 text-white relative">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isIncome
                ? "bg-emerald-950 border border-emerald-500/40 text-emerald-400"
                : "bg-red-950 border border-red-500/40 text-red-400"
            }`}
          >
            {isIncome ? <ArrowUpCircle size={26} /> : <ArrowDownCircle size={26} />}
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">{transaction.category}</h3>
            <p className="text-xs text-emerald-200/70 font-medium">{transaction.description || "Aucune description"}</p>
          </div>
        </div>

        <div
          className={`rounded-2xl px-4 py-2 text-xl font-black ${
            isIncome ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "bg-red-950/80 text-red-400 border border-red-800/40"
          }`}
        >
          {isIncome ? "+" : "-"}
          {Number(transaction.amount).toLocaleString()} FCFA
        </div>
      </div>

      {/* Informations */}
      <div className="mt-5 grid gap-3 md:grid-cols-2 text-xs">
        <div className="rounded-2xl bg-[#0A100C] border border-emerald-900/30 p-3">
          <div className="mb-1 flex items-center gap-2 text-emerald-300/60 font-semibold uppercase text-[10px]">
            <CalendarDays size={14} />
            <span>Date</span>
          </div>
          <p className="font-bold text-white">{transaction.transaction_date}</p>
        </div>

        <div className="rounded-2xl bg-[#0A100C] border border-emerald-900/30 p-3">
          <div className="mb-1 flex items-center gap-2 text-emerald-300/60 font-semibold uppercase text-[10px]">
            <Building2 size={14} />
            <span>Exploitation</span>
          </div>
          <p className="font-bold text-white">{transaction.farms?.name ?? "Aucune"}</p>
        </div>
      </div>

      {/* Pied de carte avec Boutons Modifier & Supprimer */}
      <div className="mt-5 flex items-center justify-between border-t border-emerald-900/30 pt-4">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            isIncome ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40" : "bg-red-950 text-red-300 border border-red-800/40"
          }`}
        >
          {isIncome ? "💰 Revenu" : "💸 Dépense"}
        </span>

        <div className="flex items-center gap-2">
          {/* Bouton Modifier */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-[#0A100C] px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/40 hover:text-white transition"
          >
            <Pencil size={13} />
            <span>Modifier</span>
          </button>

          {/* Bouton Supprimer */}
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-[#0A100C] px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-950/60 hover:text-white transition"
          >
            <Trash2 size={13} />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      {/* Modale de Modification */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#181436] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Pencil className="h-4 w-4 text-emerald-400" /> Modifier la transaction
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">Type de transaction</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditType("income")}
                    className={`flex-1 py-2 font-bold rounded-xl border transition ${
                      editType === "income" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#0A100C] border-emerald-900/40 text-slate-400"
                    }`}
                  >
                    💰 Revenu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType("expense")}
                    className={`flex-1 py-2 font-bold rounded-xl border transition ${
                      editType === "expense" ? "bg-red-600 border-red-500 text-white" : "bg-[#0A100C] border-emerald-900/40 text-slate-400"
                    }`}
                  >
                    💸 Dépense
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">Catégorie *</label>
                <input
                  type="text"
                  required
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-xl bg-[#0A100C] border border-emerald-900/40 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl bg-[#0A100C] border border-emerald-900/40 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">Montant (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full rounded-xl bg-[#0A100C] border border-emerald-900/40 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl bg-[#0A100C] border border-emerald-900/40 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-900/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl border border-emerald-900/40 bg-[#0A100C] px-4 py-2 font-bold text-slate-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-500 transition disabled:opacity-50"
                >
                  {updating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{updating ? "Sauvegarde..." : "Enregistrer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de Confirmation de Suppression */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-red-500/40 bg-[#181436] p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950 text-red-400 border border-red-500/40">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">Confirmer la suppression</h3>
              <p className="text-xs text-slate-300 mt-1">
                Êtes-vous sûr de vouloir supprimer définitivement cette transaction de <strong className="text-white">{Number(transaction.amount).toLocaleString()} FCFA</strong> ?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="rounded-xl border border-emerald-900/40 bg-[#0A100C] px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 transition disabled:opacity-50 shadow-md"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{deleting ? "Suppression..." : "Oui, supprimer"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
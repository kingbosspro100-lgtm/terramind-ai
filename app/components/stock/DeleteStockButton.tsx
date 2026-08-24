"use client";

import { useRouter } from "next/navigation";
import { deleteStock } from "@/services/stock";

type Props = {
  id: string;
};

export default function DeleteStockButton({ id }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!ok) return;

    try {
      await deleteStock(id);

      alert("✅ Produit supprimé avec succès.");

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("❌ Impossible de supprimer ce produit.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
    >
      Supprimer
    </button>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStock } from "@/services/stock";
import TerraDialog from "@/app/components/ui/TerraDialog";

export default function StockForm() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Semence");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("Kg");
  const [minimum, setMinimum] = useState(0);
  const [price, setPrice] = useState(0);
  const [supplier, setSupplier] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createStock({
        name,
        category,
        quantity,
        unit,
        minimum,
        price,
        supplier,
      });

      setName("");
      setCategory("Semence");
      setQuantity(0);
      setUnit("Kg");
      setMinimum(0);
      setPrice(0);
      setSupplier("");

      setOpen(false);

      router.refresh();
      setDialogMessage("✅ Produit ajouté avec succès !");
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
      setDialogMessage("❌ Impossible d'ajouter le produit.");
      setDialogOpen(true);
    }
  }

  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore
      const detail = e.detail as string | undefined;
      if (!detail) return;
      try {
        const parsed = JSON.parse(detail);
        if (parsed.name) setName(parsed.name);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.quantity) setQuantity(Number(parsed.quantity));
        setDialogMessage("Formulaire pré-rempli depuis le QR détecté.");
        setDialogOpen(true);
        setOpen(true);
      } catch (err) {
        // plain text
        setName(detail);
        setDialogMessage("Nom rempli depuis le QR détecté.");
        setDialogOpen(true);
        setOpen(true);
      }
    };

    window.addEventListener('qr-scanned', handler as EventListener);
    return () => window.removeEventListener('qr-scanned', handler as EventListener);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
      >
        <Plus size={20} />
        Ajouter un produit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div role="dialog" aria-modal="true" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-900/40 bg-gradient-to-b from-[#181436] to-[#050A07] p-8 text-white shadow-2xl">

            <div className="mb-8 flex items-center justify-between">

              <h2 className="text-3xl font-bold">
                📦 Nouveau produit
              </h2>

              <button onClick={() => setOpen(false)}>
                <X size={28} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <input
                required
                placeholder="Nom du produit"
                className="w-full rounded-xl border border-emerald-900/40 bg-[#0B0914] p-4 text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/60"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="w-full rounded-xl border border-emerald-900/40 bg-[#0B0914] p-4 text-white outline-none focus:border-emerald-500/60"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Semence</option>
                <option>Engrais</option>
                <option>Produit phytosanitaire</option>
                <option>Carburant</option>
                <option>Matériel</option>
                <option>Autre</option>
              </select>

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="number"
                  className="rounded-xl border border-emerald-900/40 bg-[#0B0914] p-4 text-white outline-none focus:border-emerald-500/60"
                  placeholder="Quantité"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Number(e.target.value))
                  }
                />

                <select
                  className="rounded-xl border border-emerald-900/40 bg-[#0B0914] p-4 text-white outline-none focus:border-emerald-500/60"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option>Kg</option>
                  <option>Tonne</option>
                  <option>Litre</option>
                  <option>Sac</option>
                  <option>Unité</option>
                </select>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="number"
                  className="rounded-xl border border-emerald-900/40 bg-[#0B0914] p-4 text-white outline-none focus:border-emerald-500/60"
                  placeholder="Stock minimum"
                  value={minimum}
                  onChange={(e) =>
                    setMinimum(Number(e.target.value))
                  }
                />

                <input
                  type="number"
                  className="rounded-xl border border-emerald-900/40 bg-[#0B0914] p-4 text-white outline-none focus:border-emerald-500/60"
                  placeholder="Prix unitaire"
                  value={price}
                  onChange={(e) =>
                    setPrice(Number(e.target.value))
                  }
                />

              </div>

              <input
                className="w-full rounded-xl border border-emerald-900/40 bg-[#0B0914] p-4 text-white placeholder-emerald-300/30 outline-none focus:border-emerald-500/60"
                placeholder="Fournisseur"
                value={supplier}
                onChange={(e) =>
                  setSupplier(e.target.value)
                }
              />

              <div className="flex justify-end gap-4 pt-6">

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-emerald-900/40 bg-[#0B0914] px-6 py-3 font-semibold text-emerald-200 hover:text-white"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  Enregistrer
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
      <TerraDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="Information" message={dialogMessage} ctaText="OK" />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStock } from "@/services/stock";
import { showToast } from "@/app/components/ui/ToastContainer";

type Props = {
  item: any;
};

export default function EditStockButton({ item }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(Number(item.quantity));
  const [unit, setUnit] = useState(item.unit);
  const [minimum, setMinimum] = useState(Number(item.minimum));
  const [price, setPrice] = useState(Number(item.price));
  const [supplier, setSupplier] = useState(item.supplier ?? "");

  async function handleSave() {
    try {
      await updateStock(item.id, {
        name,
        category,
        quantity,
        unit,
        minimum,
        price,
        supplier,
      });

      setOpen(false);

      router.refresh();

      showToast("Produit modifié avec succès.", "success");
    } catch (error) {
      console.error(error);
      showToast("Impossible de modifier ce produit.", "error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Modifier
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-2xl rounded-3xl bg-white p-8">

            <h2 className="mb-6 text-3xl font-bold">
              Modifier le produit
            </h2>

            <div className="space-y-4">

              <input
                className="w-full rounded-xl border p-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="w-full rounded-xl border p-4"
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
                  className="rounded-xl border p-4"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Number(e.target.value))
                  }
                />

                <select
                  className="rounded-xl border p-4"
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
                  className="rounded-xl border p-4"
                  value={minimum}
                  onChange={(e) =>
                    setMinimum(Number(e.target.value))
                  }
                />

                <input
                  type="number"
                  className="rounded-xl border p-4"
                  value={price}
                  onChange={(e) =>
                    setPrice(Number(e.target.value))
                  }
                />

              </div>

              <input
                className="w-full rounded-xl border p-4"
                value={supplier}
                onChange={(e) =>
                  setSupplier(e.target.value)
                }
              />

            </div>

            <div className="mt-8 flex justify-end gap-4">

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl bg-gray-300 px-6 py-3"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
              >
                Enregistrer
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}
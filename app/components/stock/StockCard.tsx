import EditStockButton from "./EditStockButton";
import DeleteStockButton from "./DeleteStockButton";
import {
  Package,
  TriangleAlert,
  CircleCheck,
  Warehouse,
  QrCode,
  Image as ImageIcon,
} from "lucide-react";

type Props = {
  item: any;
};

export default function StockCard({ item }: Props) {
  const isLowStock = Number(item.quantity) <= Number(item.minimum);

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#181436] to-[#050A07] border border-emerald-900/30 p-6 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">

      {/* En-tête */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B0914]/50 border border-emerald-900/30 text-emerald-400">
            {/* Simulation image/photo du produit */}
            <ImageIcon className="h-6 w-6 opacity-50" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
              {item.name}
            </h2>
            <div className="inline-flex mt-1 items-center gap-1.5 rounded-full border border-emerald-800/40 bg-emerald-950/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
              {item.category}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="h-8 w-8 rounded-xl bg-[#0A100C] border border-emerald-900/40 flex items-center justify-center text-emerald-400 hover:bg-[#1C183B] hover:text-white transition">
            <QrCode size={14} />
          </button>
        </div>
      </div>

      {/* Informations */}
      <div className="space-y-3 bg-[#0B0914]/50 rounded-2xl p-4 border border-emerald-900/20">
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-300/60 font-medium">Quantité</span>
          <span className="font-bold text-white">{item.quantity} {item.unit}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-300/60 font-medium">Stock minimum</span>
          <span className="font-bold text-white">{item.minimum}</span>
        </div>

        <div className="flex justify-between items-center text-sm border-t border-emerald-900/30 pt-3 mt-3">
          <span className="text-emerald-300/60 font-medium">Valeur totale</span>
          <span className="font-bold text-emerald-400">
            {(Number(item.price) * Number(item.quantity)).toLocaleString()} FCFA
          </span>
        </div>

      </div>

      {/* Etat */}
      <div className="mt-5">
        {isLowStock ? (
          <div className="flex items-center gap-3 rounded-2xl bg-red-950/40 border border-red-900/40 p-3 text-red-400 shadow-inner">
            <TriangleAlert size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Alerte : Stock Critique</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-950/40 border border-emerald-900/40 p-3 text-emerald-400 shadow-inner">
            <CircleCheck size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Stock Suffisant</span>
          </div>
        )}
      </div>

      {/* Pied */}
      <div className="mt-5 flex items-center justify-between border-t border-emerald-900/30 pt-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300/60 uppercase tracking-wider">
          <Warehouse size={14} />
          <span>Inventaire Central</span>
        </div>

        <div className="flex gap-2">
          {/* We assume EditStockButton and DeleteStockButton can adapt to the styling or we rewrite them later if they look off. */}
          <EditStockButton item={item} />
          <DeleteStockButton id={item.id} />
        </div>
      </div>

    </div>
  );
}
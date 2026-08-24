import {
  Pencil,
  Trash2,
  PlusCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";

import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

type FarmActionsProps = {
  farm: {
    id: string;
    name: string;
    country: string;
    city: string;
    main_crop: string;
    area: number;
  };
};

export default function FarmActions({
  farm,
}: FarmActionsProps) {
  return (
    <div className="border-t border-emerald-900/30 pt-6 mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* Partie gauche */}
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-400" />
            Gestion de l'exploitation
          </h3>
          <p className="text-[11px] text-emerald-200/60 mt-1 font-medium">
            Modifiez la configuration ou retirez cette exploitation du réseau.
          </p>
        </div>

        {/* Partie droite */}
        <div className="flex flex-wrap items-center gap-3">
          
          <Link
            href={`/crops?view=new&farmId=${farm.id}`}
            className="flex items-center gap-2 rounded-2xl bg-[#0A100C] border border-emerald-800/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-[#1C183B] hover:text-white transition shadow-sm"
          >
            <PlusCircle size={14} />
            <span>Ajouter culture</span>
          </Link>

          <div className="flex items-center gap-2 rounded-2xl bg-blue-950/30 border border-blue-900/40 px-4 py-2.5 text-xs font-bold text-blue-400 hover:bg-blue-900/50 hover:text-white transition shadow-sm">
            <Pencil size={14} />
            <EditButton
              id={farm.id}
              name={farm.name}
              country={farm.country}
              city={farm.city}
              main_crop={farm.main_crop}
              area={farm.area}
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-red-950/30 border border-red-900/40 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-900/50 hover:text-white transition shadow-sm">
            <Trash2 size={14} />
            <DeleteButton id={farm.id} />
          </div>

        </div>

      </div>
    </div>
  );
}
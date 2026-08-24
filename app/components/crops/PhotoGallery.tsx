"use client";

import { ChangeEvent, useState } from "react";
import { ImagePlus, Images } from "lucide-react";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<string[]>([]);
  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPhotos((current) => [...current, ...files.map((file) => URL.createObjectURL(file))]);
  }
  return <section className="rounded-3xl border border-emerald-900/30 bg-gradient-to-b from-[#181436] to-[#050A07] p-6 shadow-2xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Galerie de photos</h2><p className="mt-1 text-sm text-emerald-200/70">Ajoutez des photos de vos cultures pour suivre leur évolution.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white"><ImagePlus className="h-4 w-4"/>Ajouter des photos<input onChange={addPhotos} type="file" accept="image/*" multiple className="hidden" /></label></div>{photos.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo, index) => <img key={photo} src={photo} alt={`Photo de culture ${index + 1}`} className="aspect-[4/3] w-full rounded-2xl border border-emerald-900/30 object-cover" />)}</div> : <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-900/50 text-emerald-200/60"><Images className="h-9 w-9"/><p className="mt-3 text-sm">Aucune photo ajoutée pour le moment.</p></div>}</section>;
}

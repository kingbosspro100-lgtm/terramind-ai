export default function BackgroundEffects() {
  return (
    <>
      {/* Fond principal */}

      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-slate-50 via-emerald-50 to-lime-100" />

      {/* Grande sphère verte */}

      <div className="absolute -left-40 top-10 -z-20 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[140px]" />

      {/* Grande sphère jaune */}

      <div className="absolute right-0 top-0 -z-20 h-[450px] w-[450px] rounded-full bg-lime-300/20 blur-[130px]" />

      {/* Grande sphère bleue */}

      <div className="absolute bottom-0 left-1/2 -z-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-300/20 blur-[150px]" />

      {/* Halo supérieur */}

      <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-white/50 blur-[120px]" />

      {/* Dégradé inférieur */}

      <div className="absolute inset-x-0 bottom-0 -z-20 h-80 bg-gradient-to-t from-white via-white/40 to-transparent" />

      {/* Grille */}

      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `
          linear-gradient(to right,#000 1px,transparent 1px),
          linear-gradient(to bottom,#000 1px,transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Effet radial */}

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at center,transparent 0%,rgba(255,255,255,.25) 70%,white 100%)",
        }}
      />

      {/* Petits halos */}

      <div className="absolute left-20 top-32 h-8 w-8 rounded-full bg-emerald-500/40 blur-xl" />

      <div className="absolute right-32 top-48 h-6 w-6 rounded-full bg-lime-400/50 blur-lg" />

      <div className="absolute bottom-40 left-1/3 h-10 w-10 rounded-full bg-sky-300/40 blur-xl" />

      <div className="absolute bottom-20 right-20 h-7 w-7 rounded-full bg-emerald-400/40 blur-lg" />
    </>
  );
}
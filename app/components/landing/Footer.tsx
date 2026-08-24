import Link from "next/link";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/30 bg-[#07050E] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Logo width={44} height={44} />
              <div>
                <h3 className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Times New Roman', Times, serif" }}>TerraMind AI</h3>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">smart agriculture</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-emerald-200/70 font-medium">
              La plateforme intelligente qui accompagne les agriculteurs béninois et africains au quotidien.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Produit</h4>
            <div className="mt-5 flex flex-col gap-3 text-emerald-200/80 text-sm font-medium">
              <Link href="/fonctionnalites" className="hover:text-emerald-400 transition">Fonctionnalités</Link>
              <Link href="/demo" className="hover:text-emerald-400 transition">Démo</Link>
              <Link href="/tarifs" className="hover:text-emerald-400 transition">Tarifs</Link>
              <Link href="/faq" className="hover:text-emerald-400 transition">FAQ</Link>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Plateforme</h4>
            <div className="mt-5 flex flex-col gap-3 text-emerald-200/70 text-sm font-medium">
              <Link href="/a-propos" className="hover:text-emerald-400 transition">À propos</Link>
              <Link href="/avis" className="hover:text-emerald-400 transition">Avis</Link>
              <Link href="/login" className="hover:text-emerald-400 transition">Connexion</Link>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Légal</h4>
            <div className="mt-5 flex flex-col gap-3 text-emerald-200/70 text-sm font-medium">
              <Link href="/politique-de-confidentialite" className="hover:text-emerald-400 transition">Confidentialité</Link>
              <Link href="/conditions" className="hover:text-emerald-400 transition">Conditions</Link>
              <Link href="/mentions-legales" className="hover:text-emerald-400 transition">Mentions légales</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-emerald-900/30 pt-8 text-center text-xs text-emerald-200/50">
          © {new Date().getFullYear()} TerraMind AI. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

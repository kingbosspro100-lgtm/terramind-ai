import { isAdmin } from "@/services/admin";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <section className="max-w-lg rounded-2xl border border-amber-700/40 bg-slate-900 p-7">
          <h1 className="text-xl font-bold">Accès administrateur non activé</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Cette page existe, mais ce compte n’est pas encore autorisé à l’ouvrir. Un administrateur doit ajouter son adresse dans `ADMIN_EMAILS`, renseigner son identifiant dans `admin_users`, ou attribuer le rôle admin au profil serveur.
          </p>
          <Link href="/dashboard" className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold hover:bg-emerald-600">
            Retour au tableau de bord
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

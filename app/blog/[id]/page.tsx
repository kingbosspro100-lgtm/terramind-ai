import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

// On réutilise exactement les mêmes données que ta page principale
const ALL_POSTS = [
  {
    id: 1,
    title: "Comment l'IA prédictive réduit de 30% l'utilisation d'intrants",
    category: "Agronomie & IA",
    date: "12 Oct 2026",
    readTime: "6 min de lecture",
    image: "https://unsplash.com",
    content: "Voici le contenu complet de l'article 1. L'IA prédictive de TerraMind analyse en continu les capteurs connectés et l'imagerie satellite pour cartographier les besoins nutritionnels précis de chaque plante. En éliminant le surdosage, les producteurs optimisent leurs rendements tout en préservant la santé des sols béninois."
  },
  {
    id: 2,
    title: "Anticiper les vagues de chaleur : Le rôle du radar météorologique",
    category: "Climat & Météo",
    date: "08 Oct 2026",
    readTime: "4 min de lecture",
    image: "https://unsplash.com",
    content: "Voici le contenu complet de l'article 2. Face au dérèglement climatique, nos radars météo exploitent le Deep Learning pour anticiper les chocs thermiques 72 heures à l'avance. Cela permet d'activer l'irrigation automatisée aux heures les plus fraîches pour réduire l'évaporation de l'eau."
  },
  {
    id: 3,
    title: "Gestion des stocks agricoles : Éviter les pénuries de semences",
    category: "Business Agricole",
    date: "05 Oct 2026",
    readTime: "5 min de lecture",
    image: "https://unsplash.com",
    content: "Voici le contenu complet de l'article 3. Une rupture de stock en pleine saison des pluies peut ruiner une année de travail. TerraMind AI suit l'utilisation de vos intrants et anticipe les commandes de réassort auprès des coopératives locales avant que les prix du marché n'augmentent."
  },
  {
    id: 4,
    title: "Tutoriel : Scanner et enregistrer vos équipements en 3 clics",
    category: "Tutoriels",
    date: "01 Oct 2026",
    readTime: "3 min de lecture",
    image: "https://unsplash.com",
    content: "Voici le contenu complet de l'article 4. Grâce à notre nouvelle mise à jour, chaque machine agricole reçoit un QR code unique. En le scannant avec l'application TerraMind, l'historique des maintenances, les pannes fréquentes et les pièces de rechange sont immédiatement synchronisés dans le cloud."
  }
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  // Extraction de l'ID de l'URL de manière asynchrone (Norme Next.js récente)
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id, 10);
  
  // Recherche de l'article dans le tableau
  const post = ALL_POSTS.find((p) => p.id === postId);

  // Si l'article n'existe pas (ex: /blog/99)
  if (!post) {
    return (
      <div className="min-h-screen bg-[#0B0914] text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Article introuvable</h1>
        <Link href="/blog" className="text-emerald-400 hover:underline">Retourner au blog</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#0B0914] text-slate-200 pb-20">
      {/* Barre de retour */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition group mb-8">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
          Retour aux articles
        </Link>
      </div>

      {/* Bannière de l'article */}
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
          {post.category}
        </span>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
          {post.title}
        </h1>

        {/* Métadonnées */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-y border-slate-900 py-4">
          <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-emerald-500" /> Équipe TerraMind</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
        </div>

        {/* Image Principale */}
        <div className="relative h-64 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-900">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Corps du texte */}
        <div className="pt-6 text-lg leading-relaxed text-slate-300 space-y-6 max-w-none">
          <p>{post.content}</p>
        </div>
      </div>
    </article>
  );
}

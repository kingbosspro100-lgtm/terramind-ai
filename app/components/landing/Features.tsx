import { Bot, CloudSun, Map, Package, Tractor, Wallet } from "lucide-react";

const features = [
  { icon: Bot, title: "Assistant IA", description: "Des conseils actionnables adaptés à la saison et à vos priorités." },
  { icon: CloudSun, title: "Météo agricole", description: "Anticipez les conditions qui comptent pour vos parcelles." },
  { icon: Tractor, title: "Exploitations", description: "Centralisez vos parcelles, cultures et récoltes." },
  { icon: Wallet, title: "Finances", description: "Suivez revenus, dépenses et rentabilité en un regard." },
  { icon: Package, title: "Stocks", description: "Gardez le contrôle sur vos intrants et vos récoltes." },
  { icon: Map, title: "Cartographie", description: "Visualisez votre activité directement sur une carte." },
];

export default function Features() {
  return <section id="features" className="bg-white py-24 sm:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-base font-semibold text-sky-700">FONCTIONNALITÉS</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Tout le nécessaire. Rien de superflu.</h2><p className="mt-5 text-slate-600">Une plateforme claire pour les décisions importantes de votre exploitation.</p></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-950/5"><div className="inline-flex rounded-xl bg-sky-50 p-3 text-sky-700 transition group-hover:bg-sky-700 group-hover:text-white"><Icon size={22} /></div><h3 className="mt-6 text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-base leading-6 text-slate-600">{description}</p></article>)}</div></div></section>;
}

import { Quote, Star } from "lucide-react";

const testimonials = [
  { quote: "Je vois enfin mes dépenses, mes récoltes et les alertes météo au même endroit.", name: "Aïssatou D.", role: "Productrice de maïs, Sénégal" },
  { quote: "Les recommandations me permettent de planifier mes actions avec beaucoup plus de sérénité.", name: "Koffi A.", role: "Exploitant agricole, Côte d’Ivoire" },
  { quote: "Notre coopérative suit mieux ses stocks et partage les bonnes décisions plus vite.", name: "Mariam K.", role: "Responsable de coopérative, Mali" },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-950 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-emerald-300">TÉMOIGNAGES</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Construit avec celles et ceux qui cultivent l&apos;avenir.</h2>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="group rounded-3xl border border-white/10 bg-white/[0.05] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-emerald-950/30">
              <div className="inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-300 transition group-hover:bg-emerald-400 group-hover:text-slate-950">
                <Quote className="h-6 w-6" aria-hidden="true" />
              </div>
              <blockquote className="mt-7 text-lg leading-8 text-slate-100">« {testimonial.quote} »</blockquote>
              <div className="mt-8 flex items-center gap-1 text-amber-300" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
              </div>
              <figcaption className="mt-5 border-t border-white/10 pt-5">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="mt-1 text-sm text-slate-400">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

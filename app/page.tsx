import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { PlanCheckoutButton } from "@/components/PlanCheckoutButton"

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Génération en 30 secondes",
    description:
      "Décrivez votre sujet en quelques mots et notre IA rédige un post LinkedIn percutant, prêt à publier. Fini le syndrome de la page blanche.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "5 tons sur mesure",
    description:
      "Professionnel, inspirant, éducatif, storytelling ou décontracté — choisissez le ton qui correspond à votre marque personnelle et à votre audience.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Historique & réutilisation",
    description:
      "Retrouvez tous vos posts générés, copiez-les en un clic, réutilisez vos meilleurs formats. Votre bibliothèque de contenu LinkedIn au même endroit.",
  },
]

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "",
    description: "Pour tester et découvrir",
    features: [
      "3 posts générés / mois",
      "Watermark sur les posts",
      "2 tons disponibles",
      "Accès basique à l'IA",
    ],
    cta: "Commencer gratuitement",
    href: "/register",
    highlight: false,
  },
  {
    name: "Starter",
    price: "15",
    period: "/ mois",
    description: "Pour les freelances actifs",
    features: [
      "30 posts générés / mois",
      "Tous les tons disponibles",
      "Sans watermark",
      "Historique des posts",
      "Support email",
    ],
    cta: "Passer au Starter",
    href: "/register?plan=starter",
    priceId: "price_1TbSADB0HBcqWRZLGfJEAz80",
    highlight: true,
    badge: "Plus populaire",
  },
  {
    name: "Pro",
    price: "29",
    period: "/ mois",
    description: "Pour les créateurs sérieux",
    features: [
      "100 posts générés / mois",
      "Tous les tons disponibles",
      "Sans watermark",
      "Calendrier de contenu",
      "Hooks premium",
      "Historique illimité",
      "Support prioritaire",
    ],
    cta: "Passer au Pro",
    href: "/register?plan=pro",
    priceId: "price_1TbSBOB0HBcqWRZLNw69S3MW",
    highlight: false,
  },
]

const testimonials = [
  {
    name: "Sophie Marchand",
    role: "Consultante RH indépendante",
    avatar: "SM",
    content:
      "Avant LinkedPost AI, je passais 2h à écrire un post qui floppait. Maintenant en 30 secondes j'ai un texte que mes 4 000 abonnés adorent. Mon taux d'engagement a triplé en 6 semaines.",
    stars: 5,
  },
  {
    name: "Karim Bensalem",
    role: "Développeur freelance",
    avatar: "KB",
    content:
      "En tant que dev, écrire du contenu LinkedIn c'était pas mon truc. Avec cet outil j'arrive à publier 3x par semaine sans effort. J'ai décroché 2 missions directement via LinkedIn depuis.",
    stars: 5,
  },
  {
    name: "Clara Fontaine",
    role: "Designer UX / Product",
    avatar: "CF",
    content:
      "Le ton 'storytelling' est incroyable. Mes posts sonnent vraiment comme moi, pas comme un robot. Mes prospects me disent souvent qu'ils me suivent pour mon contenu avant même de me contacter.",
    stars: 5,
  },
]

/* ─── Components ────────────────────────────────────────────────────────────── */

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function MockPostCard() {
  return (
    <div className="animate-float bg-white rounded-2xl shadow-2xl p-5 w-80 border border-slate-100">
      {/* LinkedIn post header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
          JD
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">Jean Dupont</p>
          <p className="text-xs text-slate-500">Consultant IT • Maintenant</p>
        </div>
      </div>

      {/* Post content */}
      <div className="text-sm text-slate-700 leading-relaxed space-y-2">
        <p>
          <span className="font-semibold">Il y a 6 mois, j&apos;avais peur de publier sur LinkedIn.</span>
        </p>
        <p>
          Aujourd&apos;hui, 3 de mes missions viennent directement de ma présence sur ce réseau.
        </p>
        <p>
          Ce que j&apos;ai changé ? Je publie régulièrement avec <span className="text-blue-600 font-medium">LinkedPost AI</span>. En 30 secondes, j&apos;ai un post qui me ressemble.
        </p>
        <p className="text-blue-600">#freelance #linkedin #consulting</p>
      </div>

      {/* Reactions bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span>👍❤️🔥</span>
          <span>247 réactions</span>
        </div>
        <span>38 commentaires</span>
      </div>

      {/* AI badge */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-violet-600 font-medium bg-violet-50 rounded-full px-3 py-1 w-fit">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Généré par l&apos;IA en 28s
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 text-white">
          {/* Blobs décoratifs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-blue-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                IA propulsée par GPT-4o
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                Créez des posts LinkedIn{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  qui engagent
                </span>
                {" "}en 30 secondes.
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
                LinkedPost AI génère des contenus LinkedIn professionnels et viraux pour les freelances — sans effort, sans syndrome de la page blanche.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 text-white font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
                >
                  Commencer gratuitement →
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-colors"
                >
                  Voir comment ça marche
                </Link>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                Gratuit pour toujours · Pas de carte bancaire requise
              </p>
            </div>

            {/* Mock card */}
            <div className="flex-shrink-0 flex justify-center">
              <MockPostCard />
            </div>
          </div>

          {/* Wave bottom */}
          <div className="absolute bottom-0 inset-x-0">
            <svg viewBox="0 0 1440 60" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" />
            </svg>
          </div>
        </section>

        {/* ── Logos / social proof ── */}
        <section className="bg-white py-10 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">
              Rejoignez +2 000 freelances qui publient avec LinkedPost AI
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {["Consultants IT", "Designers", "Coachs", "Rédacteurs", "Développeurs"].map((label) => (
                <span key={label} className="text-slate-400 font-semibold text-sm">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
                Fonctionnalités
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
                Tout ce qu&apos;il vous faut pour briller sur LinkedIn
              </h2>
              <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
                LinkedPost AI s&apos;occupe de l&apos;écriture, vous vous occupez du business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 bg-white"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-violet-600 uppercase tracking-widest">
                Comment ça marche
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
                3 étapes, 1 post parfait
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Décrivez votre sujet", desc: "Entrez un mot-clé, une idée ou copiez un titre d'article. L'IA comprend le contexte." },
                { step: "02", title: "Choisissez votre ton", desc: "Sélectionnez parmi 5 tons : professionnel, inspirant, éducatif, storytelling ou décontracté." },
                { step: "03", title: "Copiez & publiez", desc: "Votre post est prêt en 30 secondes. Copiez-le, peaufinez-le si besoin, et publiez sur LinkedIn." },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <span className="flex-shrink-0 text-4xl font-black text-slate-200 leading-none">{item.step}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
                Tarifs
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
                Simple, transparent, sans surprise
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Commencez gratuitement. Montez en puissance quand vous êtes prêt.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gradient-to-br from-blue-600 to-violet-700 text-white shadow-2xl shadow-blue-500/30 scale-105"
                      : "bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold">
                      {plan.badge}
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.highlight ? "text-blue-200" : "text-slate-500"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-black ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                        {plan.price}€
                      </span>
                      {plan.period && (
                        <span className={`text-sm ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <svg
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-blue-200" : "text-blue-500"}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.highlight ? "text-blue-100" : "text-slate-600"}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.priceId ? (
                    <PlanCheckoutButton
                      priceId={plan.priceId}
                      label={plan.cta}
                      fallbackHref={plan.href}
                      className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
                        plan.highlight
                          ? "bg-white text-blue-600 hover:bg-blue-50"
                          : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
                      }`}
                    />
                  ) : (
                    <Link
                      href={plan.href}
                      className={`block text-center py-3 rounded-full font-semibold text-sm transition-all ${
                        plan.highlight
                          ? "bg-white text-blue-600 hover:bg-blue-50"
                          : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-violet-600 uppercase tracking-widest">
                Témoignages
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
                Ils publient, ils convertissent
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Des freelances comme vous qui ont transformé leur présence LinkedIn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col"
                >
                  <StarRating count={t.stars} />
                  <p className="mt-4 text-slate-600 leading-relaxed flex-1">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              * Témoignages illustratifs. Les résultats peuvent varier.
            </p>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">
              Prêt à booster votre présence LinkedIn ?
            </h2>
            <p className="text-lg sm:text-xl text-blue-200 mb-10">
              Rejoignez 2 000+ freelances qui publient du contenu qui engage, chaque semaine.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 rounded-full bg-white text-blue-700 font-bold text-base hover:bg-blue-50 transition-colors shadow-xl"
            >
              Créer mon compte gratuit →
            </Link>
            <p className="mt-4 text-sm text-blue-300">Sans engagement · Sans carte bancaire</p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}

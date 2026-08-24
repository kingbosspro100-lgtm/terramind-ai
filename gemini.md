# Documentation Globale : TerraMind AI (Handover pour Modèles IA)

Ce fichier `gemini.md` a été généré pour servir de point de repère absolu et de guide pour tout futur modèle d'Intelligence Artificielle (ou développeur) qui reprendrait ce projet.

## 1. Ce que fait l'application (Vision & Objectif)
**TerraMind AI** est une plateforme SaaS Premium conçue spécifiquement pour les agriculteurs et les coopératives (avec un focus sur le marché africain). L'application centralise la gestion complète d'une exploitation agricole, combinant logistique, finances, prévisions météorologiques et intelligence artificielle agronomique.

L'objectif est d'offrir un "instrument digital" ultra-fluide et réactif, digne des meilleurs standards mondiaux (Stripe, Linear, Vercel), permettant aux exploitants de réduire leurs coûts de 30% grâce aux prévisions de l'IA et d'optimiser leurs rendements.

---

## 2. Fonctionnalités Implémentées

### 🔐 Authentification & Securité
- Système complet via **Supabase Auth**.
- Pages implémentées : Login, Register, Forgot Password, Reset Password, Verify Email.
- Redirection automatique basée sur la session.

### 🌾 Module Exploitations & Cultures (`/crops` & `/farms`)
- Gestion des parcelles, cultures, récoltes.
- Suivi par calendrier agricole.
- Historique des actions et galerie photos.
- Recommandations et analyses IA sur le rendement.

### 💰 Module Finances Premium (`/finance`)
- Tableaux de bord de suivi (Revenus vs Dépenses, Bénéfices).
- Graphiques dynamiques (Recharts).
- Gestion des factures récentes.
- Simulations des fonctionnalités d'Export PDF & Excel.
- Prévisions de rentabilité assistées par IA (bannière interactive).

### 📦 Module Stock Avancé (`/stock`)
- Inventaire centralisé (Entrées / Sorties).
- Détection visuelle et UI pour Scanner de QR Codes / Codes-barres.
- Seuils d'alertes automatiques (Stock Faible/Critique).
- Prévisions d'épuisement des stocks par IA.
- Filtres et recherche avancée.

### ⛅ Module Météo Professionnel (`/weather`)
- Dashboard visuel météorologique de haute précision.
- Simulation de Radar et indicateurs clés (Humidité, Vent, Pression, Visibilité).
- Prévisions à 5 jours avec code couleur de danger.
- Alertes agronomiques intelligentes (ex: recommandations de report de semis en cas d'orage imminent).

### 🤖 Assistant IA - TerraMind Copilot (`/ai`)
- Hub central de commande avec interface de Chat interactive.
- Sidebar de suggestions rapides (Analyse météo, Diagnostics de maladies, Prévisions financières).
- Section d'historique de conversations.

### 🌍 Pages Publiques (Landing & Annexes)
- Landing page à haute conversion (Hero, Features, Testimonials, Pricing).
- Pages annexes entièrement harmonisées : À propos, Contact, Blog, Politique de confidentialité, Conditions, Cookies, Mentions légales, Support.

---

## 3. Structure des Fichiers (Next.js App Router)

```text
c:\Users\vizio\agrolink-ai\
├── app/
│   ├── (dashboard)/            # Toutes les pages protégées (Nécessite une session)
│   │   ├── ai/                 # Assistant IA (TerraMind Copilot)
│   │   ├── crops/              # Gestion des cultures
│   │   ├── farms/              # Gestion des exploitations
│   │   ├── finance/            # Module financier
│   │   ├── stock/              # Module inventaire et logistique
│   │   ├── weather/            # Module météo pro
│   │   ├── profile/            # Profil utilisateur
│   │   ├── settings/           # Paramètres
│   │   └── layout.tsx          # Wrapper avec Sidebar/Navigation interne
│   ├── (landing)/              # Landing page principale (page.tsx)
│   ├── a-propos/, blog/, contact/, support/ ... # Pages publiques
│   ├── login/, register/, forgot-password/ ...  # Pages d'authentification
│   ├── components/             # Composants réutilisables
│   │   ├── dashboard/          # Composants spécifiques à l'espace connecté
│   │   ├── landing/            # Composants de la page de présentation
│   │   ├── stock/, ui/         # Composants spécifiques et atomes UI (ex: Logo.tsx)
│   └── globals.css             # Entrées Tailwind et variables CSS (si applicables)
├── lib/
│   └── supabase.ts / client.ts / server.ts # Configuration Supabase (Auth & DB)
└── package.json                # Dépendances (Lucide, Tailwind, Supabase, Recharts)
```

---

## 4. Décisions de Design (UI/UX)

Le design system imposé et scrupuleusement respecté est le **Premium Obsidian Glassmorphism** :
- **Fonds (Backgrounds) :** Utilisation quasi-exclusive de couleurs sombres et profondes, principalement `#0B0914` ou `slate-950`.
- **Cartes & Conteneurs :** Utilisation de dégradés subtils (`bg-gradient-to-b from-[#181436] to-[#120E2B]`) avec des bordures translucides (`border-purple-900/30`).
- **Typographie :** Textes ultra-lisibles. Les titres en blanc (`text-white`), les sous-titres en violet pastel clair (`text-purple-200/70` ou `text-slate-300`).
- **Accents Visuels :** Glows et ombres portées douces (ombres violettes `shadow-purple-600/20`). Accents de couleurs sémantiques : Émeraude (Succès/Croissance), Violet/Indigo (IA/Premium), Rouge (Alertes/Critique).
- **Icônes :** Utilisation intensive de la librairie `lucide-react` pour un rendu minimaliste et professionnel.
- **Micro-Interactions :** Tous les boutons et cartes interactives possèdent des transitions fluides (`hover:scale-105`, `hover:border-purple-500/40`, `transition-all duration-300`).

---

## 5. Instructions pour un futur modèle IA (À LIRE ABSOLUMENT)

Si vous êtes une IA chargée de continuer le développement de ce projet, **respectez impérativement ces directives** :

1. **Cohérence Visuelle Absolue :** Ne proposez jamais de designs génériques, plats ou "clairs" (light mode). Toute nouvelle page ou tout nouveau composant doit s'intégrer au design **Premium Obsidian** décrit dans la section 4. Utilisez les mêmes classes Tailwind pour les cartes et les dégradés.
2. **Utilisation du Logo :** N'utilisez pas d'émojis ou de textes bruts pour le logo. Importez toujours le composant centralisé : `import Logo from "@/app/components/ui/Logo";` (ajustez le chemin selon l'emplacement du fichier).
3. **Responsivité :** Toutes les nouvelles implémentations doivent être construites en approche *Mobile-First*. Vérifiez vos empilements de grilles (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
4. **Pas de placeholders bas de gamme :** Lors de la création d'interfaces, utilisez toujours des données factices (mock data) de haute qualité et réalistes. Les textes "Lorem Ipsum" sont proscrits.
5. **Composants "Server" vs "Client" :** Le projet utilise Next.js App Router. Faites bien la distinction. Si vous ajoutez de l'interactivité (hooks React comme `useState` ou onClick), n'oubliez pas la directive `"use client";` à la première ligne du fichier.
6. **Supabase :** Toute requête ou gestion d'état d'authentification doit utiliser les utilitaires déjà présents dans `@/lib/server` (pour les composants serveur) ou `@/lib/client` (pour les composants clients).

---
*Généré par Antigravity - Le 05 Août 2026.*

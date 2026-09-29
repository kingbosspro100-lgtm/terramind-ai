This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Assistant IA

L’assistant nécessite une clé Gemini configurée côté serveur avec la variable `GEMINI_API_KEY` (ou `AI_API_KEY`). En local, ajouter cette variable dans `.env.local`; en production, l’ajouter aux variables d’environnement du fournisseur d’hébergement puis redéployer. Ne pas utiliser un préfixe `NEXT_PUBLIC_` pour cette clé.

## Suppression différée des comptes

Appliquer `supabase/migrations/20260929_account_deletion_grace_period.sql` au projet Supabase avant d’activer la suppression de compte. Configurer `SUPABASE_SERVICE_ROLE_KEY` et `CRON_SECRET` dans les variables d’environnement serveur du déploiement. Ne jamais exposer la clé de service avec un préfixe `NEXT_PUBLIC_`.

Sur Vercel, `vercel.json` exécute chaque jour `/api/cron/purge-deleted-accounts` à 03:00 UTC. Pour un autre hébergeur, planifier une requête GET vers cette route avec l’en-tête `Authorization: Bearer <CRON_SECRET>`. La demande est annulable en se reconnectant pendant les 7 jours précédant la purge.

# 🧪 Test Manual - TerraMind AI

Avant de déployer en production, testez manuellement chaque flux.

## 1️⃣ **Authentication Tests**

### Test 1.1: Email Login
- [ ] Accéder à http://localhost:3000/login
- [ ] Entrer email/password valides (creéz un compte d'abord)
- [ ] Cliquer "Se connecter"
- [ ] ✅ Vérifier redirection vers /dashboard
- [ ] ✅ Vérifier session créée (cookies du navigateur)

### Test 1.2: Email Registration
- [ ] Accéder à http://localhost:3000/register
- [ ] Entrer: nom, email, password (8+ chars avec majuscule/chiffre)
- [ ] Confirmer password
- [ ] ✅ Vérifier force du mot de passe indiquée
- [ ] Cliquer "Créer mon compte"
- [ ] ✅ Vérifier redirection vers /verify-email

### Test 1.3: Google OAuth
- [ ] Accéder à /login
- [ ] Cliquer "Continuer avec Google"
- [ ] ✅ Vérifier redirection vers Google consent screen
- [ ] Accepter permissions
- [ ] ✅ Vérifier redirection vers /dashboard
- [ ] ✅ Vérifier session valide

### Test 1.4: Facebook OAuth
- [ ] Accéder à /login
- [ ] Cliquer "Continuer avec Facebook"
- [ ] ✅ Vérifier redirection vers Facebook consent screen
- [ ] Accepter permissions
- [ ] ✅ Vérifier redirection vers /dashboard
- [ ] ✅ Vérifier session valide

### Test 1.5: Forgot Password
- [ ] Accéder à /forgot-password
- [ ] Entrer email enregistré
- [ ] Cliquer "Envoyer le lien"
- [ ] ✅ Vérifier message "Email envoyé"
- [ ] ✅ Vérifier email reçu (check spam folder)

## 2️⃣ **Dashboard Access Tests**

### Test 2.1: Authentication Required
- [ ] Logout ou supprimer cookies
- [ ] Accéder à http://localhost:3000/dashboard
- [ ] ✅ Vérifier redirection automatique vers /login?callbackUrl=/dashboard
- [ ] Se connecter
- [ ] ✅ Vérifier redirection vers /dashboard (pas vers /home)

### Test 2.2: Protected Routes
Tester que ces routes requièrent l'authentification:
- [ ] /farms → login si déconnecté
- [ ] /crops → login si déconnecté
- [ ] /stock → login si déconnecté
- [ ] /finance → login si déconnecté
- [ ] /marketplace → login si déconnecté
- [ ] /profile → login si déconnecté
- [ ] /settings → login si déconnecté
- [ ] /weather → login si déconnecté
- [ ] /ai → login si déconnecté
- [ ] /notifications → login si déconnecté

### Test 2.3: Authenticated Users Redirect
- [ ] Se connecter
- [ ] Accéder à /login
- [ ] ✅ Vérifier redirection automatique vers /dashboard
- [ ] Accéder à /register
- [ ] ✅ Vérifier redirection automatique vers /dashboard

## 3️⃣ **Marketplace Tests**

### Test 3.1: Marketplace Load
- [ ] Accéder à /marketplace (connecté)
- [ ] ✅ Vérifier affichage sans erreur
- [ ] ✅ Vérifier produits affichés avec images
- [ ] ✅ Vérifier "Accéder en tant qu'acheteur" visible

### Test 3.2: Buyer Mode
- [ ] Cliquer "Accéder en tant qu'acheteur"
- [ ] ✅ Vérifier affichage HARVESTS (récoltes)
- [ ] ✅ Vérifier pas d'erreur "category undefined"
- [ ] ✅ Vérifier bouton "Retour" ramène aux produits

### Test 3.3: Search & Filters
- [ ] Chercher "Maïs"
- [ ] ✅ Vérifier filtrage fonctionne
- [ ] Filtrer par catégorie
- [ ] ✅ Vérifier filtrage fonctionne
- [ ] Filtrer par prix
- [ ] ✅ Vérifier filtrage fonctionne

## 4️⃣ **Stock QR Scanner Tests**

### Test 4.1: Camera Scanner
- [ ] Accéder à /stock (connecté, sur mobile ou PC avec caméra)
- [ ] Cliquer "Scanner QR/Code-barres"
- [ ] ✅ Vérifier demande d'accès caméra
- [ ] Accepter permission
- [ ] ✅ Vérifier aperçu caméra en direct
- [ ] Visez un QR code
- [ ] ✅ Vérifier détection QR
- [ ] ✅ Vérifier dialog affiche code détecté

### Test 4.2: File Upload Scanner
- [ ] Cliquer "Galerie / Fichier"
- [ ] ✅ Vérifier file picker ouvert
- [ ] Sélectionner image avec QR
- [ ] ✅ Vérifier scan de l'image
- [ ] ✅ Vérifier affichage du code détecté

### Test 4.3: Stock CRUD
- [ ] Cliquer "Ajouter un produit"
- [ ] ✅ Vérifier formulaire ouvert
- [ ] Remplir formulaire (nom, catégorie, quantité, etc)
- [ ] Cliquer "Enregistrer"
- [ ] ✅ Vérifier TerraDialog "Produit ajouté"
- [ ] ✅ Vérifier produit ajouté dans liste
- [ ] Modifier le produit (cliquer edit)
- [ ] ✅ Vérifier modification
- [ ] Supprimer le produit
- [ ] ✅ Vérifier suppression

## 5️⃣ **UI/UX Tests**

### Test 5.1: Dialogues (TerraDialog)
- [ ] Créer un produit stock
- [ ] ✅ Vérifier TerraDialog pour succès (pas alert())
- [ ] Modifier un produit
- [ ] ✅ Vérifier TerraDialog pour confirmation

### Test 5.2: Notifications (Toasts)
- [ ] Supprimer une exploitation
- [ ] ✅ Vérifier Toast en bas-droit (succès)
- [ ] Supprimer avec erreur (sans permission)
- [ ] ✅ Vérifier Toast rouge (erreur)

### Test 5.3: Responsive Design
- [ ] Accéder sur desktop (1920px)
- [ ] ✅ Vérifier layout complet
- [ ] Accéder sur tablet (768px)
- [ ] ✅ Vérifier layout responsive
- [ ] Accéder sur mobile (375px)
- [ ] ✅ Vérifier layout mobile optimisé

## 6️⃣ **Security Tests**

### Test 6.1: Session Expiry
- [ ] Se connecter
- [ ] Attendre ~1 minute (inactivité)
- [ ] ✅ Vérifier session toujours valide (refresh automatique)
- [ ] Attendre 30 jours
- [ ] ✅ Vérifier session expirée → redirection login

### Test 6.2: OAuth Account Linking
- [ ] Créer compte avec email via Google OAuth
- [ ] Essayer se connecter avec même email via Facebook
- [ ] ✅ Vérifier erreur (pas d'account linking)

### Test 6.3: Password Validation
- [ ] Register avec password < 8 chars
- [ ] ✅ Vérifier erreur affichée
- [ ] Reset password avec password < 8 chars
- [ ] ✅ Vérifier erreur affichée

## 7️⃣ **Performance Tests**

### Test 7.1: Load Time
- [ ] Ouvrir DevTools → Network
- [ ] Accéder /dashboard
- [ ] ✅ Vérifier temps chargement < 3s (3G)

### Test 7.2: API Calls
- [ ] Ouvrir DevTools → Network
- [ ] Naviguer /dashboard → /farms → /stock
- [ ] ✅ Vérifier requêtes API complètes
- [ ] ✅ Vérifier pas de requêtes en double

## ✅ **Final Checklist**

- [ ] Tous les tests 1-7 passent
- [ ] Pas d'erreur console (DevTools)
- [ ] Pas de bug TypeScript (npm run build)
- [ ] .env.local configuré avec vraies clés
- [ ] HTTPS activé en production
- [ ] Rate limiting configuré (optionnel)
- [ ] Logs d'authentification visibles
- [ ] Redirection des emails configurée

---

**Note**: Si un test échoue, reportez l'erreur exacte + étapes de reproduction.

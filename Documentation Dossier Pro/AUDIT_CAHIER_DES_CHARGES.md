# 📋 AUDIT DU CAHIER DES CHARGES - Vite & Gourmand

**Date d'audit**: Mars 2026  
**Application**: Vite & Gourmand (Traiteur - Bordeaux)  
**Statut**: ✅ Majorité des critères RESPECTÉS | ⚠️ Quelques manques mineurs | ❌ Tâches critiques manquantes

---

## 📊 RÉSUMÉ EXÉCUTIF

| Catégorie | Couverture | Statut |
|-----------|-----------|--------|
| **Pages et Structure** | 90% | ✅ Bon |
| **Sécurité et Auth** | 85% | ✅ Bon |
| **Base de Données** | 80% | ⚠️ À compléter |
| **Fonctionnalités Métier** | 75% | ⚠️ À améliorer |
| **RGPD/Accessibilité** | 30% | ❌ Critique |

---

## ✅ CRITÈRES RESPECTÉS

### 1. Pages et Navigation
- ✅ `index.html` → Présentation entreprise + avis clients
- ✅ `menus.html` → Liste des menus avec filtres
- ✅ `menu-detail.html` → Détail d'un menu
- ✅ `register.html` → Inscription (validation password)
- ✅ `login.html` → Connexion
- ✅ `commande.html` → Passer commande
- ✅ `espace-utilisateur.html` → Historique commandes + avis
- ✅ `espace-employe.html` → Gestion menus/commandes
- ✅ `espace-admin.html` → Gestion employés
- ✅ `contact.html` → Formulaire contact
- ✅ `cgv.html` → Conditions générales
- ✅ `mentionlegal.html` → Mentions légales

### 2. Base de Données - Structure InnoDB

**Tables créées:**
- ✅ `menus` → titre, description, thème, régime, personnesMin, prix, conditions, stock
- ✅ `images` → galeries multi-images par menu
- ✅ `entrees` → liste entrées avec allergènes
- ✅ `plats` → liste plats avec allergènes
- ✅ `desserts` → liste desserts avec allergènes
- ✅ `users` → email unique, password hashé, rôle ENUM
- ✅ `commandes` → statuts multiples, historique JSON, avis JSON
- ✅ `avis` → note 1-5, commentaire, modération (statut)
- ✅ `horaires` → jour, ouverture, fermeture

### 3. Sécurité

- ✅ **PDO avec requêtes préparées** → Protection SQL injection
- ✅ **Password_hash (BCRYPT)** → Mots de passe sécurisés
- ✅ **Sessions PHP** → Authentification
- ✅ **Validation password**: 10 car min, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial
- ✅ **CGV acceptation** → Checkbox required dans register.html

### 4. Fonctionnalités Utilisateur

- ✅ **Inscription** → email unique, role='utilisateur' par défaut
- ✅ **Connexion** → email + password
- ✅ **Consultation menus** → Affichage dynamique
- ✅ **Filtres menus**: Prix max, fourchette prix, thème, régime, nb personnes
- ✅ **Panier/Commande** → Pré-rempli avec données utilisateur
- ✅ **Calcul prix** → Réduction 10% si +5 personnes vs minimum
- ✅ **Calcul livraison** → 5€ + 0.59€/km si hors Bordeaux
- ✅ **Historique commandes** → Affichage avec détails
- ✅ **Avis** → Notation 1-5, commentaire, modération

### 5. Fonctionnalités Employé

- ✅ **Créer/modifier/supprimer menus**
- ✅ **Créer/modifier/supprimer plats**
- ✅ **Gérer horaires**
- ✅ **Voir commandes** avec filtre statut + client
- ✅ **Modifier statut commandes** (en attente → accepté → en préparation → livré → terminée)
- ✅ **Valider/rejeter avis** (modération)

### 6. Fonctionnalités Admin

- ✅ **Tous les droits employé** (voir espace-admin.html)
- ✅ **Créer employé** (email + password)
- ✅ **Suspendre/supprimer employé**

---

## ⚠️ CRITÈRES PARTIELLEMENT RESPECTÉS

### 1. **Pied de Page (Footer)**
- ✅ Horaires du lundi au dimanche (données en base)
- ❌ **MANQUE**: Affichage des horaires dans le footer
- ✅ Lien Mentions Légales
- ✅ Lien CGV
- ✅ Mention dans CGV: "Frais 600€ si matériel non restitué dans 10 jours"

**Tâche**: Implémenter l'affichage dynamique des horaires dans le footer

---

### 2. **Page Détail Menu (menu-detail.html)**
- ✅ Tous les éléments présents (titre, description, galerie, thème, régime, allergènes, stock, conditions)
- ⚠️ **QUESTION**: Le bouton "COMMANDER" envoie-t-il vers `commande.html` avec menu pré-rempli?
  - Si OUI ✅
  - Si NON ❌ Besoin d'ajout

**Vérification**: Tester le flux menu-detail → commande.html

---

### 3. **Page Commande (commande.html)**
- ✅ Champs client (nom, email, gsm) auto-remplis
- ✅ Adresse livraison + calcul distance
- ✅ Notification si nb personnes < minimum
- ✅ Réduction 10% si +5 personnes vs minimum
- ✅ Calcul livraison (5€ + 0.59€/km hors Bordeaux)
- ❌ **MANQUE**: Affichage du détail du menu commandé
- ❌ **MANQUE**: Champ "Matériel de prêt?" (Oui/Non)

**Tâche**: Afficher le menu + plats sélectionnés + option matériel de prêt

---

### 4. **Redirection après Connexion**
- ⚠️ **QUESTION**: Utilisateur non authentifié → bouton "COMMANDER" sur menu redirige-t-il vers login?

**Vérification**: Tester le flux non-auth → commande.html

---

### 5. **Historique Commande**
- ✅ Statut visible
- ⚠️ **QUESTION**: "Suivi de la date et l'heure de modification" est-il implémenté?
  - Données JSON dans `commandes.historique`
  - Affichage OK? À vérifier

**Vérification**: Tester l'affichage de l'historique

---

### 6. **Gestion Annulation Commande**
- ✅ Bouton "Annuler" si statut = "en attente"
- ❌ **MANQUE**: Bouton disparaît si statut = "accepté" (statut changé par employé)

**Vérification**: Tester le masquage du bouton annulation après acceptation

---

### 7. **Notification par Email**
- ❌ **MANQUE CRITIQUE**: Aucun système de mail implémenté

Manques:
- ❌ Email bienvenue après inscription
- ❌ Email contact (formulaire → entreprise)
- ❌ Email confirmation commande
- ❌ Email "Commande préparée"
- ❌ Email "Commande livrée"
- ❌ Email "Matériel non restitué" (14 jours après, si matériel)
- ❌ Email "Laisser un avis" (après livraison)
- ❌ Email création employé (José/Julie)
- ❌ Email annulation commande (si employé annule)

**Tâche CRITIQUE**: Implémenter système d'email avec PHPMailer ou similaire

---

### 8. **Gestion du Matériel de Prêt**
- ⚠️ Champ `materiel TINYINT(1)` existe dans DB
- ❌ **MANQUE**: Formulaire commande n'a pas de champ "Matériel?"
- ❌ **MANQUE**: Statut "en attente du retour de matériel" pas implémenté
- ❌ **MANQUE**: Email 10 jours avant expiration + frais 600€

**Tâche**: Implémenter logique complète matériel de prêt

---

### 9. **Modification Commande**
- ⚠️ **QUESTION**: Utilisateur peut-il modifier sa commande (nb personnes, date)?
  - Cahier demande: "Tout modifier sauf le choix du menu"
  - Vérification: À tester dans espace-utilisateur.js

**Vérification**: Tester modification commande en attente

---

### 10. **Annulation Commande par Employé**
- ✅ Employé peut changer le statut
- ❌ **MANQUE**: Formulaire "motif d'annulation + mode de contact" avant annulation
- ❌ **MANQUE**: Email au client notifiant l'annulation + motif

**Tâche**: Implémenter formulaire annulation + email

---

## ❌ CRITÈRES NON RESPECTÉS (CRITIQUES)

### 1. **RGPD - Politique de Confidentialité**
- ❌ Fichier `privacy-policy.html` MANQUANT
- ❌ Consentement cookies MANQUANT
- ❌ Droit à l'oubli MANQUANT (GDPR: droit supprimer données)
- ❌ Droit à l'exportation MANQUANT (GDPR: télécharger mes données)

**Tâche CRITIQUE**: Créer page privacy-policy.html + implémenter droit à l'oubli

---

### 2. **Accessibilité RGAA (Réglementaire)**
- ❌ Pas de `alt=""` sur les images
- ❌ Pas de `aria-labels` sur les boutons
- ❌ Pas de contraste suffisant (à vérifier visuellement)
- ❌ Pas de navigation au clavier (Tab)
- ❌ Pas de structure sémantique (utiliser `<nav>`, `<main>`, `<article>`)

**Tâche CRITIQUE**: Audit accessibilité complet + corrections

---

### 3. **Réinitialisation Mot de Passe**
- ❌ **Cahier demande**: "SI mot de passe oublié → bouton réinitialiser"
- ❌ **MANQUE TOTAL**: 
  - Lien "J'ai oublié mon mot de passe" sur login.html
  - Page forgot-password.html
  - Email avec lien de réinitialisation
  - Token de sécurité

**Tâche**: Implémenter complet système mot de passe oublié

---

### 4. **Horaires dans Footer**
- ✅ Données en base de données
- ❌ Non affichées dans le footer
- ❌ Format: Doit afficher tous les jours (lundi → dimanche)

**Tâche**: Modifier script.js (loadFooter) pour afficher horaires

---

### 5. **Statut "Accepté" pour Commandes**
- ⚠️ Database.sql voir les statuts disponibles
- ❌ **Cahier demande**: "accepté" (quand employé valide)
- ❌ **Actuels** (à vérifier dans espace-employe.js): en attente, accepté, en préparation, livré, terminée
  - Manque potentiellement: "en cours de livraison", "en attente du retour de matériel"

**Vérification**: Vérifier les statuts dans la DB et l'interface

---

### 6. **Déploiement et HTTPS**
- ⚠️ Application en local (localhost:8080)
- ❌ **Cahier demande**: "Déploiement de l'application" + "Accessible au public"
- ❌ **MANQUE**: Serveur de production (AWS, Heroku, etc.)
- ❌ **MANQUE**: Certificat HTTPS/SSL
- ❌ **MANQUE**: Domaine personnalisé

**Tâche CRITIQUE**: Déployer l'application en production

---

### 7. **Thème et Régime dans Filtres Menus**
- ✅ Boutons existent (menus.html)
- ⚠️ **Fonctionnement**: À vérifier si les filtres fonctionnent réellement
  - Récupèrent-ils les valeurs uniques de la DB?
  - Mettent-ils à jour l'affichage sans rechargement?

**Vérification**: Tester les filtres dynamiques

---

### 8. **Section "Employé" vs "Admin"**
- ⚠️ **Cahier demande**: "Admin et Employé sont différents"
- ⚠️ **Actuels** (à vérifier):
  - Admin: Gestion employés UNIQUEMENT + droits employé
  - Employé: Gestion menus, plats, horaires, commandes, avis
- ⚠️ **Note**: "JOSÉ PRÉCISE": Impossible de créer admin depuis l'app

**Vérification**: S'assurer qu'espace-admin ne montre QUE "Gestion employés" + sections employé

---

### 9. **Sécurité: Création Admin**
- ⚠️ **Cahier demande**: "IMPOSSIBLE de créer ADMIN depuis l'application"
- ❌ **Vérification**: Register.php a-t-il une vérification?
  - Le role doit être forcé à 'utilisateur'
  - Pas de paramètre GET/POST permettant de forcer 'admin'

**Vérification**: Tester si un attaquant peut forcer role='admin' en POST

---

### 10. **Galerie d'Images Menu**
- ✅ Table `images` en base de données
- ⚠️ **Affichage**: Galerie sur menu-detail.html fonctionne-t-elle?
  - Affiche-t-elle toutes les images du menu?
  - Navigation gauche/droite OK?

**Vérification**: Tester galerie sur menu-detail.html

---

## 📋 CHECKLIST DES TÂCHES À ACCOMPLIR

### 🔴 TÂCHES CRITIQUES (Bloquantes pour la présentation)

```
[ ] ❌ 1. RGPD - Créer page "Politique de Confidentialité" (privacy-policy.html)
    - Expliquer la collecte de données
    - Mentionner les droits GDPR
    - Lien depuis register.html

[ ] ❌ 2. RGPD - Implémenter "Droit à l'oubli"
    - Bouton "Supprimer mon compte" dans espace-utilisateur.html
    - Endpoint: DELETE /PHP/deleteAccount.php
    - Supprime l'utilisateur + ses commandes

[ ] ❌ 3. Accessibilité - Audit RGAA complet
    - Ajouter alt="" sur TOUTES les images
    - Ajouter aria-labels sur boutons
    - Tester navigation clavier (Tab)
    - Vérifier contraste couleurs

[ ] ❌ 4. Système Email - PHPMailer/SwiftMailer
    - Installation package composer
    - Configuration SMTP
    - Endpoints:
      - POST /PHP/sendWelcomeEmail.php (inscription)
      - POST /PHP/sendContactEmail.php (contact)
      - POST /PHP/sendConfirmationEmail.php (commande)
      - POST /PHP/sendStatusEmail.php (changement statut)
      - POST /PHP/sendWarningEmail.php (matériel 10j)

[ ] ❌ 5. Mot de passe oublié - Système complet
    - Lien "J'ai oublié mon mot de passe" sur login.html
    - Page forgot-password.html
    - Endpoint: POST /PHP/forgotPassword.php (génère token)
    - Endpoint: POST /PHP/resetPassword.php (réinitialise)
    - Email avec lien de réinitialisation

[ ] ❌ 6. Matériel de Prêt - Champ + Logique
    - Ajouter champ "Matériel de prêt?" sur commande.html
    - Créer statut "en attente du retour de matériel"
    - Endpoint: POST /PHP/trackMaterialReturn.php
    - Email 10j avant expiration: "Frais 600€ si non restitué"
    - Bouton "Restituer matériel" dans espace-utilisateur.html

[ ] ❌ 7. Déploiement Production
    - Choisir serveur (AWS, Heroku, OVH, etc.)
    - Configurer domaine personnalisé
    - Certificat SSL/HTTPS
    - Variables d'env (remplacer localhost)
    - Test en production

[ ] ❌ 8. Annulation Commande par Employé
    - Formulaire modal: "Motif + Mode de contact"
    - Endpoint: POST /PHP/cancelCommandeEmployee.php
    - Email au client
```

### 🟡 TÂCHES IMPORTANTES (À améliorer)

```
[ ] ⚠️ 9. Footer - Afficher Horaires
    - Modifier script.js loadFooter()
    - Récupérer depuis /PHP/get_horaires.php
    - Afficher: Lundi-Dimanche, Heure ouv - Heure ferm

[ ] ⚠️ 10. Vérifier Filtres Menus
    - Tester filtres prix, thème, régime, nb personnes
    - S'assurer qu'ils mettent à jour l'affichage sans reload

[ ] ⚠️ 11. Vérifier Modification Commande
    - Utilisateur peut modifier: nb personnes, date, heure, adresse
    - Utilisateur CANNOT modifier: menu choisi
    - Endpoint: POST /PHP/updateCommande.php

[ ] ⚠️ 12. Affichage Détail Menu
    - Sur menu-detail.html: afficher tous les éléments
    - Bouton "COMMANDER" → Pré-rempli sur commande.html
    - Redirect non-auth vers login

[ ] ⚠️ 13. Historique Commande
    - Afficher la timeline: "Statut changé le 05/03 à 14h30"
    - Données dans commandes.historique (JSON)
    - Endpoint: POST /PHP/trackCommandeHistory.php

[ ] ⚠️ 14. Vérifier Statuts Commande
    - Database: en attente, accepté, en préparation, en cours de livraison, livré, terminée, en attente du retour de matériel
    - Espace-employe.html: afficher tous les statuts
    - Transitions logiques OK?

[ ] ⚠️ 15. Notification Avis Utilisateur
    - Après livraison: email "Laissez un avis"
    - Lien vers espace-utilisateur.html avec pré-rempli (menu)
    - Afficher notification "Notifiez-vous, vous pouvez laisser un avis"
```

### 🟢 TÂCHES OPTIONNELLES (Bonus)

```
[ ] ✅ 16. Export Données GDPR
    - Bouton "Exporter mes données" (espace-utilisateur.html)
    - Format JSON/CSV
    - Endpoint: GET /PHP/exportUserData.php

[ ] ✅ 17. SMS Notifications
    - Utiliser Twilio pour envoyer SMS
    - "Votre commande est prête!"
    - "Rappel: restituer matériel avant DATE"

[ ] ✅ 18. Système Avis Google
    - Lien vers avis Google depuis index.html
    - Widget avis Google intégré

[ ] ✅ 19. Langue Bilingue (FR/EN)
    - i18n avec JSON ou gettext
    - Sélecteur de langue dans navbar
```

---

## 🎯 PRIORITÉ DE CORRECTION

### 1️⃣ **CRITIQUE - Faire avant présentation jury**
- ✅ Tester tous les flux (auth, commande, avis)
- ✅ Vérifier filtres menus
- ⚠️ RGPD - Ajouter page privacy-policy.html
- ⚠️ Accessibilité - Ajouter alt="" sur images
- ⚠️ Horaires dans footer

### 2️⃣ **IMPORTANT - Faire avant livraison**
- ❌ Système email (BLOQUANT si pas implémenté)
- ❌ Mot de passe oublié
- ❌ Déploiement production
- ❌ Matériel de prêt

### 3️⃣ **BONUS - Après livraison**
- Export GDPR
- SMS
- Bilingue

---

## 📞 QUESTIONS À VALIDER AVEC LE CLIENT

1. **Email**: Est-ce que PHPMailer doit envoyer des vrais emails ou juste afficher les logs?
2. **Production**: Quel serveur? (AWS, Heroku, OVH, etc.)
3. **Matériel**: Quels types de matériel? (Chaises, tables, etc.)
4. **Horaires**: Afficher les jours fermés (ex: "Fermé le lundi")?
5. **Statut**: "Accepté" et "En préparation" sont-ils deux statuts différents ou un seul?
6. **Stock**: Comment gérer quand stock=0? (Masquer le menu?)

---

## 🚀 PLAN D'ACTION

### Phase 1: Avant présentation (3-4 jours)
1. ✅ Tester tous les flux end-to-end
2. ✅ Ajouter privacy-policy.html
3. ✅ Ajouter alt="" sur images
4. ✅ Afficher horaires dans footer

### Phase 2: Avant livraison (1 semaine)
1. ❌ Implémenter email
2. ❌ Mot de passe oublié
3. ❌ Matériel de prêt
4. ❌ Déployer en production

### Phase 3: Maintenance (post-livraison)
1. Monitoring
2. Backup base de données
3. Support utilisateurs

---

## 📝 NOTES FINALES

**Points Forts:**
- ✅ Architecture Docker correcte et reproducible
- ✅ Base de données InnoDB bien structurée
- ✅ Sécurité (PDO, hash password, sessions)
- ✅ Pages HTML bien organisées
- ✅ Majorité des fonctionnalités présentes

**Points À Améliorer:**
- ❌ Système email manquant (CRITIQUE)
- ❌ RGPD incomplet
- ❌ Accessibilité insuffisante
- ❌ Déploiement non fait
- ⚠️ Quelques détails à vérifier (filtres, statuts, etc.)

**Estimation:**
- ✅ Application = 75% prêt pour présentation
- ❌ Application = 50% prête pour production
- 🎯 Objectif: 100% pour livraison


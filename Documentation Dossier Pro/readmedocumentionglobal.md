# 📱 Documentation Globale - Projet "Vite et Gourmand"

## 🎯 Vue d'ensemble du Projet

**Vite et Gourmand** est une application web de gestion de restaurant permettant :
- ✅ La consultation de menus et plats
- ✅ La création et gestion de commandes
- ✅ La gestion des avis clients
- ✅ L'administration du restaurant (menus, horaires, employés)

**Technologie**: Application web PHP/MySQL containerisée avec Docker

---

## 🏗️ Architecture Technique - COMMENT ET POURQUOI

### Structure Générale - Pourquoi cette organisation?

```
Project_ECF_(docker)/
├── Dockerfile              # Configuration de l'image PHP
├── docker-compose.yml      # Orchestration des services
├── index.html              # Page d'accueil
├── PHP/                    # Logique métier (26 fichiers PHP)
├── SQL/                    # Base de données (database.sql)
├── pages/                  # Pages HTML
├── assets/                 # Ressources (CSS, JS, images)
└── readme.md              # Instructions de base
```

**POURQUOI cette structure?**
- 📁 **Séparation des responsabilités**: Chaque dossier a un rôle clair
  - PHP/ = logique métier (backend)
  - pages/ = interface utilisateur (frontend)
  - assets/ = ressources visuelles
  - SQL/ = données
- 🔒 **Sécurité**: PHP est dans un dossier séparé, pas accessible directement
- 🎯 **Maintenance**: Facile de trouver un fichier, facile de modifier
- 👥 **Collaboration**: Plusieurs développeurs peuvent travailler sans conflit

---

## 🐳 Docker - COMMENT ET POURQUOI?

### Pourquoi Docker au lieu d'une installation locale?

**Problème sans Docker:**
```
Mon PC:
- PHP 8.2 installé ✓
- MySQL 8.0 installé ✓
- Apache configuré ✓

PC du jury:
- PHP 5.6? 7.0? 8.1? 8.2? ❌
- MySQL 5.5? MariaDB? PostgreSQL? ❌
- Apache? Nginx? ❌
- → L'application ne marche pas!
```

**Solution avec Docker:**
```
Mon PC: docker-compose up -d
↓
Conteneur crée avec EXACTEMENT:
- PHP 8.2
- Apache 2.4
- MySQL 8.0
↓
PC du jury: docker-compose up -d
→ L'application marche IDENTIQUE!
```

**AVANTAGES:**
- ✅ **Portabilité**: Marche sur Windows, Mac, Linux
- ✅ **Reproductibilité**: Même environnement partout
- ✅ **Isolation**: N'affecte pas les autres applications
- ✅ **Facilité**: Une seule commande pour démarrer
- ✅ **Professionnel**: Les entreprises utilisent Docker

### Fichier Dockerfile - COMMENT ET POURQUOI?

```dockerfile
FROM php:8.2-apache
```

**COMMENT**: Récupère l'image officielle PHP 8.2 avec Apache déjà préinstallé (au lieu de l'installer manuellement)

**POURQUOI**:
- ⏱️ Gain de temps: Pas besoin de configurer Apache manuellement
- 🔒 Sécurité: Image officielle = testée et sécurisée
- 🎯 Simplicité: Une ligne au lieu de 50 commandes

---

```dockerfile
RUN docker-php-ext-install pdo pdo_mysql
```

**COMMENT**: Installe les extensions PHP `pdo` et `pdo_mysql`

**POURQUOI**:
- 📊 `pdo` = PHP Data Objects = interface générique pour accéder aux bases de données
- 🗄️ `pdo_mysql` = pilote MySQL spécifique pour PDO
- 🔒 **Protection SQL injection**: PDO avec requêtes préparées = sûr
- ❌ **Alternative dangeureuse**: `mysql_connect()` (ancien) = facile à hacker

**Exemple de la différence:**

```php
// ❌ DANGEREUX (ancien)
$query = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";
// Si email = "' OR '1'='1", cela devient:
// SELECT * FROM users WHERE email = '' OR '1'='1'
// → Retourne tous les utilisateurs!

// ✅ SÛR (PDO avec requêtes préparées)
$query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$query->execute([$_POST['email']]);
// Le ? est remplacé de manière sûre, injection impossible
```

---

```dockerfile
RUN a2enmod rewrite
```

**COMMENT**: Active le module Apache `rewrite` (réécrit les URLs)

**POURQUOI**:
- 🔗 **URLs propres**: 
  - ❌ Sans rewrite: `/index.php?page=menu&id=5`
  - ✅ Avec rewrite: `/menu/5`
- 🎯 **SEO**: Les URLs lisibles sont meilleures pour Google
- 👥 **UX**: Les utilisateurs voient des URLs claires

---

### docker-compose.yml - COMMENT ET POURQUOI?

**COMMENT**: Fichier YAML qui définit 2 services et comment ils communiquent

**POURQUOI utiliser Compose au lieu de `docker run`?**

```bash
# ❌ Sans Compose (compliqué, long à taper):
docker network create mon-reseau
docker run -d --name db --network mon-reseau -e MYSQL_ROOT_PASSWORD=root mysql:8.0
docker run -d --name app --network mon-reseau -p 8080:80 -v .:/var/www/html mon-image
# → 4 commandes, facile de faire des erreurs

# ✅ Avec Compose (simple, lisible):
docker-compose up -d
# → 1 commande, c'est tout!
```

---

#### Service DB (MySQL) - Expliqué

```yaml
db:
  image: mysql:8.0
```

**COMMENT**: Récupère l'image MySQL 8.0 depuis Docker Hub

**POURQUOI MySQL 8.0?**
- 🆕 Version récente (2016) = sécurité + performances
- 🔒 Meilleure qu'une vieille MySQL 5.5
- 📚 Bien documentée, support longue durée

---

```yaml
  container_name: Projet-Vite-et-Gourmand-DB
```

**COMMENT**: Donne un nom au conteneur

**POURQUOI**:
- 🏷️ Plus facile de l'identifier
- 💬 Commandes plus lisibles: `docker logs Projet-Vite-et-Gourmand-DB`
- ❌ Sans nom: `docker logs a3f7b2c1e9d8` (incompréhensible)

---

```yaml
  restart: always
```

**COMMENT**: Redémarre le conteneur automatiquement s'il crash

**POURQUOI**:
- 🔄 **Résilience**: Si MySQL plante à 3h du matin, il redémarre tout seul
- 🏢 **Production**: Comportement attendu en environnement professionnel
- ❌ Sans cela: Application arrêtée jusqu'à redémarrage manuel

---

```yaml
  environment:
    MYSQL_ROOT_PASSWORD: root_password
```

**COMMENT**: Définit le mot de passe root de MySQL via variable d'environnement

**POURQUOI**:
- 🔐 Flexibilité: Changer le mot de passe sans modifier Dockerfile
- 📝 Lisibilité: Variables plutôt que mots de passe en dur dans le code
- ⚠️ **Sécurité (en développement seulement!)**:
  - ❌ En production: Cela serait dangereux (exposé dans docker-compose)
  - ✅ En dev: Acceptable
  - 🔒 Solution pro: Utiliser des secrets Docker ou variables d'env externalisées

---

```yaml
  volumes:
    - ./SQL/database.sql:/docker-entrypoint-initdb.d/init.sql
```

**COMMENT**: Monte le fichier `database.sql` local dans le conteneur

**POURQUOI**:
- 📥 **Initialisation automatique**: Au démarrage, MySQL exécute les fichiers SQL dans `/docker-entrypoint-initdb.d/`
- 🚀 **Démarrage rapide**: Pas besoin de créer la base manuellement, c'est fait automatiquement
- 🔄 **Réinitialisation facile**: `docker-compose down -v` puis `docker-compose up -d` = base vierge

**Flux:**
```
1. MySQL démarre
2. Cherche des fichiers dans /docker-entrypoint-initdb.d/
3. Trouve init.sql
4. Exécute: CREATE TABLE, INSERT, etc.
5. Application peut maintenant utiliser la base
```

---

```yaml
  ports:
    - "3306:3306"
```

**COMMENT**: Mappe le port 3306 du conteneur au port 3306 local

**POURQUOI**:
- 🔌 **Accès local**: Permet de connecter un client MySQL depuis ton PC
- 📊 Exemple: HeidiSQL, MySQL Workbench, PhpMyAdmin
- ❓ **Format**: `PORT_LOCAL:PORT_CONTENEUR`
  - `"3306:3306"` = port 3306 dehors = port 3306 dedans (même)
  - `"3307:3306"` = port 3307 dehors = port 3306 dedans (si 3306 déjà utilisé)

---

#### Service APP (PHP + Apache) - Expliqué

```yaml
  app:
    build: .
```

**COMMENT**: Construit l'image Docker à partir du Dockerfile du dossier courant (`.`)

**POURQUOI `build` au lieu de `image`?**
```yaml
# ❌ Image pré-construite (moins flexible)
image: mon-app:latest

# ✅ Build personnalisé (adaptable)
build: .
```

- 🛠️ Permet de modifier le Dockerfile et relancer `docker-compose up`
- 🎯 Chaque développeur peut utiliser la même recette

---

```yaml
    ports:
      - "8080:80"
```

**COMMENT**: Mappe le port 80 du conteneur au port 8080 local

**POURQUOI 8080 et pas 80?**
- 🔒 **Permissions**: Port 80 = réservé (admin seulement sur Linux)
- ⚙️ **Localisation**: 
  - Port 80 local = probablement déjà utilisé par un autre serveur
  - Port 8080 = rarement utilisé, sûr
- ✅ **Accès**: http://localhost:8080

---

```yaml
    volumes:
      - .:/var/www/html
```

**COMMENT**: Monte le dossier courant (`.`) du PC dans le conteneur (`/var/www/html`)

**POURQUOI c'est crucial?**

```
Structure sans volume:
PC Local:                  Conteneur:
index.php ❌              /var/www/html (vide!)
  ↓ Modification          Apache ne voit rien
Fichier modifié ❌        Pas de changement

Structure avec volume:
PC Local:                  Conteneur:
index.php ✅              /var/www/html ✅
  ↓ Modification          Apache voit le changement
Fichier modifié ✅        IMMÉDIAT! (hot reload)
```

**AVANTAGES:**
- 🔥 **Hot reload**: Modifie un fichier PHP, actualise navigateur = changement vu immédiatement
- 📝 **Édition facile**: Utilise ton éditeur préféré sur le PC (VS Code, Sublime, etc.)
- 🔄 **Synchronisation**: Pas besoin de copier/coller dans le conteneur

**POURQUOI Apache utilise `/var/www/html`?**
- 📚 Standard Apache = répertoire par défaut où chercher les fichiers web
- 🎯 Configurable mais `/var/www/html` = convention universelle

---

```yaml
    depends_on:
      - db
```

**COMMENT**: Indique que le service `app` dépend du service `db`

**POURQUOI?**
```
SANS depends_on:
1. APP démarre ← cherche à se connecter à MySQL
2. MySQL démarre (trop tard!)
3. APP: "Erreur: MySQL pas disponible!" ❌

AVEC depends_on:
1. MySQL démarre d'abord
2. APP démarre ensuite ✅
3. Connexion réussie ✅
```

**Important**: `depends_on` attend juste que le conteneur démarre, pas qu'il soit vraiment prêt. Idealement, le code PHP devrait retry la connexion si MySQL n'est pas encore pret.

---

### Réseau Docker - Comment les services communiquent?

**COMMENT**: Docker crée un réseau privé pour que les conteneurs se parlent

```
┌─────────────────────────────────────────┐
│   Réseau Docker (mon-app_default)       │
├─────────────────────────────────────────┤
│                                         │
│   APP                      DB           │
│   (PHP)                    (MySQL)      │
│   :80                      :3306        │
│                                         │
│   Dialogue interne:                     │
│   APP → "db:3306" ✅                   │
│   (utilise le hostname "db")            │
│                                         │
└─────────────────────────────────────────┘
```

**POURQUOI le hostname "db" fonctionne?**
- 🔗 Docker a un DNS interne qui résout "db" → IP du conteneur MySQL
- 🎯 Pas besoin de connaître l'IP réelle (qui change à chaque redémarrage)

**Code PHP de connexion:**
```php
$host = "db";           // Non "localhost" ou "127.0.0.1"!
$port = 3306;           // Port interne du conteneur
$db = "nom_base";
$user = "root";
$pass = "root_password";

$pdo = new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass);
```

---

## 📊 Modèle de Données - COMMENT ET POURQUOI?

### Tables Principales - Structure et Justification

#### 1. **Table Utilisateurs**

```sql
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Hashé!
    nom VARCHAR(100),
    prenom VARCHAR(100),
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    type ENUM('client', 'admin') DEFAULT 'client',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**COMMENT les champs sont choisis?**
- 📧 **email UNIQUE**: Pas deux comptes avec le même email
- 🔐 **password VARCHAR(255)**: Stocke le hash du mot de passe, pas le mot de passe lui-même
- 📞 **telephone VARCHAR(20)**: Chaîne de caractères (peut avoir +33, etc.)
- 🔀 **type ENUM**: Limite à 'client' ou 'admin' (protection contre typos)

**POURQUOI VARCHAR et pas TEXT?**
- ⚡ VARCHAR est plus rapide pour les recherches
- 💾 TEXT = plus de mémoire inutile pour de petits textes
- 📏 email max ~255 caractères = VARCHAR(255) idéal

**POURQUOI TIMESTAMP DEFAULT CURRENT_TIMESTAMP?**
- ⏰ Sauvegarde automatiquement la date/heure de création
- 🔍 Utile pour traçabilité ("qui a créé ce compte quand?")
- ❌ Sans cela: Faut faire `date_creation = NOW()` dans le code à chaque insert

---

#### 2. **Table Employés**

```sql
CREATE TABLE employes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    statut ENUM('actif', 'suspendu') DEFAULT 'actif',
    date_embauche TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**COMMENT c'est différent des utilisateurs?**
- 👥 Utilisateurs = clients du restaurant
- 👔 Employés = staff du restaurant
- 🔑 Raison de séparer: Accès différents, permissions différentes

**POURQUOI un champ "statut"?**
```php
// Suspendre un employé sans le supprimer:
UPDATE employes SET statut = 'suspendu' WHERE id = 5;

// Plutôt que de le supprimer:
// DELETE FROM employes WHERE id = 5;  ← Perd l'historique!
```

**Avantages:**
- 🔄 Réversible: Peut réactiver simplement
- 📋 Historique conservé: Traçabilité
- 🔒 Intégrité: Les commandes de cet employé restent liées

---

#### 3. **Tables Menus & Plats**

```sql
CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255)
)

CREATE TABLE plats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,  -- 10 chiffres, 2 décimales (9999.99 €)
    image VARCHAR(255),
    menu_id INT NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
)
```

**COMMENT les relier?**
- 🔗 **FOREIGN KEY**: `menu_id` dans `plats` pointe vers `menus(id)`
- ❌ Sans cela: Risque d'orphelins (plat sans menu valide)

**Exemple d'intégrité:**
```sql
-- ✅ Fonctionne (menu avec id=1 existe)
INSERT INTO plats VALUES (1, 'Pizza Margarita', 'Classique', 12.50, 'pizza.jpg', 1);

-- ❌ Erreur! (menu avec id=999 n'existe pas)
INSERT INTO plats VALUES (2, 'Pizza 4 Fromages', '...', 14.50, 'pizza4.jpg', 999);
-- FOREIGN KEY constraint violation!
```

**POURQUOI DECIMAL et pas FLOAT?**
- 💰 Prix = données critiques, besoin de précision
- ❌ FLOAT: Peut donner 12.50000000001 (arrondis bizarres)
- ✅ DECIMAL(10,2): Exactement 2 décimales, pas d'erreurs

---

#### 4. **Table Commandes**

```sql
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    montant_total DECIMAL(10, 2),
    statut ENUM('en attente', 'preparee', 'livree', 'annulee') DEFAULT 'en attente',
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
)

CREATE TABLE details_commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    plat_id INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10, 2),
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (plat_id) REFERENCES plats(id)
)
```

**POURQUOI 2 tables et pas 1?**

```
❌ MAUVAIS (tout dans une table):
commandes:
id | user | plat1 | qty1 | plat2 | qty2 | plat3 | qty3 | ...
1  | jean | pizza | 1    | pâte | 2    | NULL  | NULL | ...
→ Problème: Colonnes NULL inutiles, pas flexible

✅ BON (2 tables):
commandes:
id | user    | montant | statut
1  | jean    | 28.50   | livrée

details_commandes:
id | commande_id | plat_id | quantite | prix
1  | 1           | 5       | 1        | 12.50
2  | 1           | 3       | 2        | 8.00
→ Flexible: 0 plat ou 100 plats, pas de colonne NULL
```

**POURQUOI "en attente", "preparee", "livree", "annulee"?**
```
Flux d'une commande:
1. Client passe commande → "en attente"
2. Employé accepte → "preparee"
3. Employé livre → "livree"
   OU
3. Client annule → "annulee"
```

---

#### 5. **Table Avis**

```sql
CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    plat_id INT NOT NULL,
    note INT CHECK (note >= 1 AND note <= 5),  -- 1 à 5 étoiles
    commentaire TEXT,
    statut ENUM('en attente', 'approuve', 'rejete') DEFAULT 'en attente',
    date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (plat_id) REFERENCES plats(id)
)
```

**POURQUOI un statut "en attente"?**
```
Modération des avis:
1. Client ajoute avis → "en attente"
2. Employé voit les avis en attente
3. Approuve ou rejette → "approuve" ou "rejete"
4. Seuls les approuvés s'affichent sur le site
```

**Sécurité:**
```php
// Afficher les avis
// ✅ BON: Seulement les approuvés
SELECT * FROM avis WHERE statut = 'approuve' AND plat_id = 5;

// ❌ MAUVAIS: Afficher tous
SELECT * FROM avis WHERE plat_id = 5;
// → Avis rejetés et spam visibles!
```

---

#### 6. **Table Horaires**

```sql
CREATE TABLE horaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jour_semaine ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'),
    heure_ouverture TIME,
    heure_fermeture TIME
)
```

**COMMENT gérer les jours de la semaine?**

**POURQUOI ENUM et pas VARCHAR?**
```sql
-- ❌ MAUVAIS (VARCHAR):
jour_semaine VARCHAR(20)
→ Peut insérer: 'lundi', 'LUNDI', 'lundy', 'vendredi12' (typos!)

-- ✅ BON (ENUM):
jour_semaine ENUM('lundi', 'mardi', ..., 'dimanche')
→ Erreur si essaie d'insérer une valeur invalide
```

**COMMENT trier les jours dans le bon ordre?**

En PHP (après récupération):
```php
// Récupérer depuis la base
$horaires = $pdo->query("SELECT * FROM horaires")->fetchAll();

// Définir l'ordre souhaité
$ordre = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

// Trier en fonction de cet ordre
usort($horaires, function($a, $b) use ($ordre) {
    return array_search($a['jour_semaine'], $ordre) - array_search($b['jour_semaine'], $ordre);
});

// Résultat: lundi, mardi, ..., dimanche (dans le bon ordre)
```

**POURQUOI ne pas utiliser 1-7 (numéros)?**
```sql
-- ❌ MOINS LISIBLE:
jour_semaine INT (1 = lundi, 2 = mardi, ...)
→ Dans le code: if (jour == 3) ← difficile de se souvenir

-- ✅ PLUS LISIBLE:
jour_semaine ENUM('lundi', 'mardi', ...)
→ Dans le code: if (jour == 'mercredi') ← clair!
```

---

#### 7. **Table Images**

```sql
CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chemin_fichier VARCHAR(255) NOT NULL,
    type ENUM('menu', 'plat') NOT NULL,
    type_id INT NOT NULL,  -- id du menu ou du plat
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**POURQUOI une table séparée et pas juste un champ dans menus/plats?**

Option 1 (MAUVAIS - image dans menus/plats):
```sql
menus:
id | nom    | image
1  | Pizzas | pizzas.jpg

Problème: Un seul image par menu
```

Option 2 (BON - table images séparée):
```sql
menus:
id | nom    
1  | Pizzas 

images:
id | chemin     | type | type_id
1  | pizza1.jpg | menu | 1
2  | pizza2.jpg | menu | 1
3  | pizza3.jpg | menu | 1

Avantage: Plusieurs images par menu
```

---

### Choix InnoDB - COMMENT ET POURQUOI?

#### Comparaison InnoDB vs MyISAM

| Fonctionnalité | InnoDB | MyISAM | Besoin pour nous |
|---|---|---|---|
| **Transactions** | ✅ Oui | ❌ Non | ✅ Critique (commandes) |
| **Foreign Keys** | ✅ Oui | ❌ Non | ✅ Critique (intégrité) |
| **Verrouillage** | Ligne | Table | ✅ Important (concurrence) |
| **Crash recovery** | ✅ Robuste | ❌ Faible | ✅ Critique (data) |

**COMMENT les transactions protègent les commandes?**

Scenario: Créer une commande avec 2 plats

```sql
-- SANS transaction (InnoDB désactivé):
INSERT INTO commandes VALUES (1, jean, 28.50, 'en attente');
-- ✅ Réussit

INSERT INTO details_commandes VALUES (1, 1, 5, 1, 12.50);
-- ✅ Réussit

INSERT INTO details_commandes VALUES (1, 1, 3, 2, 8.00);
-- ❌ ERREUR! (plat_id 3 n'existe pas)
-- → Commande dans DB SANS aucun plat! ❌

-- AVEC transaction (InnoDB):
BEGIN;
    INSERT INTO commandes VALUES (1, jean, 28.50, 'en attente');
    INSERT INTO details_commandes VALUES (1, 1, 5, 1, 12.50);
    INSERT INTO details_commandes VALUES (1, 1, 3, 2, 8.00);
    -- ❌ ERREUR!
ROLLBACK;
-- → Tout annulé, comme si on n'avait rien fait ✅
```

**Code PHP avec transactions:**
```php
try {
    $pdo->beginTransaction();
    
    // Créer la commande
    $stmt = $pdo->prepare("INSERT INTO commandes (utilisateur_id, montant_total) VALUES (?, ?)");
    $stmt->execute([$user_id, $montant]);
    $commande_id = $pdo->lastInsertId();
    
    // Ajouter les plats
    foreach ($plats as $plat) {
        $stmt = $pdo->prepare("INSERT INTO details_commandes (commande_id, plat_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)");
        $stmt->execute([$commande_id, $plat['id'], $plat['quantite'], $plat['prix']]);
    }
    
    $pdo->commit();  // ✅ Tout réussit, enregistrer
    
} catch (Exception $e) {
    $pdo->rollBack();  // ❌ Une erreur, annuler tout
    echo "Erreur: " . $e->getMessage();
}
```

**POURQUOI c'est crucial pour un restaurant?**
```
Si la commande est incomplète:
- Serveur prépare rien pour le client ❌
- Client attend pour rien
- Perte d'argent
→ Les transactions évitent cela!
```

**COMMENT les foreign keys protègent l'intégrité?**

```sql
-- SANS foreign key:
DELETE FROM menus WHERE id = 5;
-- ✅ Deleted (même si des plats y sont liés!)
-- → Base cassée: plats orphelins ❌

-- AVEC foreign key (InnoDB):
DELETE FROM menus WHERE id = 5;
-- ❌ ERREUR! Foreign key constraint violation
-- → La base reste intègre ✅

-- Bonne approche: Soft delete
UPDATE menus SET actif = 0 WHERE id = 5;
-- Les plats restent liés, données conservées
```

**COMMENT le verrouillage ligne protège contre les conflits?**

```
Scenario: 2 employés modifient la même commande

MyISAM (verrouillage table entière):
1. Employé A modifie commande #10 → verrouille TOUTE la table commandes
2. Employé B essaie modifier commande #20 → attend (table verrouillée!)
3. Employé A finit → A3 peut commencer
→ Lent, faible concurrence ❌

InnoDB (verrouillage ligne):
1. Employé A modifie commande #10 → verrouille seulement la ligne 10
2. Employé B modifie commande #20 → modifie immédiatement (ligne 20 libre!)
3. Employés A et B travaillent en parallèle
→ Rapide, bonne concurrence ✅
```

---

## 🔐 Système d'Authentification - COMMENT ET POURQUOI?

### Hachage des Mots de Passe - COMMENT ET POURQUOI?

**COMMENT stocker un mot de passe?**

```php
// ❌ DANGER! Stocker le mot de passe en clair:
$password = $_POST['password'];
$stmt = $pdo->prepare("INSERT INTO utilisateurs (email, password) VALUES (?, ?)");
$stmt->execute([$email, $password]);  // DANGER!
// Si quelqu'un accède à la base: tous les passwords exposés!

// ✅ BON! Hasher d'abord:
$password = $_POST['password'];
$hashed = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare("INSERT INTO utilisateurs (email, password) VALUES (?, ?)");
$stmt->execute([$email, $hashed]);
// Même si quelqu'un accède à la base: impossible de connaître le password original!
```

**POURQUOI password_hash() est sûr?**

```
Hachage normal (MD5, SHA1):
password: "Admin1234!"
hash MD5: "6b...7c" (toujours le même)
→ Si quelqu'un trouve la hash, peut chercher dans une liste pré-calculée (rainbow table)

Hachage avec salt (BCRYPT):
password: "Admin1234!"
salt aléatoire ajouté
hash BCRYPT: "$2y$10$..." (différent à chaque fois!)
→ Impossible de pré-calculer, cryptographiquement fort
```

**COMMENT vérifier le mot de passe à la connexion?**

```php
// Login
$email = $_POST['email'];
$password = $_POST['password'];

$stmt = $pdo->prepare("SELECT id, password FROM utilisateurs WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    // ✅ Mot de passe correct!
    $_SESSION['user_id'] = $user['id'];
    header("Location: index.php");
} else {
    // ❌ Email ou mot de passe incorrect
    echo "Erreur d'authentification";
}
```

**POURQUOI password_verify() et pas strcmp()?**

```php
// ❌ DANGER! Timing attack:
if (strcmp($password, $stored_hash) == 0) {  // Compare en clair
    // Un attaquant peut mesurer le temps de comparaison
    // "aaa..." vs "bbb..." → différence rapide
    // "Admin1..." vs "Admin1..." → plus long = commence pareil!
    // → Peut deviner le hash caractère par caractère
}

// ✅ BON! Constant-time comparison:
if (password_verify($password, $stored_hash)) {
    // Toujours le même temps, peu importe le résultat
    // Attaquant ne peut pas deviner
}
```

---

### Système de Sessions - COMMENT ET POURQUOI?

**POURQUOI utiliser les sessions plutôt que d'envoyer le password à chaque requête?**

```
❌ MAUVAIS (password à chaque fois):
1. Client envoie email + password
2. Serveur valide
3. Client envoie email + password pour accéder au menu
4. Serveur valide
5. Client envoie email + password pour passer une commande
6. ...
→ Password envoyé 100 fois! Plus d'erreurs, plus lent, moins sûr

✅ BON (sessions):
1. Client envoie email + password → authentification
2. Serveur crée SESSION et stocke user_id
3. Client reçoit COOKIE (session_id) et le renvoie à chaque requête
4. Serveur dit: "Je reconnais cette session_id, c'est jean"
5. Jean accède à ses données sans renvoyer password
```

**COMMENT fonctionnent les sessions en PHP?**

```php
// REGISTRATION
if (authenticate($email, $password)) {
    session_start();  // Démarre la session PHP
    $_SESSION['user_id'] = $user['id'];  // Stocke l'ID dans la session
    $_SESSION['user_email'] = $user['email'];  // Stocke d'autres données
    // PHP crée un COOKIE avec un session_id
    // LE COOKIE est envoyé au client
}

// REQUÊTE SUIVANTE
session_start();  // Lecture du COOKIE, récupère la session
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];  // Récupère l'ID sans authentifier à nouveau
    // → Utilisateur identifié!
}

// LOGOUT
session_destroy();  // Supprime la session
// Le COOKIE devient invalide
```

**COMMENT le serveur stocke les sessions?**

```
Défaut: Fichiers
/var/lib/php/sessions/sess_abc123def456...
Contient: user_id=5|user_email=jean@...

Production: Base de données ou Redis
→ Plus rapide, plus sûr, scalable
```

**POURQUOI les COOKIES sont sûrs?**

```php
// COOKIE de session:
Set-Cookie: PHPSESSID=abc123; HttpOnly; Secure; SameSite=Strict

Flags:
- HttpOnly: JavaScript ne peut pas y accéder (protection XSS)
- Secure: Seulement envoyé en HTTPS (protection MITM)
- SameSite: Pas envoyé cross-domain (protection CSRF)

→ L'attaquant ne peut pas voler le COOKIE
```

---

## 📁 Architecture des Fichiers PHP - COMMENT ET POURQUOI?

### Philosophie d'Organisation

**POURQUOI chaque action = un fichier PHP séparé?**

Architecture 1 (MAUVAIS - tout dans index.php):
```php
// index.php (2000 lignes!)
if ($_GET['action'] == 'login') { ... 200 lignes ... }
if ($_GET['action'] == 'register') { ... 200 lignes ... }
if ($_GET['action'] == 'getMenus') { ... 200 lignes ... }
if ($_GET['action'] == 'saveCommande') { ... 200 lignes ... }
...
→ Impossible à maintenir, trop complexe
```

Architecture 2 (BON - fichiers séparés):
```
PHP/
├── login.php           ← Que le login
├── register.php        ← Que l'inscription
├── getMenus.php        ← Que récupérer les menus
├── saveCommande.php    ← Que sauvegarder une commande
└── ...
```

**Avantages:**
- 🎯 Chaque fichier a UNE responsabilité
- 🔍 Facile de trouver le code à modifier
- 👥 Plusieurs développeurs peuvent travailler sans conflits
- ✅ Code testé = testé isolément

---

### Fichier Database.php - LE CŒUR

**COMMENT Database.php fonctionne?**

```php
<?php
// Database.php

class Database {
    private $host = "db";           // Hostname du conteneur MySQL
    private $db = "mon_restaurant";
    private $user = "root";
    private $pass = "root_password";
    private $charset = "utf8mb4";
    
    public function connect() {
        $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$this->charset";
        
        try {
            $pdo = new PDO($dsn, $this->user, $this->pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            die("Erreur de connexion: " . $e->getMessage());
        }
    }
}
?>
```

**POURQUOI une classe Database au lieu de connexion inline?**

```php
// ❌ MAUVAIS (copié/collé dans chaque fichier):
// login.php:
$pdo = new PDO("mysql:host=db;dbname=mon_restaurant", "root", "root_password");

// getMenus.php:
$pdo = new PDO("mysql:host=db;dbname=mon_restaurant", "root", "root_password");

// saveCommande.php:
$pdo = new PDO("mysql:host=db;dbname=mon_restaurant", "root", "root_password");

// Problème: Si je change le password, dois modifier 100 fichiers! ❌

// ✅ BON (classe réutilisable):
// Tous les fichiers:
$db = new Database();
$pdo = $db->connect();

// Si je change le password: une seule modification dans Database.php! ✅
```

**POURQUOI dsn = "mysql:host=db;..."?**
- `mysql:` = pilote à utiliser (MySQL, pas PostgreSQL)
- `host=db` = hostname du conteneur (résolu par DNS Docker)
- `dbname=mon_restaurant` = base à utiliser
- `charset=utf8mb4` = encodage (supporte emojis)

**COMMENT les erreurs sont gérées?**

```php
PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION

Options:
- ERRMODE_SILENT: Ignore les erreurs (mauvais!)
- ERRMODE_WARNING: Affiche des warnings (moyen)
- ERRMODE_EXCEPTION: Jette une exception (bon!)
  → Permet try/catch pour gérer proprement
```

---

### Fichier login.php - AUTHENTIFICATION

**FLUX complet:**

```
1. Frontend envoie: POST /PHP/login.php
   email: jean@...
   password: mypassword

2. login.php reçoit:
   $email = $_POST['email'];
   $password = $_POST['password'];

3. Valide l'email et le password:
   SELECT * FROM utilisateurs WHERE email = ?
   password_verify($password, $hash_stocke)?

4. Si OK:
   session_start();
   $_SESSION['user_id'] = $id;
   echo json_encode(['success' => true]);

5. Frontend reçoit: {"success": true}
   Redirige vers index.php

6. Sur les pages suivantes:
   session_start();
   $user_id = $_SESSION['user_id'];  ← Identifié!
```

**POURQUOI json_encode?**

```php
// ❌ MAUVAIS (retour texte):
echo "LOGIN_SUCCESS";
// Frontend doit parser des strings → fragile

// ✅ BON (retour JSON):
echo json_encode(['success' => true, 'message' => 'Bienvenue!']);
// Frontend parse du JSON → structuré, facile

// JavaScript:
fetch('/PHP/login.php', { method: 'POST', ... })
    .then(r => r.json())  ← parse JSON
    .then(data => {
        if (data.success) {
            window.location = 'index.php';
        } else {
            alert(data.message);
        }
    })
```

---

### Fichiers getMenus.php, getEmployes.php, etc - LECTURES

**PATTERN:** Récupérer des données et les retourner en JSON

```php
<?php
// getMenus.php

header('Content-Type: application/json');  // Dit au navigateur: "C'est du JSON"

try {
    $db = new Database();
    $pdo = $db->connect();
    
    $stmt = $pdo->query("SELECT * FROM menus WHERE actif = 1");
    $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($menus);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
```

**POURQUOI PDO::FETCH_ASSOC?**

```php
// Résultat:
$result = [
    ['id' => 1, 'nom' => 'Pizzas', 'description' => 'Nos pizzas'],
    ['id' => 2, 'nom' => 'Pâtes', 'description' => 'Nos pâtes'],
]

// ✅ Facile à convertir en JSON
// Navigateur reçoit: [{"id":1,"nom":"Pizzas",...}, ...]
```

---

### Fichiers saveCommande.php, addAvis.php, etc - ÉCRITURES

**PATTERN:** Recevoir des données, valider, sauvegarder

```php
<?php
// saveCommande.php

header('Content-Type: application/json');

try {
    // 1. Authentifier
    session_start();
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("Non authentifié");
    }
    $user_id = $_SESSION['user_id'];
    
    // 2. Recevoir les données
    $plats = json_decode($_POST['plats'], true);  // Panier envoyé en JSON
    
    // 3. Valider les données
    if (empty($plats)) {
        throw new Exception("Panier vide");
    }
    
    // 4. Calculer le montant
    $montant = 0;
    foreach ($plats as $plat) {
        $montant += $plat['prix'] * $plat['quantite'];
    }
    
    // 5. Sauvegarder avec transaction
    $db = new Database();
    $pdo = $db->connect();
    
    $pdo->beginTransaction();
    
    // Créer la commande
    $stmt = $pdo->prepare("INSERT INTO commandes (utilisateur_id, montant_total) VALUES (?, ?)");
    $stmt->execute([$user_id, $montant]);
    $commande_id = $pdo->lastInsertId();
    
    // Ajouter les détails
    foreach ($plats as $plat) {
        $stmt = $pdo->prepare("INSERT INTO details_commandes (commande_id, plat_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)");
        $stmt->execute([$commande_id, $plat['id'], $plat['quantite'], $plat['prix']]);
    }
    
    $pdo->commit();
    
    echo json_encode(['success' => true, 'commande_id' => $commande_id]);
    
} catch (Exception $e) {
    if ($pdo) $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
```

**POURQUOI cette structure?**
1. 🔐 Authentification d'abord (sécurité)
2. 📥 Recevoir et valider les données
3. 🧮 Traiter/calculer
4. 💾 Sauvegarder avec transaction
5. 📤 Retourner résultat

---

## 🌐 Frontend - COMMENT ET POURQUOI?

### Importer Bootstrap et Style

**POURQUOI Bootstrap CDN plutôt que local?**

```html
<!-- ❌ MAUVAIS (Bootstrap local):
<link rel="stylesheet" href="assets/css/bootstrap.css">
→ Fichier lourd (200KB) à télécharger
→ Ralentit le chargement

<!-- ✅ BON (Bootstrap CDN):
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
→ Déjà en cache chez la plupart des navigateurs
→ Chargement plus rapide
→ Pas de fichier local à maintenir
```

---

### Importer Police Google Fonts

**COMMENT et POURQUOI Roboto?**

```html
<!-- Dans le head: -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

<!-- Dans style.css: -->
body {
    font-family: 'Roboto', sans-serif;
}
```

**POURQUOI Roboto et pas Arial/Times?**
- 🎨 Roboto = police moderne, lisible, professionnelle
- 📱 Conçue pour le web et mobile
- 🌍 Supporte tous les alphabets (latin, cyrillique, etc.)
- ✅ Google l'héberge = libre d'accès

**POURQUOI `display=swap`?**
```
display=swap = affiche le texte avec fallback d'abord,
puis remplace avec Roboto quand chargée
→ Texte visible immédiatement, pas de blanc
```

---

### Importer JavaScript

**POURQUOI mettre script à la fin du body et pas en head?**

```html
<!-- ❌ En head: -->
<head>
    <script src="bootstrap.js"></script>  ← Bloque le chargement du body!
</head>
<body>
    <!-- Le navigateur attend que bootstrap.js charge avant de lire body -->
    <!-- → Page vierge pendant X secondes
</body>

<!-- ✅ En fin de body: -->
<body>
    <!-- ... le HTML se charge d'abord -->
    <script src="bootstrap.js"></script>  ← Chargé après
    <script src="script.js"></script>
    <!-- → Page visible immédiatement
</body>
```

**POURQUOI `defer` n'est pas utilisé?**
```html
<!-- Avec defer: -->
<script defer src="script.js"></script>

<!-- vs Sans defer (à la fin du body): -->
</script src="script.js"></script>

Les deux ont le même effet, mais:
- defer = télécharge en parallèle
- fin du body = plus simple, plus lisible
→ Tu as choisi la fin du body = légitime!
```

---

### Structure HTML

**POURQUOI plusieurs pages (index.html, pages/menu.html, etc)?**

Option 1 (SPA - Single Page Application):
```html
<!-- index.html avec tout le contenu caché -->
<div id="home" style="display:none">...</div>
<div id="menus" style="display:none">...</div>
<div id="commandes" style="display:none">...</div>

<script>
    // JavaScript montre/cache selon la page
    function showPage(page) {
        document.querySelectorAll('div').forEach(d => d.style.display = 'none');
        document.getElementById(page).style.display = 'block';
    }
</script>
```

Option 2 (Fichiers séparés - TON CHOIX):
```
pages/
├── index.html
├── menus.html
├── commandes.html
└── profil.html
```

**POURQUOI tu as choisi l'option 2?**
- 🎯 Chaque page = un fichier = lisible
- 🔍 Navigation classique (utilisateur comprend)
- 📁 Organisation claire
- 🚀 Plus rapide au développement

**Alternative SPA serait mieux pour:**
- ⚡ Expérience fluide (transitions rapides)
- 📊 Applications complexes (Gmail, Google Docs)

**Ton choix est bon pour un projet scolaire/petit projet!**

---

## 🚀 Déploiement Docker - COMMENT ET POURQUOI?

### Cycle de vie complet

**COMMENT démarrer l'application?**

```bash
cd C:\...\Project_ECF_(docker)
docker-compose up -d

# Qu'est-ce qui se passe?
1. Docker lit docker-compose.yml
2. Construit l'image PHP (si pas déjà construite)
3. Crée les réseaux Docker privés
4. Démarre MySQL (attend que init.sql s'exécute)
5. Démarre PHP/Apache
6. Retour du prompt (grâce à -d = detached)
```

**POURQUOI -d (detached)?**

```bash
# ❌ SANS -d (foreground):
docker-compose up
[services running logs...]
← Tu dois garder terminal ouvert
← Ctrl+C arrête tout

# ✅ AVEC -d (detached):
docker-compose up -d
✓ Done
← Tu récupères le prompt immédiatement
← Services tournent en arrière-plan
```

---

### Flux de requête - Du navigateur à la base

```
1. Utilisateur: http://localhost:8080/pages/menus.html
   ↓
2. Navigateur envoie requête HTTP au port 8080
   ↓
3. Docker mappe port 8080 → port 80 du conteneur
   ↓
4. Apache reçoit la requête
   ↓
5. Apache cherche /var/www/html/pages/menus.html
   ↓
6. Grâce au volume (. → /var/www/html), trouve le fichier
   ↓
7. Envoie menus.html au navigateur
   ↓
8. menus.html contient: <script src="/PHP/getMenus.php"></script>
   ↓
9. Navigateur envoie deuxième requête: http://localhost:8080/PHP/getMenus.php
   ↓
10. Apache envoie à PHP (engine)
    ↓
11. PHP exécute getMenus.php:
    - $pdo->connect("db:3306") ← utilise hostname Docker
    - SELECT * FROM menus
    - Retourne JSON
    ↓
12. Navigateur reçoit JSON, affiche les menus
```

**POURQUOI le hostname "db" fonctionne?**

Sans Docker:
```
localhost = 127.0.0.1 = MON PC
→ Pour accéder à MySQL sur le même PC: 127.0.0.1:3306
```

Avec Docker:
```
localhost = 127.0.0.1 = HOST (PC du jury)
MySQL tourne DANS un conteneur = IP différente (172.18.0.2 par exemple)
→ Pas accès via 127.0.0.1

MAIS: Docker crée un réseau privé
→ "db" = hostname du conteneur
→ DNS Docker résout "db" → IP du conteneur
→ Communication interne au réseau privé
```

---

### Réinitialisation Complète

**COMMENT réinitialiser la base?**

```bash
docker-compose down -v
# Qu'est-ce qui se passe?
# - down: arrête et supprime les conteneurs
# - -v: supprime aussi les volumes (y compris les données MySQL!)

docker-compose up -d
# Redémarre tout
# MySQL exécute database.sql de nouveau
# Base avec données initiales = comme au départ ✅
```

**POURQUOI -v est crucial pour le développement?**

```
Scenario: Tu testes, données weird dans la base
Données fausses: utilisateur 999, menu "xxxxxx", etc.

Sans -v:
docker-compose restart
→ Données restent (la base n'est pas reinitialisée)

Avec -v:
docker-compose down -v
docker-compose up -d
→ Base vierge, données initiales rechargées ✅
```

---

## 🔄 Cycle de Développement Git - COMMENT ET POURQUOI?

### Branching Strategy

**POURQUOI 2 branches (main + developpement)?**

```
main (production-ready):
- Code stable et testé
- Prêt pour présentation au jury
- Tags pour versions

developpement (work in progress):
- Branche de travail quotidienne
- Peut avoir des bugs
- Pour tester avant la merge sur main

Workflow:
1. Créer une feature sur developpement
   git checkout -b feature/ajouter-avis developpement

2. Développer, tester
   git add, git commit

3. Pusher sur developpement
   git push origin feature/ajouter-avis

4. Quand stable: merger sur main
   git merge developpement
   git push origin main

5. Créer une release (optionnel)
   git tag v1.0.0
   git push --tags
```

**POURQUOI cette stratégie?**
- 🎯 main = jamais cassée
- 🧪 developpement = expérimentation libre
- 📊 Historique clair des versions
- 👥 Si plusieurs devs: pas de conflits

---

### Commits et Messages

**COMMENT écrire un bon message de commit?**

```bash
# ❌ MAUVAIS:
git commit -m "fix"
git commit -m "blabla"
git commit -m "zzz"

# ✅ BON:
git commit -m "Ajouter formulaire pour créer un avis"
git commit -m "Corriger bug: commandes sans détails"
git commit -m "Refactoriser Database.php pour lisibilité"

# EXCELLENT (avec scope):
git commit -m "feat(avis): ajouter formulaire de création"
git commit -m "fix(commandes): eviter détails orphelins"
git commit -m "refactor(database): clarifier structure"
```

**POURQUOI c'est important?**
```
6 mois plus tard, tu dois retrouver quand on a ajouté les avis:
git log --grep="avis"
→ Retrouve immédiatement!

vs
git log --all
→ 100 commits "blabla", impossible de trouver
```

---

## 🗂️ Base de Données Détaillée - SQL

### Fichier database.sql - COMMENT IL FONCTIONNE

**Structure générale:**

```sql
-- 1. Créer la base (si elle n'existe pas)
CREATE DATABASE IF NOT EXISTS mon_restaurant;
USE mon_restaurant;

-- 2. Créer les tables
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    ...
);

CREATE TABLE menus (
    ...
);

-- 3. Insérer des données initiales
INSERT INTO utilisateurs VALUES (1, 'admin@site.com', HASH('Admin1234!'), ...);
INSERT INTO menus VALUES (1, 'Pizzas', 'Nos délicieuses pizzas', 'pizzas.jpg');
```

**COMMENT le fichier s'exécute automatiquement?**

```yaml
# docker-compose.yml:
volumes:
  - ./SQL/database.sql:/docker-entrypoint-initdb.d/init.sql
```

Cela signifie:
```
1. Docker crée le conteneur MySQL
2. Cherche les fichiers dans /docker-entrypoint-initdb.d/
3. Trouve init.sql (symlink vers database.sql local)
4. Les exécute dans l'ordre: .sql, .sql.gz, .sh
5. Résultat: base et tables créées ✅
```

**POURQUOI automatiser et pas créer manuellement?**

```
❌ MAUVAIS (manuel):
docker-compose up
→ MySQL vide
→ Lancer PhpMyAdmin
→ Créer la base
→ Importer le SQL
→ 5 minutes de travail à chaque reset

✅ BON (automatisé):
docker-compose up
→ SQL exécuté automatiquement
→ Base prête en 5 secondes
→ Idéal pour tests/demo
```

---

## 📋 Flux d'une Commande - Détail Complet

### Du début à la fin

```
1. CLIENT CONSULTE MENUS
   index.html
   → <script> appelle /PHP/getMenus.php
   → getMenus.php requête MySQL: SELECT * FROM menus
   → Retourne JSON des menus
   → Navigateur affiche les menus

2. CLIENT AJOUTE PLAT AU PANIER (JavaScript côté client)
   script.js localStorage['panier'] = [{id: 5, nom: 'Pizza', ...}, ...]
   → Rien n'est sauvegardé en base pour l'instant

3. CLIENT VALIDE LA COMMANDE
   Clique "Valider"
   → Envoie POST à /PHP/saveCommande.php
   → Données: session (implicite), panier en JSON

4. SERVEUR CRÉÉ LA COMMANDE
   saveCommande.php:
   a) Vérifier session → utilisateur authentifié?
   b) Valider panier → pas vide? plats existent?
   c) Créer transaction
      INSERT INTO commandes → id = 5
      INSERT INTO details_commandes (5, 12, 1, 12.50)  ← plat 12, qty 1
      INSERT INTO details_commandes (5, 15, 2, 8.00)   ← plat 15, qty 2
      COMMIT
   d) Répondre JSON: {success: true, commande_id: 5}

5. CLIENT REÇOIT CONFIRMATION
   Navigateur: "Commande #5 créée!"
   localStorage['panier'] = []  ← vider le panier

6. EMPLOYÉ VOIT LA COMMANDE
   admin.html
   → /PHP/getCommandesAdmin.php
   → SELECT * FROM commandes WHERE statut = 'en attente'
   → Affiche: "Commande #5 de jean (2 pizzas + 1 plat)"

7. EMPLOYÉ ACCEPTE LA COMMANDE
   Clique "Accepter"
   → /PHP/modifierStatutCommande.php?id=5&statut=preparee
   → UPDATE commandes SET statut = 'preparee' WHERE id = 5
   → ✅ Statut changé

8. CLIENT REÇOIT NOTIFICATION (si implémentée)
   "Votre commande est en préparation"
   Affichage: Statut changé à "préparée"

9. EMPLOYÉ VALIDE LIVRAISON
   → /PHP/modifierStatutCommande.php?id=5&statut=livree
   → UPDATE commandes SET statut = 'livree' WHERE id = 5

10. CLIENT VIT SA COMMANDE LIVRÉE
    Historique des commandes: statut = "Livrée" ✅
```

---

## 📊 Pile Technologique Justifiée

| Composant | Choix | Alternativesé Pourquoi pas |
|---|---|---|
| **Langage** | PHP 8.2 | Node.js, Python, Java | PHP = facile à apprendre, hébergement classique |
| **Serveur HTTP** | Apache 2.4 | Nginx, IIS | Apache = fiable, classique, bien documenté |
| **Base SQL** | MySQL 8.0 | PostgreSQL, MariaDB | MySQL = standard, performant, InnoDB excellent |
| **Moteur DB** | InnoDB | MyISAM, TokuDB | InnoDB = transactions, intégrité, sécurité |
| **Frontend** | HTML5+CSS3+JS | React, Vue, Angular | Vanille = plus léger pour petit projet, pas dépendances |
| **CSS Framework** | Bootstrap CDN | Tailwind, Material | Bootstrap = facile, bien documenté, CDN pratique |
| **Orchestration** | Docker Compose | Kubernetes, Swarm | Compose = simple, 1 seul host, idéal pour dev |
| **Versionning** | Git + GitHub | SVN, GitLab | Git = moderne, GitHub = gratuit, populaire |

---

## 🎓 Résumé pour le Jury

### Points Clés à Expliquer

1. **Docker = Portabilité**
   - Même environnement partout
   - Jury lance: docker-compose up -d
   - Application marche sans configuration manuelle

2. **Architecture Modulaire**
   - PHP/ = backend (26 fichiers, chacun une responsabilité)
   - pages/ = frontend (HTML clean)
   - assets/ = ressources
   - SQL/ = données

3. **Sécurité**
   - PDO avec requêtes préparées (injection SQL impossible)
   - Mots de passe hashés avec bcrypt
   - Sessions sécurisées avec cookies HttpOnly
   - InnoDB pour intégrité des données

4. **Transactions = Fiabilité**
   - Commande = créer 2+ tables
   - Avec transaction: soit tout réussit, soit tout annule
   - Pas d'orphelins dans la base

5. **Git = Traçabilité**
   - Branches main (prod) et developpement
   - Commits explicites
   - GitHub public pour montrer le travail

---

## 🚨 Questions Possibles du Jury

### "Pourquoi Docker et pas directement PHP?"
**Réponse**: Docker garantit que l'application marche sur tout système. Sans Docker, le jury devrait installer PHP, MySQL, Apache... et encore, des versions incompatibles rendraient l'app inutilisable.

### "Pourquoi InnoDB et pas MyISAM?"
**Réponse**: Transactions et clés étrangères. Une commande doit créer 2 lignes dans 2 tables. Si une échoue, il faut annuler l'autre. InnoDB = COMMIT/ROLLBACK automatiques. MyISAM = pas de transactions = base cassée possible.

### "Comment vous sécurisez les passwords?"
**Réponse**: Hachage bcrypt + password_verify(). Même si quelqu'un accède à la base, le password original est impossible à récupérer.

### "Pourquoi pas tout dans un seul fichier PHP?"
**Réponse**: Maintenabilité et scalabilité. Chaque fichier = une fonction = facile à trouver/modifier. Multiple devs peuvent travailler sans conflits.

### "Comment les services Docker communiquent?"
**Réponse**: Réseau Docker privé + DNS interne. APP parle à "db:3306" qui est résolu automatiquement vers le conteneur MySQL. Pas besoin d'IP réelle.


# API Enchères - Projet Web2

API REST pour un site d'enchères développé avec Node.js, Express et SQLite.

## 🚀 Installation

1. Cloner le projet
2. Installer les dépendances:
```bash
npm install
```

3. Créer le fichier `.env` à la racine:
```env
PORT=3000
JWT_SECRET=votre_secret_super_securise
DB_PATH=./database.db
NODE_ENV=development
```

4. Initialiser la base de données avec des données fictives:
```bash
npm run init
```

5. Lancer le serveur:
```bash
npm start
```

Pour le développement avec rechargement automatique:
```bash
npm run dev
```

## 📁 Structure du projet

- `src/` - Code source
  - `config/` - Configuration (base de données)
  - `controllers/` - Logique métier
  - `middlewares/` - Middlewares (auth, erreurs)
  - `routes/` - Définition des routes
  - `utils/` - Utilitaires (hash, validation)
- `uploads/` - Images uploadées
- `public/` - Fichiers statiques

## 🔑 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Se connecter
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@test.com",
  "password": "password123"
}
```

Réponse:
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@test.com"
  }
}
```

Pour les requêtes protégées, ajouter le header:
```
Authorization: Bearer <votre_token>
```

## 📚 Endpoints API

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Profil utilisateur (protégé)

### Articles

- `GET /api/articles` - Liste tous les articles (protégé)
- `GET /api/articles/my` - Mes articles (protégé)
- `GET /api/articles/:id` - Détail d'un article (protégé)
- `POST /api/articles` - Créer un article (protégé)

### Images

- `POST /api/images/article/:articleId` - Upload une image (protégé)
- `GET /api/images/article/:articleId` - Liste des images d'un article (protégé)

## 🧪 Tester l'API

### Avec curl
```bash
# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}'

# Créer un article (remplacer YOUR_TOKEN)
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test","description":"Description de test","prix_depart":100}'
  Upload une image (remplacer YOUR_TOKEN et ARTICLE_ID)
curl -X POST http://localhost:3000/api/images/article/1 
-H "Authorization: Bearer YOUR_TOKEN" 
-F "image=@/chemin/vers/image.jpg"

### Avec Postman ou Thunder Client

1. Créer une requête POST vers `/api/auth/login`
2. Copier le token reçu
3. Pour les autres requêtes, ajouter le header:
   - Key: `Authorization`
   - Value: `Bearer <votre_token>`

## 👥 Utilisateurs de test

Après `npm run init`, vous pouvez utiliser:

- **Alice**: alice@test.com / password123
- **Bob**: bob@test.com / password123
- **Charlie**: charlie@test.com / password123

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ Protection contre les injections SQL (requêtes préparées)
- ✅ Protection XSS (échappement HTML)
- ✅ Authentification JWT
- ✅ Validation des uploads (type et taille)
- ✅ Vérification des permissions (seul le propriétaire peut uploader des images)

## 🛠️ Technologies utilisées

- **Node.js** + **Express** - Serveur web
- **SQLite** (better-sqlite3) - Base de données
- **bcrypt** - Hashage des mots de passe
- **jsonwebtoken** - Authentification JWT
- **multer** - Upload de fichiers
- **dotenv** - Variables d'environnement

## 📝 Fonctionnalités implémentées

### ✅ Base de l'API (/50)

- [x] Gestion des utilisateurs (connexion/déconnexion)
- [x] Sécurité (hashage mots de passe, JWT)
- [x] Créer et lire des articles
- [x] Upload d'images sécurisé
- [x] Récupération des images avec autorisation

### 🎯 Respect des critères d'évaluation

- [x] **Normes RESTful** (15 pts)
  - Méthodes HTTP appropriées (GET, POST)
  - Routes bien structurées
  - Codes de statut HTTP corrects (200, 201, 400, 401, 403, 404, 500)

- [x] **Gestion des données** (20 pts)
  - Base SQLite configurée
  - Requêtes préparées (protection injection SQL)
  - Relations entre tables (foreign keys)
  - Pas d'ORM

- [x] **Sécurité** (15 pts)
  - Protection injection SQL
  - Hashage bcrypt des mots de passe
  - JWT pour les sessions
  - Validation des uploads
  - Protection XSS

## 🐛 Gestion des erreurs

L'API retourne des messages d'erreur clairs:
```json
{
  "error": "Description de l'erreur",
  "details": ["Détail 1", "Détail 2"]
}
```

Codes d'erreur:
- `400` - Mauvaise requête
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## 📂 Base de données

### Structure

**users**
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT)
- created_at (DATETIME)

**articles**
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- prix_depart (REAL)
- user_id (INTEGER FK)
- created_at (DATETIME)

**images**
- id (INTEGER PRIMARY KEY)
- article_id (INTEGER FK)
- filename (TEXT)
- filepath (TEXT)
- uploaded_at (DATETIME)

## 📞 Support

Pour toute question, contacter l'équipe de développement.

---

**Version**: 1.0.0  
**Date**: 2025
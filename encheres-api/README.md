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
  -d '{"title":"Test","description
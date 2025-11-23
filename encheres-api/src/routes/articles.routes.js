const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controller');
const authenticateToken = require('../middlewares/auth');

// GET /api/articles - Récupérer tous les articles
router.get('/', authenticateToken, articlesController.getAllArticles);

// GET /api/articles/my - Récupérer mes articles
router.get('/my', authenticateToken, articlesController.getMyArticles);

// GET /api/articles/:id - Récupérer un article par ID
router.get('/:id', authenticateToken, articlesController.getArticleById);

// POST /api/articles - Créer un article
router.post('/', authenticateToken, articlesController.createArticle);

router.delete('/:id', authenticateToken, articlesController.deleteArticle);

module.exports = router;
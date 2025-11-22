const db = require('../config/database');
const { validateArticle, escapeHtml } = require('../utils/validators');

/**
 * Créer un article
 */
async function createArticle(req, res, next) {
  try {
    const { title, description, prix_depart } = req.body;
    const userId = req.user.id;

    // Validation
    const validation = validateArticle({ title, description, prix_depart });
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: validation.errors 
      });
    }

    // Protection XSS
    const cleanTitle = escapeHtml(title.trim());
    const cleanDescription = escapeHtml(description.trim());

    // Insertion en DB
    const result = await db.runAsync(
      'INSERT INTO articles (title, description, prix_depart, user_id) VALUES (?, ?, ?, ?)',
      [cleanTitle, cleanDescription, prix_depart, userId]
    );

    res.status(201).json({
      message: 'Article créé avec succès',
      article: {
        id: result.lastID,
        title: cleanTitle,
        description: cleanDescription,
        prix_depart: prix_depart,
        user_id: userId
      }
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Récupérer tous les articles
 */
async function getAllArticles(req, res, next) {
  try {
    const articles = await db.allAsync(`
      SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.prix_depart, 
        a.created_at,
        a.user_id,
        u.username as author
      FROM articles a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `);

    res.json({ articles });

  } catch (error) {
    next(error);
  }
}

/**
 * Récupérer un article par ID
 */
async function getArticleById(req, res, next) {
  try {
    const { id } = req.params;

    const article = await db.getAsync(`
      SELECT 
        a.*, 
        u.username as author
      FROM articles a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `, [id]);

    if (!article) {
      return res.status(404).json({ 
        error: 'Article non trouvé' 
      });
    }

    res.json({ article });

  } catch (error) {
    next(error);
  }
}

/**
 * Récupérer les articles de l'utilisateur connecté
 */
async function getMyArticles(req, res, next) {
  try {
    const userId = req.user.id;

    const articles = await db.allAsync(
      'SELECT * FROM articles WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ articles });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  getMyArticles
};
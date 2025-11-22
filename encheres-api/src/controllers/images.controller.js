const db = require('../config/database');
const path = require('path');
const fs = require('fs');

/**
 * Upload une image pour un article
 */
async function uploadImage(req, res, next) {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;

    // Vérifier que le fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Aucune image fournie' 
      });
    }

    // Vérifier que l'article existe et appartient à l'utilisateur
    const article = await db.getAsync('SELECT * FROM articles WHERE id = ?', [articleId]);

    if (!article) {
      // Supprimer le fichier uploadé
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        error: 'Article non trouvé' 
      });
    }

    if (article.user_id !== userId) {
      // Supprimer le fichier uploadé
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ 
        error: 'Vous n\'êtes pas autorisé à ajouter des images à cet article' 
      });
    }

    // Enregistrer l'image en DB
    const result = await db.runAsync(
      'INSERT INTO images (article_id, filename, filepath) VALUES (?, ?, ?)',
      [articleId, req.file.filename, req.file.path]
    );

    res.status(201).json({
      message: 'Image uploadée avec succès',
      image: {
        id: result.lastID,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      }
    });

  } catch (error) {
    // En cas d'erreur, supprimer le fichier uploadé
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
}

/**
 * Récupérer les images d'un article
 */
async function getArticleImages(req, res, next) {
  try {
    const { articleId } = req.params;

    // Vérifier que l'article existe
    const article = await db.getAsync('SELECT * FROM articles WHERE id = ?', [articleId]);

    if (!article) {
      return res.status(404).json({ 
        error: 'Article non trouvé' 
      });
    }

    // Récupérer les images
    const images = await db.allAsync(
      'SELECT id, filename, uploaded_at FROM images WHERE article_id = ? ORDER BY uploaded_at DESC',
      [articleId]
    );

    // Ajouter l'URL complète pour chaque image
    const imagesWithUrl = images.map(img => ({
      ...img,
      url: `/uploads/${img.filename}`
    }));

    res.json({ images: imagesWithUrl });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadImage,
  getArticleImages
};
/**
 * Middleware de gestion globale des erreurs
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Erreur:', err);

  // Erreur SQLite
  if (err.code) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({
        error: 'Violation de contrainte de base de données',
        details: err.message
      });
    }
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({
      error: 'Token JWT invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(403).json({
      error: 'Token JWT expiré'
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
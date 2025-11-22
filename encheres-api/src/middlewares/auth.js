const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token
 */
function authenticateToken(req, res, next) {
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ 
      error: 'Accès refusé. Token manquant.' 
    });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les infos utilisateur à la requête
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Token invalide ou expiré.' 
    });
  }
}

module.exports = authenticateToken;
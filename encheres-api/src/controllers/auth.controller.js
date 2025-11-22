const db = require('../config/database');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');
const { isValidEmail, isValidPassword } = require('../utils/validators');

/**
 * Connexion utilisateur
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email et mot de passe requis' 
      });
    }

    // Récupérer l'utilisateur depuis la DB
    const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ 
        error: 'Email ou mot de passe incorrect' 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Email ou mot de passe incorrect' 
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Déconnexion (côté client, suppression du token)
 */
function logout(req, res) {
  res.json({ 
    message: 'Déconnexion réussie' 
  });
}

/**
 * Récupérer les infos de l'utilisateur connecté
 */
async function getProfile(req, res, next) {
  try {
    const user = await db.getAsync(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  logout,
  getProfile
};
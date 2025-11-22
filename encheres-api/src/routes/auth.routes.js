const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/auth');

// POST /api/auth/login - Connexion
router.post('/login', authController.login);

// POST /api/auth/logout - Déconnexion
router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/profile - Profil utilisateur
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
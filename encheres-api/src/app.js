const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const articlesRoutes = require('./routes/articles.routes');
const imagesRoutes = require('./routes/images.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/images', imagesRoutes);

// Route de test
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API Enchères - Bienvenue !',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      articles: '/api/articles',
      images: '/api/images'
    }
  });
});

// Gestion des erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;
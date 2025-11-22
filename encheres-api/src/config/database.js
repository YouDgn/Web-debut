const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || './database.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion DB:', err);
  } else {
    console.log('✅ Connecté à la base de données SQLite');
  }
});

// Activer les foreign keys
db.run('PRAGMA foreign_keys = ON');

/**
 * Initialiser la base de données
 */
function initDatabase() {
  // Table utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table articles
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      prix_depart REAL NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table images
  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Tables créées');
}

initDatabase();

// Wrapper pour promisifier les requêtes
db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

module.exports = db;
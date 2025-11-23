require('dotenv').config();
const db = require('./src/config/database');
const { hashPassword } = require('./src/utils/hash');

async function initDatabase() {
  console.log('🔄 Initialisation de la base de données...');

  try {
    // Désactiver temporairement les foreign keys
    await db.runAsync('PRAGMA foreign_keys = OFF');

    // Supprimer TOUTES les données
    await db.runAsync('DELETE FROM images');
    await db.runAsync('DELETE FROM articles');
    await db.runAsync('DELETE FROM users');

    // Réinitialiser les compteurs auto-increment
    await db.runAsync('DELETE FROM sqlite_sequence WHERE name="users"');
    await db.runAsync('DELETE FROM sqlite_sequence WHERE name="articles"');
    await db.runAsync('DELETE FROM sqlite_sequence WHERE name="images"');

    // Réactiver les foreign keys
    await db.runAsync('PRAGMA foreign_keys = ON');

    console.log('✅ Tables vidées et compteurs réinitialisés');

    // Créer des utilisateurs fictifs
    const users = [
      { username: 'alice', email: 'alice@test.com', password: 'password123' },
      { username: 'bob', email: 'bob@test.com', password: 'password123' },
      { username: 'charlie', email: 'charlie@test.com', password: 'password123' }
    ];

    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      await db.runAsync(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [user.username, user.email, hashedPassword]
      );
      console.log(`✅ Utilisateur créé: ${user.username} (${user.email})`);
    }

    // Créer des articles fictifs
    const articles = [
      { title: 'iPhone 14 Pro', description: 'Téléphone en excellent état, peu utilisé', prix_depart: 800, user_id: 1 },
      { title: 'MacBook Pro 2023', description: 'Ordinateur portable performant pour développeurs', prix_depart: 2000, user_id: 1 },
      { title: 'Table vintage', description: 'Belle table en bois massif des années 70', prix_depart: 150, user_id: 2 },
      { title: 'Console PS5', description: 'Console neuve encore sous garantie', prix_depart: 450, user_id: 2 },
      { title: 'Vélo de course', description: 'Vélo Specialized Allez Sprint en carbone', prix_depart: 1200, user_id: 3 }
    ];

    for (const article of articles) {
      await db.runAsync(
        'INSERT INTO articles (title, description, prix_depart, user_id) VALUES (?, ?, ?, ?)',
        [article.title, article.description, article.prix_depart, article.user_id]
      );
      console.log(`✅ Article créé: ${article.title}`);
    }

    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('\n📋 Utilisateurs de test:');
    console.log('   - alice@test.com / password123');
    console.log('   - bob@test.com / password123');
    console.log('   - charlie@test.com / password123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initDatabase();
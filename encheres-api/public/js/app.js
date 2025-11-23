// Configuration de l'API
const API_URL = 'http://localhost:3000/api';
let authToken = null;
let currentUser = null;

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

/**
 * Afficher un message de statut
 */
function showStatus(message, type = 'info') {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = type;
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 5000);
}

/**
 * Afficher la réponse de l'API
 */
function showApiResponse(data) {
  document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
}

/**
  * Mettre à jour les statistiques
 */
async function updateStats() {
  if (!authToken) return;
  
  try {
    // Compter les articles
    const articlesResponse = await fetch(`${API_URL}/articles`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const articlesData = await articlesResponse.json();
    
    if (articlesResponse.ok) {
      document.getElementById('statArticles').textContent = articlesData.articles.length;
      
      // Compter les images (total de toutes les images de tous les articles)
      let totalImages = 0;
      for (const article of articlesData.articles) {
        try {
          const imagesResponse = await fetch(`${API_URL}/images/article/${article.id}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          const imagesData = await imagesResponse.json();
          if (imagesResponse.ok) {
            totalImages += imagesData.images.length;
          }
        } catch (error) {
          console.error(`Erreur images article ${article.id}:`, error);
        }
      }
      document.getElementById('statImages').textContent = totalImages;
    }
  } catch (error) {
    console.error('Erreur stats:', error);
  }
}

// ==========================================
// AUTHENTIFICATION
// ==========================================

/**
 * Connexion utilisateur
 */
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    showApiResponse(data);

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;

      document.getElementById('userName').textContent = currentUser.username;
      document.getElementById('userEmail').textContent = currentUser.email;
      document.getElementById('userToken').textContent = authToken;

      document.getElementById('loginForm').classList.add('hidden');
      document.getElementById('userInfo').classList.remove('hidden');
      document.getElementById('articlesSection').classList.remove('hidden');
      document.getElementById('imagesSection').classList.remove('hidden');

      showStatus('✅ Connexion réussie !', 'success');
      getAllArticles();
      updateStats();
    } else {
      showStatus('❌ ' + data.error, 'error');
    }
  } catch (error) {
    showStatus('❌ Erreur connexion: ' + error.message, 'error');
    showApiResponse({ error: error.message });
  }
}

/**
 * Déconnexion utilisateur
 */
function logout() {
  authToken = null;
  currentUser = null;

  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('userInfo').classList.add('hidden');
  document.getElementById('articlesSection').classList.add('hidden');
  document.getElementById('imagesSection').classList.add('hidden');

  document.getElementById('articlesList').innerHTML = '';
  document.getElementById('imagesList').innerHTML = '';

  showStatus('👋 Déconnexion réussie', 'info');
  showApiResponse({ message: 'Déconnecté' });
}

// ==========================================
// GESTION DES ARTICLES
// ==========================================

/**
 * Créer un article (avec image optionnelle)
 */
async function createArticle() {
  const title = document.getElementById('articleTitle').value.trim();
  const description = document.getElementById('articleDescription').value.trim();
  const prix_depart = parseFloat(document.getElementById('articlePrice').value);
  const imageInput = document.getElementById('articleImageCreate');

  if (!title || !description || !prix_depart) {
    showStatus('⚠️ Veuillez remplir tous les champs', 'error');
    return;
  }

  try {
    // 1. Créer l'article
    const response = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ title, description, prix_depart })
    });

    const data = await response.json();
    showApiResponse(data);

    if (response.ok) {
      const articleId = data.article.id;
      
      // 2. Si une image est sélectionnée, l'uploader
      if (imageInput.files && imageInput.files[0]) {
        const formData = new FormData();
        formData.append('image', imageInput.files[0]);

        try {
          const imageResponse = await fetch(`${API_URL}/images/article/${articleId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
            body: formData
          });

          if (imageResponse.ok) {
            showStatus('✅ Article créé avec image !', 'success');
          } else {
            showStatus('✅ Article créé (mais erreur upload image)', 'success');
          }
        } catch (error) {
          showStatus('✅ Article créé (mais erreur upload image)', 'success');
        }
      } else {
        showStatus('✅ Article créé avec succès !', 'success');
      }

      // Vider les champs
      document.getElementById('articleTitle').value = '';
      document.getElementById('articleDescription').value = '';
      document.getElementById('articlePrice').value = '';
      document.getElementById('articleImageCreate').value = '';

      getAllArticles();
      updateStats();
    } else {
      showStatus('❌ ' + data.error, 'error');
    }
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
    showApiResponse({ error: error.message });
  }
}

/**
 * Récupérer tous les articles
 */
async function getAllArticles() {
  try {
    const response = await fetch(`${API_URL}/articles`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    showApiResponse(data);

    if (response.ok) {
      displayArticles(data.articles);
      showStatus(`📦 ${data.articles.length} article(s) trouvé(s)`, 'success');
    } else {
      showStatus('❌ ' + data.error, 'error');
    }
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
    showApiResponse({ error: error.message });
  }
}

/**
 * Récupérer mes articles
 */
async function getMyArticles() {
  try {
    const response = await fetch(`${API_URL}/articles/my`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    showApiResponse(data);

    if (response.ok) {
      displayArticles(data.articles);
      showStatus(`📦 ${data.articles.length} de vos article(s)`, 'success');
    } else {
      showStatus('❌ ' + data.error, 'error');
    }
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
    showApiResponse({ error: error.message });
  }
}

/**
 * Afficher les articles
 */
function displayArticles(articles) {
  const container = document.getElementById('articlesList');

  if (articles.length === 0) {
    container.innerHTML = '<p style="color: #999;">Aucun article trouvé</p>';
    return;
  }

  container.innerHTML = articles.map(article => `
    <div class="article-item">
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <p class="price">Prix de départ : ${article.prix_depart} €</p>
      <p style="font-size: 0.9em; color: #999;">
        Auteur : ${article.author || 'Inconnu'} | 
        ID : ${article.id} |
        Créé le : ${new Date(article.created_at).toLocaleDateString('fr-FR')}
      </p>
      ${article.user_id === currentUser.id ? `
        <div class="article-actions">
          <button class="btn-danger" onclick="deleteArticle(${article.id})">Supprimer</button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

/**
 * Supprimer un article
 */
async function deleteArticle(articleId) {
  if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;

  try {
    const response = await fetch(`${API_URL}/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    showApiResponse(data);

    if (response.ok) {
      showStatus('✅ Article supprimé', 'success');
      getAllArticles();
      updateStats();
    } else {
      showStatus('❌ ' + data.error, 'error');
    }
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
  }
}

// ==========================================
// GESTION DES IMAGES
// ==========================================

/**
 * Uploader une image
 */
async function uploadImage() {
  const articleId = document.getElementById('imageArticleId').value;
  const fileInput = document.getElementById('imageFile');

  if (!articleId || !fileInput.files[0]) {
    showStatus('⚠️ Veuillez sélectionner un article et une image', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);

  try {
    const response = await fetch(`${API_URL}/images/article/${articleId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    const data = await response.json();
    showApiResponse(data);

    if (response.ok) {
      showStatus('✅ Image uploadée avec succès !', 'success');
      fileInput.value = '';
    } else {
      showStatus('❌ ' + data.error, 'error');
    }
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
    showApiResponse({ error: error.message });
  }
}

/**
 * Récupérer les images d'un article
 */
async function getArticleImages() {
  const articleId = document.getElementById('viewImageArticleId').value;

  if (!articleId) {
    showStatus('⚠️ Veuillez entrer un ID d\'article', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/images/article/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    showApiResponse(data);

    if (response.ok) {
      displayImages(data.images);
      showStatus(`🖼️ ${data.images.length} image(s) trouvée(s)`, 'success');
    } else {
      showStatus('❌ ' + data.error, 'error');
    }
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
    showApiResponse({ error: error.message });
  }
}

/**
 * Afficher les images
 */
function displayImages(images) {
  const container = document.getElementById('imagesList');

  if (images.length === 0) {
    container.innerHTML = '<p style="color: #999;">Aucune image trouvée</p>';
    return;
  }

  container.innerHTML = images.map(image => `
    <div class="article-item">
      <img src="${image.url}" alt="${image.filename}" style="max-width: 300px; border-radius: 8px; margin-bottom: 10px;">
      <p><strong>Fichier :</strong> ${image.filename}</p>
      <p><strong>ID :</strong> ${image.id}</p>
      <p><strong>Uploadé le :</strong> ${new Date(image.uploaded_at).toLocaleDateString('fr-FR')}</p>
    </div>
  `).join('');
}

// ==========================================
// SÉCURITÉ - HASHAGE DES MOTS DE PASSE
// ==========================================

/**
 * Afficher les mots de passe hashés des utilisateurs
 */
async function showPasswordHashes() {
  try {
    // Récupérer les infos depuis le serveur (les users sont créés dans init-db.js)
    const users = [
      { id: 1, username: 'alice', email: 'alice@test.com', password_original: 'password123' },
      { id: 2, username: 'bob', email: 'bob@test.com', password_original: 'password123' },
      { id: 3, username: 'charlie', email: 'charlie@test.com', password_original: 'password123' }
    ];

    const hashInfo = {
      "ℹ️ Information": "Les mots de passe sont hashés côté serveur avec bcrypt",
      "Algorithme": "bcrypt",
      "Salt rounds": 10,
      "Note": "Les hash ci-dessous sont des exemples. En production, les hash sont différents à chaque fois grâce au salt aléatoire.",
      "Utilisateurs": users.map(u => ({
        username: u.username,
        email: u.email,
        mot_de_passe_original: u.password_original,
        mot_de_passe_hashe: "Stocké en base de données (inaccessible depuis le client)",
        explication: "Le hash bcrypt ressemble à : $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
      }))
    };

    const display = document.getElementById('hashDisplay');
    display.style.display = 'block';
    display.textContent = JSON.stringify(hashInfo, null, 2);
    
    showStatus('🔐 Informations sur le hashage affichées', 'success');
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
  }
}

/**
 * Tester le hashage d'un mot de passe
 */
async function testPasswordHash() {
  const password = prompt('Entrez un mot de passe à hasher (exemple: password123)');
  
  if (!password) {
    showStatus('⚠️ Aucun mot de passe saisi', 'error');
    return;
  }

  try {
    // Simuler un hash bcrypt (en réalité, c'est fait côté serveur)
    // Exemple de hash bcrypt réel (pour démonstration)
    const exampleHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    
    const hashDemo = {
      "Mot de passe saisi": password,
      "Longueur": password.length + " caractères",
      "Algorithme utilisé": "bcrypt",
      "Salt rounds": 10,
      "Exemple de hash": exampleHash,
      "Explication": {
        "$2b$": "Identifiant de l'algorithme bcrypt",
        "10$": "Nombre de rounds (coût computationnel)",
        "Suite": "Salt aléatoire + Hash du mot de passe",
        "Caractéristiques": [
          "Chaque hash est unique grâce au salt aléatoire",
          "Impossible de retrouver le mot de passe original",
          "La vérification se fait avec bcrypt.compare()",
          "Résistant aux attaques par force brute"
        ]
      },
      "Note importante": "Le hashage réel est effectué côté serveur dans src/utils/hash.js avec la vraie librairie bcrypt"
    };

    const display = document.getElementById('hashDisplay');
    display.style.display = 'block';
    display.textContent = JSON.stringify(hashDemo, null, 2);
    
    showStatus('🔐 Démonstration du hashage affichée', 'success');
  } catch (error) {
    showStatus('❌ Erreur : ' + error.message, 'error');
  }
}

// ==========================================
// INITIALISATION
// ==========================================

console.log('✅ Application chargée - API : ' + API_URL);

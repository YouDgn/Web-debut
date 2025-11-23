/**
 * Valide un email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un mot de passe (min 6 caractères)
 */
function isValidPassword(password) {
  return password && password.length >= 6;
}

/**
 * Échappe les caractères HTML pour prévenir XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Valide les données d'un article
 */
function validateArticle(data) {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }

  if (!data.prix_depart || isNaN(data.prix_depart) || data.prix_depart <= 0) {
    errors.push('Le prix de départ doit être un nombre positif');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidEmail,
  isValidPassword,
  escapeHtml,
  validateArticle
};
// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root', // ou autre nom d'utilisateur
  password: '', // ton mot de passe
  database: 'fasocode'
});

db.connect((err) => {
  if (err) throw err;
  console.log('🟢 Connecté à la base de données MySQL');
});

module.exports = db;

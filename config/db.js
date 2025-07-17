// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '173.212.213.214',
  port: 3306,
  user: 'root', // ou autre nom d'utilisateur
  password: '21hIbb04OJwXl8BlljvUjjVZHVpsc6U0149Vocw5SuBpmEk3q5zymw5yjN9CdAVM', // ton mot de passe
  database: 'fasocode'
});

db.connect((err) => {
  if (err) throw err;
  console.log('🟢 Connecté à la base de données MySQL');
});

module.exports = db;

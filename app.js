const bcrypt = require('bcrypt');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Config EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connexion à la BD
const db = mysql.createConnection({
  host: "173.212.213.214",
  user: "root",
  password: "21hIbb04OJwXl8BlljvUjjVZHVpsc6U0149Vocw5SuBpmEk3q5zymw5yjN9CdAVM",
  database: "fasocode-X",
  port: 3306,
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connecté à la base de données MySQL.");
});

// Routes générales

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/login', (req, res) => {
  const message = req.query.message;
  res.render('login', { message });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Erreur serveur');
    }
    if (results.length === 0) return res.send('Aucun utilisateur trouvé avec cet email.');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send('Mot de passe incorrect.');

    res.redirect('/dashboard');
  });
});

// Inscription utilisateur

app.get('/register', (req, res) => {
  res.render('register'); // views/register.ejs
});

app.post('/register', async (req, res) => {
  const { nom, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
      if (err) return res.status(500).send("Erreur serveur.");
      if (results.length > 0) return res.send("Cet email est déjà utilisé.");

      const sql = 'INSERT INTO users (nom, email, password) VALUES (?, ?, ?)';
      db.query(sql, [nom, email, hashedPassword], (err, result) => {
        if (err) {
          console.error(err);
          return res.send("Erreur lors de l'inscription.");
        }
        res.redirect('/login?message=success');
      });
    });
  } catch (error) {
    console.error(error);
    res.send('Erreur serveur');
  }
});


// ====== ROUTES FORMATIONS ====== //

// Modules courts
app.get('/formations/modules-courts', (req, res) => {
  res.render('moduleCourt'); // views/moduleCourt.ejs
});

app.post('/formations/modules-courts/submit', (req, res) => {
  const { nom, email, telephone, module, niveau, disponibilite, commentaire } = req.body;
  const sql = `INSERT INTO inscriptions 
    (nom, email, telephone, type_formation, module, niveau, disponibilite, commentaire) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nom, email, telephone, 'modules-courts', module, niveau, disponibilite, commentaire], (err, result) => {
    if (err) {
      console.error(err);
      return res.send('Erreur lors de l\'inscription aux Modules Courts.');
    }
    res.send('✅ Inscription réussie pour les Modules Courts !');
  });
});

// Parcours Professionnel
app.get('/formations/parcours-pro', (req, res) => {
  res.render('parcoursPro'); // views/parcoursPro.ejs
});

app.post('/formations/parcours-pro/submit', (req, res) => {
  const { nom, email, telephone, parcours, niveau, experience, commentaire } = req.body;
  const sql = `INSERT INTO inscriptions 
    (nom, email, telephone, type_formation, parcours, niveau, experience, commentaire) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nom, email, telephone, 'parcours-pro', parcours, niveau, experience, commentaire], (err, result) => {
    if (err) {
      console.error(err);
      return res.send('Erreur lors de l\'inscription au Parcours Professionnel.');
    }
    res.send('✅ Inscription réussie pour le Parcours Professionnel !');
  });
});

// Préparation à l'emploi
app.get('/formations/prepar-emploi', (req, res) => {
  res.render('preparEmploi'); // views/preparEmploi.ejs
});

app.post('/formations/prepar-emploi/submit', (req, res) => {
  const { nom, email, telephone, objectif, disponibilite, commentaire } = req.body;
  const sql = `INSERT INTO inscriptions 
    (nom, email, telephone, type_formation, objectif, disponibilite, commentaire) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nom, email, telephone, 'prepar-emploi', objectif, disponibilite, commentaire], (err, result) => {
    if (err) {
      console.error(err);
      return res.send('Erreur lors de l\'inscription à la Préparation à l\'Emploi.');
    }
    res.send('✅ Inscription réussie pour la Préparation à l\'Emploi !');
  });
});

// =================================================== //

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});

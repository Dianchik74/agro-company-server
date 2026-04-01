const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//Підключення до БД 
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.log('DB error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});


// ================= GET =================
app.get('/works', (req, res) => {
  db.query('SELECT * FROM works', (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('DB error');
    }
    res.json(results);
  });
});


// ================= POST =================
app.post('/works', (req, res) => {
  const { work_type, work_date } = req.body;

  db.query(
    'INSERT INTO works (work_type, work_date) VALUES (?, ?)',
    [work_type, work_date],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Work added', id: result.insertId });
    }
  );
});


// ================= PUT =================
app.put('/works/:id', (req, res) => {
  const { work_type } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE works SET work_type=? WHERE work_id=?',
    [work_type, id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('DB error');
      }
      res.json({ message: 'Updated' });
    }
  );
});


// ================= DELETE =================
app.delete('/works/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'DELETE FROM works WHERE work_id=?',
    [id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('DB error');
      }
      res.json({ message: 'Deleted' });
    }
  );
});


// запуск сервера
app.get('/', (req, res) => {
  res.send('Server is working');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// test PR
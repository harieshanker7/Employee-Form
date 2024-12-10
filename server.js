const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '1230', // replace with your MySQL password
  database: 'employee_portal', // replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Sign-Up endpoint
app.post('/signup', (req, res) => {
  const { employee_id, username, email, password } = req.body;

  const sql = 'INSERT INTO employees (employee_id, username, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [employee_id, username, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).send('Error saving data to the database');
    } else {
      res.status(200).send('Sign-Up successful!');
    }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM employees WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err.message);
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

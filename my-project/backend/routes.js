const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).send('User not found');

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

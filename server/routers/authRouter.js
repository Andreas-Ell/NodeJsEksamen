import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';

const router = Router();
const SECRET = process.env.JWT_SECRET; 

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Could not create user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [[user]] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user)
      return res.status(401).json({ error: 'Wrong email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Wrong email or password' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login succesfuld',
      token,
      userId: user.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Network error by login' });
  }
});

export default router;

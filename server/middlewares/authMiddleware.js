import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Missing Token' });

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expires Token' });
  }
}
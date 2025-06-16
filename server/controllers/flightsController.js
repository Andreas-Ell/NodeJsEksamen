import db from '../database/db.js';

export async function getAllFlights(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM flights');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

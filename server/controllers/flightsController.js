import db from '../database/db.js';

export async function getAllFlights(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT f.*, 
        (f.seats - COUNT(b.id)) AS available_seats
      FROM flights f
      LEFT JOIN bookings b ON f.id = b.flight_id
      GROUP BY f.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Fejl ved hentning af fly:', err);
    res.status(500).json({ error: 'Serverfejl' });
  }
}
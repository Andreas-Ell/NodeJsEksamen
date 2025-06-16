import db from '../database/db.js';

export async function createBooking(req, res) {
  const flightId = req.params.flightId;
  const userId = 1; // Midlertidig dummy-bruger

  try {
    // Tjek om flyet eksisterer og har ledige pladser
    const [[flight]] = await db.query('SELECT * FROM flights WHERE id = ?', [flightId]);

    if (!flight) {
      return res.status(404).json({ error: 'Fly ikke fundet' });
    }

    const [[count]] = await db.query('SELECT COUNT(*) AS total FROM bookings WHERE flight_id = ?', [flightId]);

    if (count.total >= flight.seats) {
      return res.status(400).json({ error: 'Flyet er fuldt booket' });
    }

    // Lav booking
    await db.query('INSERT INTO bookings (user_id, flight_id) VALUES (?, ?)', [userId, flightId]);

    res.status(201).json({ message: 'Booking oprettet' });
  } catch (err) {
    console.error('Fejl ved booking:', err);
    res.status(500).json({ error: 'Serverfejl' });
  }
}
import db from '../database/db.js';
import { io } from '../socket.js';

export async function createBooking(req, res) {
  const flightId = req.params.flightId;
  const userId = req.userId; 

  try {
    const [[flight]] = await db.query('SELECT * FROM flights WHERE id = ?', [flightId]);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    const [[count]] = await db.query('SELECT COUNT(*) AS total FROM bookings WHERE flight_id = ?', [flightId]);
    if (count.total >= flight.seats) return res.status(400).json({ error: 'The flight is fully booked' });

    await db.query('INSERT INTO bookings (user_id, flight_id) VALUES (?, ?)', [userId, flightId]);

    io.emit('bookingUpdate');
    res.status(201).json({ message: 'Booking created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getMyBookings(req, res) {
  const userId = req.userId;

  try {
    const [rows] = await db.query(`
      SELECT b.id AS bookingId, f.destination, f.departure_time, f.description
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      WHERE b.user_id = ?
      ORDER BY f.departure_time ASC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Unable to retrieve bookings' });
  }
}


export async function deleteBooking(req, res) {
  const bookingId = req.params.bookingId;
  const userId = req.userId;

  try {
    const [result] = await db.query('DELETE FROM bookings WHERE id = ? AND user_id = ?', [bookingId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found or not your booking'});
    }

    io.emit('bookingUpdate'); 
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Network error by deleting' });
  }
}

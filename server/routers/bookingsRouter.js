import { Router } from 'express';
import { createBooking, getMyBookings, deleteBooking } from '../controllers/bookingsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = Router();

router.post('/:flightId', verifyToken, createBooking);
router.get('/mine', verifyToken, getMyBookings);
router.delete('/:bookingId', verifyToken, deleteBooking);

export default router;

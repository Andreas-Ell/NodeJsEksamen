import { Router } from 'express';
import { getAllFlights } from '../controllers/flightsController.js';

const router = Router();

router.get('/', getAllFlights);

export default router;

import express from 'express';
import { getAllFlights } from '../controllers/flightsController.js';

const router = express.Router();

router.get('/', getAllFlights);

export default router;
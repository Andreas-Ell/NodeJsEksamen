import express from 'express';
import cors from 'cors';
import http from 'http';
import flightsRouter from './routers/flightsRouter.js'; 
import bookingsRouter from './routers/bookingsRouter.js';
import { initSocket } from './socket.js'; 
import authRouter from './routers/authRouter.js';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());


app.use('/api/flights', flightsRouter); 
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);


const httpServer = http.createServer(app);
const io = initSocket(httpServer);
export { io };


httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


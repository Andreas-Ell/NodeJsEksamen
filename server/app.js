import express from 'express';
import cors from 'cors';
import http from 'http';
import flightsRouter from './routers/flightsRouter.js'; 
import bookingsRouter from './routers/bookingsRouter.js';
import { initSocket } from './socket.js'; 

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hej med dig');
});

app.use('/api/flights', flightsRouter); 
app.use('/api/bookings', bookingsRouter);


const httpServer = http.createServer(app);


const io = initSocket(httpServer);


export { io };


httpServer.listen(PORT, () => {
  console.log(`Server kører på http://localhost:${PORT}`);
});
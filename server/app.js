import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import flightsRouter from './routers/flightsRouter.js'; 

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hej med dig');
});

app.use('/api/flights', flightsRouter); 

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Socket forbundet:', socket.id);
});

httpServer.listen(PORT, () => {
  console.log(`Server kører på http://localhost:${PORT}`);
});


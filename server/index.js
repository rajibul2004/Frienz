import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import authRoutes from './routes/authRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const corsOptions = {
  origin: [CLIENT_URL],
  credentials: true,
  optionsSuccessStatus: 200
};

const app = express();
connectDB();
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
  });
});


app.listen(PORT, () => {
    console.log(`App is listening at http://${HOST}:${PORT}/`);
    console.log(`📡 Environment: ${NODE_ENV}`);
});


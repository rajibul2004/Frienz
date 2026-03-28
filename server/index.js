import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(express.json({ limit: '10mb' }));

app.listen(PORT, () => {
    console.log(`App is listening at http://${HOST}:${PORT}/`);
    console.log(`📡 Environment: ${NODE_ENV}`);
});


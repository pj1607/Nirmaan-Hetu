import express, { Router } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/conn.js';
import User from './routes/userRoutes.js';

import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  "https://nirmaan-hetu.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use('/auth', User);


app.get('/', (req, res) => {
    res.send("MongoDB connection is working!");
});

const PORT =  process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

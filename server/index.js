import express from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import { connectdb } from './db/db.js';

const PORT = process.env.PORT || 8082;

import booksRouter from './routes/api/books.js';
import authRouter from './routes/api/auth.js'; 
const app = express();
app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.listen(PORT, () => {
  connectdb();
  console.log(`Server running on port ${PORT}`);
});

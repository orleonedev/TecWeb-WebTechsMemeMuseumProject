import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import memeRoutes from './routes/meme.routes';

const app: Application = express();

app.use(express.json());

app.use(cors());

app.use('/public', express.static('public'));

app.use('/auth', authRoutes);
app.use('/api/memes', memeRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the MemeMuseum API!' });
});

export default app;

import express, { Application, Request, Response } from 'express';
import cors from 'cors';

// Basic Express app setup
const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// A simple root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the MemeMuseum API!' });
});

export default app;

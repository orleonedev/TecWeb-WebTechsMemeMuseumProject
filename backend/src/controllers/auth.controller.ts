import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email, password, and username are required.' });
  }

  try {
    const newUser = await AuthService.register(email, password, username);
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const { user, token } = await AuthService.login(email, password);
    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await AuthService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const id = parseInt(userId, 10);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'User ID must be a number.' });
  }

  try {
    await AuthService.deleteAccount(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to delete not found - Prisma error code
      return res.status(404).json({ message: 'User not found.' });
    }
    next(error);
  }
};

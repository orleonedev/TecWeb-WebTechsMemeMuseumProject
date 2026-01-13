import { Response, NextFunction } from 'express';
import * as voteService from '../services/vote.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const castVote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const memeId = parseInt(req.params.id, 10);
    const { value } = req.body; // 1 or -1
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (value !== 1 && value !== -1 && value !== 0) {
      return res.status(400).json({ message: 'Invalid vote value' });
    }

    const vote = await voteService.vote(userId, memeId, value);
    res.json(vote);
  } catch (error) {
    next(error);
  }
};

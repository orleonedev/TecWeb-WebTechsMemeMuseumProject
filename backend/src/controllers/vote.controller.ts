import { Response, Request } from 'express';
import * as voteService from '../services/vote.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../lib/asyncHandler';

export const castVote = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const memeId = parseInt(authReq.params.id, 10);
  const { value } = authReq.body; // 1 or -1
  const userId = authReq.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (value !== 1 && value !== -1 && value !== 0) {
    return res.status(400).json({ message: 'Invalid vote value' });
  }

  const vote = await voteService.vote(userId, memeId, value);
  res.json(vote);
});

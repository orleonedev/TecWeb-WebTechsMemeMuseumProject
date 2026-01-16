import { Response, Request } from 'express';
import * as commentService from '../services/comment.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../lib/asyncHandler';

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const memeId = parseInt(authReq.params.id, 10);
  const { text } = authReq.body;
  const userId = authReq.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  const comment = await commentService.createComment(userId, memeId, text);
  res.status(201).json(comment);
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const commentId = parseInt(authReq.params.commentId, 10);
  const userId = authReq.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  await commentService.deleteComment(commentId, userId);
  res.status(204).send();
});

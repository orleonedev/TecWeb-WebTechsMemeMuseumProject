import { Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const addComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const memeId = parseInt(req.params.id, 10);
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await commentService.createComment(userId, memeId, text);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    await commentService.deleteComment(commentId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

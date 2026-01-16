import { Response, NextFunction, Request } from 'express';
import * as memeService from '../services/meme.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { SortBy, SortOrder } from '../shared/constants';
import { asyncHandler } from '../lib/asyncHandler';
import { parseTags } from '../lib/utils';

export const createMeme = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { title, description, tags } = authReq.body;
  const userId = authReq.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!authReq.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const parsedTags = parseTags(tags);

  const imageUrl = `/uploads/${authReq.file.filename}`;
  const meme = await memeService.createMeme(title, imageUrl, userId, parsedTags, description);
  res.status(201).json(meme);
});

export const getAllMemes = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, tag, search, sortBy, order, userId } = req.query;
  
  const options = {
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
    tag: tag as string,
    search: search as string,
    sortBy: sortBy as SortBy,
    order: order as SortOrder,
    userId: userId ? parseInt(userId as string, 10) : undefined,
  };

  const result = await memeService.findAllMemes(options);
  res.json(result);
});

export const getMemeById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const meme = await memeService.findMemeById(id);
  if (meme) {
    res.json(meme);
  } else {
    res.status(404).json({ message: 'Meme not found' });
  }
});

export const getMemeOfTheDay = asyncHandler(async (req: Request, res: Response) => {
  const meme = await memeService.getMemeOfTheDay();
  if (meme) {
    res.json(meme);
  } else {
    res.status(404).json({ message: 'No memes found' });
  }
});

export const deleteMeme = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const id = parseInt(authReq.params.id, 10);
  const userId = authReq.user?.id;

  const meme = await memeService.findMemeById(id);
  if (!meme) {
    return res.status(404).json({ message: 'Meme not found' });
  }

  if (meme.userId !== userId) {
    return res.status(403).json({ message: 'Forbidden: You can only delete your own memes' });
  }

  await memeService.deleteMeme(id);
  res.status(204).send();
});


import { Response, NextFunction, Request } from 'express';
import * as memeService from '../services/meme.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { parse } from 'path';
import { SortBy, SortOrder } from '../shared/constants';

export const createMeme = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let parsedTags: string[] = [];
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const meme = await memeService.createMeme(title, imageUrl, userId, parsedTags, description);
    res.status(201).json(meme);
  } catch (error) {
    next(error);
  }
};

export const getAllMemes = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getMemeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const meme = await memeService.findMemeById(id);
    if (meme) {
      res.json(meme);
    } else {
      res.status(404).json({ message: 'Meme not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getMemeOfTheDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meme = await memeService.getMemeOfTheDay();
    if (meme) {
      res.json(meme);
    } else {
      res.status(404).json({ message: 'No memes found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteMeme = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    const meme = await memeService.findMemeById(id);
    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    if (meme.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own memes' });
    }

    await memeService.deleteMeme(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


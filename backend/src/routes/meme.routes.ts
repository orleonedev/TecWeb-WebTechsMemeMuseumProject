import { Router } from 'express';
import * as memeController from '../controllers/meme.controller';
import * as voteController from '../controllers/vote.controller';
import * as commentController from '../controllers/comment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { upload } from '../lib/multer';

const router = Router();

router.get('/', memeController.getAllMemes);
router.get('/day', memeController.getMemeOfTheDay);
router.get('/:id', memeController.getMemeById);
router.post('/', authenticateToken, upload.single('image'), memeController.createMeme);
router.delete('/:id', authenticateToken, memeController.deleteMeme);

router.post('/:id/vote', authenticateToken, voteController.castVote);

router.post('/:id/comments', authenticateToken, commentController.addComment);
router.delete('/comments/:commentId', authenticateToken, commentController.deleteComment);

export default router;

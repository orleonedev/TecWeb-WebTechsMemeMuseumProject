import { Router } from 'express';
import { register, login, deleteAccount, getMe } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.delete('/:userId', deleteAccount);

export default router;

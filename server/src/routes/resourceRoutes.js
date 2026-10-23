import { Router } from 'express';
import {
  getResources,
  toggleBookmark,
  getUserBookmarks
} from '../controllers/resourceController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthenticate, getResources);
router.get('/bookmarks', authenticate, getUserBookmarks);
router.post('/bookmark', authenticate, toggleBookmark);

export default router;

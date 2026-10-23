import { Router } from 'express';
import {
  chatWithAssistant,
  getAssistantHistory,
  clearAssistantHistory
} from '../controllers/assistantController.js';
import { authenticate } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/history', authenticate, getAssistantHistory);
router.delete('/history', authenticate, clearAssistantHistory);
router.post('/chat', authenticate, rateLimiter({ windowMs: 60000, maxRequests: 20 }), chatWithAssistant);

export default router;

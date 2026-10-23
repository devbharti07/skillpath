import { Router } from 'express';
import { getOnboarding, saveOnboarding } from '../controllers/onboardingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getOnboarding);
router.post('/', authenticate, saveOnboarding);

export default router;

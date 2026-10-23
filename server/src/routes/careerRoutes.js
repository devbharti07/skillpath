import { Router } from 'express';
import {
  getCareers,
  getCareerBySlug,
  compareCareers
} from '../controllers/careerController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthenticate, getCareers);
router.post('/compare', compareCareers);
router.get('/:slug', optionalAuthenticate, getCareerBySlug);

export default router;

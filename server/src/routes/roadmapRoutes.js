import { Router } from 'express';
import {
  getRoadmaps,
  getRoadmapBySlug,
  enrollRoadmap,
  updateRoadmapItemProgress,
  updateRoadmapSettings,
  getUserRoadmaps
} from '../controllers/roadmapController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthenticate, getRoadmaps);
router.get('/my-roadmaps', authenticate, getUserRoadmaps);
router.post('/enroll', authenticate, enrollRoadmap);
router.post('/progress', authenticate, updateRoadmapItemProgress);
router.put('/settings/:id', authenticate, updateRoadmapSettings);
router.get('/:slug', optionalAuthenticate, getRoadmapBySlug);

export default router;

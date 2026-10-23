import { Router } from 'express';
import {
  getAssessments,
  getAssessmentBySlug,
  submitAssessment,
  getAttemptsHistory,
  getAttemptById
} from '../controllers/assessmentController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthenticate, getAssessments);
router.get('/history', authenticate, getAttemptsHistory);
router.get('/attempt/:id', authenticate, getAttemptById);
router.get('/:slug', optionalAuthenticate, getAssessmentBySlug);
router.post('/submit', authenticate, submitAssessment);

export default router;

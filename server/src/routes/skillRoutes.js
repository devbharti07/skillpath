import { Router } from 'express';
import {
  getSkills,
  getUserSkills,
  addOrUpdateUserSkill,
  deleteUserSkill
} from '../controllers/skillController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public skill catalog
router.get('/', getSkills);

// Protected user skill endorsements
router.get('/my-skills', authenticate, getUserSkills);
router.post('/my-skills', authenticate, addOrUpdateUserSkill);
router.delete('/my-skills/:skillId', authenticate, deleteUserSkill);

export default router;

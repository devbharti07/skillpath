import { Router } from 'express';
import {
  getProjectTemplates,
  getUserProjects,
  createUserProject,
  updateUserProject,
  deleteUserProject,
  getPublicPortfolio
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const optionalAuth = (req, res, next) => {
  authenticate(req, res, () => next()).catch(() => next());
};

const router = Router();

router.get('/templates', getProjectTemplates);
router.get('/portfolio/:userId', optionalAuth, getPublicPortfolio);
router.get('/my-projects', authenticate, getUserProjects);
router.post('/', authenticate, createUserProject);
router.put('/:id', authenticate, updateUserProject);
router.delete('/:id', authenticate, deleteUserProject);

export default router;

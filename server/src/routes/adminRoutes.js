import { Router } from 'express';
import {
  getAdminOverview,
  getAdminUsers,
  createAdminCareer,
  updateAdminCareer,
  deleteAdminCareer,
  createAdminSkill,
  createAdminResource
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = Router();

// Protect ALL admin routes with server-side authentication AND ADMIN role check!
router.use(authenticate, requireAdmin);

router.get('/overview', getAdminOverview);
router.get('/users', getAdminUsers);

// Careers
router.post('/careers', createAdminCareer);
router.put('/careers/:id', updateAdminCareer);
router.delete('/careers/:id', deleteAdminCareer);

// Skills
router.post('/skills', createAdminSkill);

// Learning Resources
router.post('/resources', createAdminResource);

export default router;

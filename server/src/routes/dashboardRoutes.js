import { Router } from 'express';
import { getStudentDashboardOverview } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/overview', authenticate, getStudentDashboardOverview);

export default router;

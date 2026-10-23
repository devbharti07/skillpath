import { Router } from 'express';
import authRoutes from './authRoutes.js';
import onboardingRoutes from './onboardingRoutes.js';
import skillRoutes from './skillRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import careerRoutes from './careerRoutes.js';
import roadmapRoutes from './roadmapRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import projectRoutes from './projectRoutes.js';
import goalTaskRoutes from './goalTaskRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import assistantRoutes from './assistantRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SkillPath REST API',
    version: '1.0.0'
  });
});

router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/skills', skillRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/careers', careerRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/resources', resourceRoutes);
router.use('/projects', projectRoutes);
router.use('/', goalTaskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/assistant', assistantRoutes);
router.use('/admin', adminRoutes);

export default router;

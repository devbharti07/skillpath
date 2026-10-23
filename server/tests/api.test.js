import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';

describe('SkillPath REST API Automated Tests', () => {
  let studentToken = '';
  let adminToken = '';
  let testStudentId = '';
  const testEmail = `test_${Date.now()}@example.com`;

  beforeAll(async () => {
    // Ensure admin user exists for tests
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@skillpath.dev', password: 'AdminPass123!' });

    if (adminRes.status === 200) {
      adminToken = adminRes.body.token;
    }
  });

  afterAll(async () => {
    // Clean up created test user
    if (testStudentId) {
      await prisma.user.deleteMany({ where: { id: testStudentId } });
    }
    await prisma.$disconnect();
  });

  // 1. Health check
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('SkillPath');
  });

  // 2. Authentication Tests
  describe('Authentication Flows', () => {
    it('rejects registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('rejects registration with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Short Pass User',
          email: 'shortpass@test.com',
          password: '123'
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('8 characters');
    });

    it('successfully registers a new student account', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test Student',
          email: testEmail,
          password: 'Password123!',
          educationLevel: 'Undergraduate',
          primaryCareerInterest: 'Frontend Developer'
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.role).toBe('STUDENT');

      studentToken = res.body.token;
      testStudentId = res.body.user.id;
    });

    it('rejects registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Duplicate Student',
          email: testEmail,
          password: 'Password123!'
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already exists');
    });

    it('logs in successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
    });

    it('rejects login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword999!'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid email or password');
    });

    it('denies access to protected /api/auth/me without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('grants access to /api/auth/me with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testEmail);
    });

    it('blocks student role from accessing admin route /api/admin/overview', async () => {
      const res = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Administrative privileges are required');
    });

    it('allows admin role to access /api/admin/overview', async () => {
      const res = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.totalUsers).toBeGreaterThanOrEqual(1);
    });
  });

  // 3. Onboarding Flow Tests
  describe('Onboarding Flow', () => {
    it('saves onboarding choices and returns career discovery summary', async () => {
      const res = await request(app)
        .post('/api/onboarding')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          educationLevel: 'Computer Science Sophomore',
          technicalSkills: ['JavaScript', 'HTML & CSS'],
          topicsEnjoyed: ['Web Development', 'UI/UX Design'],
          preferredCareers: ['Frontend Developer'],
          proficiencyLevel: 'BEGINNER',
          weeklyAvailabilityHours: 12,
          shortTermGoals: 'Build my first interactive web portfolio',
          longTermGoals: 'Become a software engineer'
        });

      expect(res.status).toBe(200);
      expect(res.body.profile.onboardingCompleted).toBe(true);
      expect(res.body.discoverySummary).toBeDefined();
      expect(res.body.discoverySummary.topCareerSuggestions.length).toBeGreaterThan(0);
      expect(res.body.discoverySummary.untestedSkillsNotice).toBeDefined();
    });
  });

  // 4. Careers & Comparison Tests
  describe('Career Discovery & Comparison', () => {
    it('GET /api/careers returns published careers with parsed skills', async () => {
      const res = await request(app).get('/api/careers');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body[0].technicalSkills)).toBe(true);
    });

    it('POST /api/careers/compare compares two careers side-by-side', async () => {
      const careersRes = await request(app).get('/api/careers');
      const slugs = [careersRes.body[0].slug, careersRes.body[1].slug];

      const res = await request(app)
        .post('/api/careers/compare')
        .send({ ids: slugs });

      expect(res.status).toBe(200);
      expect(res.body.careers.length).toBe(2);
      expect(res.body.comparisonInsights).toBeDefined();
    });
  });

  // 5. Skill Assessment Engine Tests
  describe('Assessment Engine & Security', () => {
    let assessmentSlug = '';
    let questionId = '';
    let chosenOptionId = '';

    it('GET /api/assessments returns available assessments', async () => {
      const res = await request(app).get('/api/assessments');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      assessmentSlug = res.body[0].slug;
    });

    it('GET /api/assessments/:slug DOES NOT leak isCorrect boolean in options', async () => {
      const res = await request(app).get(`/api/assessments/${assessmentSlug}`);
      expect(res.status).toBe(200);
      expect(res.body.questions.length).toBeGreaterThan(0);

      const firstQ = res.body.questions[0];
      questionId = firstQ.id;
      chosenOptionId = firstQ.options[0].id;

      // Critical security check: isCorrect must NOT be present in options payload
      expect(firstQ.options[0].isCorrect).toBeUndefined();
    });

    it('POST /api/assessments/submit calculates score on server and records attempt', async () => {
      const assessmentRes = await request(app).get(`/api/assessments/${assessmentSlug}`);
      const assessmentId = assessmentRes.body.id;

      const responses = assessmentRes.body.questions.map(q => ({
        questionId: q.id,
        selectedOptionId: q.options[0].id
      }));

      const res = await request(app)
        .post('/api/assessments/submit')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          assessmentId,
          responses,
          timeSpentSeconds: 120
        });

      expect(res.status).toBe(201);
      expect(res.body.scorePercent).toBeDefined();
      expect(res.body.totalQuestions).toBe(responses.length);
      expect(res.body.proficiencyResult).toBeDefined();
      expect(res.body.disclaimer).toBeDefined();
      expect(Array.isArray(res.body.questionReview)).toBe(true);
    });

    it('GET /api/assessments/history returns student past attempts', async () => {
      const res = await request(app)
        .get('/api/assessments/history')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].scorePercent).toBeDefined();
    });
  });

  // 6. Roadmap Engine Tests
  describe('Roadmaps & Progress Tracking', () => {
    let roadmapId = '';
    let firstItemId = '';

    it('GET /api/roadmaps returns roadmaps', async () => {
      const res = await request(app).get('/api/roadmaps');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      roadmapId = res.body[0].id;
    });

    it('POST /api/roadmaps/enroll enrolls student and estimates target completion date', async () => {
      const res = await request(app)
        .post('/api/roadmaps/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          roadmapId,
          weeklyHours: 12
        });

      expect(res.status).toBe(201);
      expect(res.body.userRoadmap.status).toBe('ACTIVE');
      expect(res.body.estimatedTimeline).toBeDefined();
    });

    it('POST /api/roadmaps/progress updates item completion and recalculates overall %', async () => {
      const roadmapRes = await request(app).get(`/api/roadmaps/frontend-developer-roadmap`);
      firstItemId = roadmapRes.body.phases[0].items[0].id;

      const res = await request(app)
        .post('/api/roadmaps/progress')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          roadmapId,
          itemId: firstItemId,
          completed: true
        });

      expect(res.status).toBe(200);
      expect(res.body.completedItems).toBeGreaterThanOrEqual(1);
      expect(res.body.progressPercent).toBeGreaterThanOrEqual(0);
    });
  });

  // 7. Goals and Tasks CRUD Tests
  describe('Goals & Tasks Management', () => {
    let createdGoalId = '';
    let createdTaskId = '';

    it('creates a new goal', async () => {
      const res = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Learn Modern CSS Grid',
          description: 'Build 3 responsive layouts',
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        });

      expect(res.status).toBe(201);
      expect(res.body.goal.title).toBe('Learn Modern CSS Grid');
      createdGoalId = res.body.goal.id;
    });

    it('creates a task linked to the goal', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Complete Grid Garden tutorial',
          goalId: createdGoalId,
          priority: 'HIGH',
          status: 'TODO'
        });

      expect(res.status).toBe(201);
      expect(res.body.task.title).toBe('Complete Grid Garden tutorial');
      createdTaskId = res.body.task.id;
    });

    it('updates task status to COMPLETED', async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          status: 'COMPLETED'
        });

      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe('COMPLETED');
      expect(res.body.task.completedAt).toBeDefined();
    });

    it('deletes the task and goal', async () => {
      const delTaskRes = await request(app)
        .delete(`/api/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(delTaskRes.status).toBe(200);

      const delGoalRes = await request(app)
        .delete(`/api/goals/${createdGoalId}`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(delGoalRes.status).toBe(200);
    });
  });

  // 8. Projects Workspace Tests
  describe('Project Workspace', () => {
    let testProjectId = '';

    it('creates a new student project with repo & demo links', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Personal Portfolio Web App',
          description: 'A responsive developer portfolio built with React & Tailwind',
          category: 'Frontend',
          difficulty: 'BEGINNER',
          status: 'IN_PROGRESS',
          repoUrl: 'https://github.com/alexmorgan-dev/portfolio',
          demoUrl: 'https://alexmorgan.dev'
        });

      expect(res.status).toBe(201);
      expect(res.body.project.title).toBe('Personal Portfolio Web App');
      testProjectId = res.body.project.id;
    });

    it('rejects invalid URL for repository', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Invalid URL Project',
          repoUrl: 'not-a-valid-url'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('valid repository URL');
    });

    it('updates project status to COMPLETED', async () => {
      const res = await request(app)
        .put(`/api/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ status: 'COMPLETED' });

      expect(res.status).toBe(200);
      expect(res.body.project.status).toBe('COMPLETED');
    });
  });

  // 9. Dashboard Overview Tests
  describe('Student Dashboard Analytics', () => {
    it('GET /api/dashboard/overview returns calculated live metrics', async () => {
      const res = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.summaryCards).toBeDefined();
      expect(typeof res.body.summaryCards.skillsAssessed).toBe('number');
      expect(typeof res.body.summaryCards.currentStreakDays).toBe('number');
      expect(Array.isArray(res.body.weeklyActivity)).toBe(true);
      expect(Array.isArray(res.body.skillsChartData)).toBe(true);
    });
  });

  // 10. AI Career Assistant Tests
  describe('AI Career Assistant', () => {
    it('POST /api/assistant/chat returns structured guidance with source attribution', async () => {
      const res = await request(app)
        .post('/api/assistant/chat')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          message: 'What projects should I build for Frontend Developer?'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
      expect(res.body.source).toBeDefined();
      expect(res.body.disclaimer).toBeDefined();
    });
  });
});

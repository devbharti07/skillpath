// SkillPath Central Client Service
// Self-contained client-side architecture with local storage persistence and curated data modules

import { careersData, getCareerBySlug } from '../data/careersData.js';
import { assessmentsData, getAssessmentBySlug, calculateAssessmentScore } from '../data/assessmentsData.js';
import { roadmapsData, getRoadmapBySlug } from '../data/roadmapsData.js';
import { resourcesData } from '../data/resourcesData.js';
import { StorageService } from './storage.js';

class ApiClient {
  constructor() {
    this.token = 'demo-student-token';
  }

  setToken(token) {
    this.token = token;
  }

  // Auth & Profile
  async login(credentials) {
    const profile = StorageService.getProfile();
    const updated = {
      ...profile,
      email: credentials?.email || profile.email
    };
    StorageService.saveProfile(updated);
    return { token: 'demo-student-token', user: updated };
  }

  async register(userData) {
    const profile = StorageService.getProfile();
    const updated = {
      ...profile,
      fullName: userData?.fullName || profile.fullName,
      email: userData?.email || profile.email,
      educationLevel: userData?.educationLevel || profile.educationLevel,
      primaryInterest: userData?.primaryInterest || profile.primaryInterest
    };
    StorageService.saveProfile(updated);
    return { token: 'demo-student-token', user: updated };
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }

  async getMe() {
    return StorageService.getProfile();
  }

  async updateProfile(profileData) {
    const current = StorageService.getProfile();
    const updated = { ...current, ...profileData };
    StorageService.saveProfile(updated);
    return updated;
  }

  async changePassword() {
    return { success: true, message: 'Password updated successfully in demo mode.' };
  }

  async forgotPassword() {
    return { success: true, message: 'Password reset link sent (Demo mode).' };
  }

  async exportData() {
    return {
      profile: StorageService.getProfile(),
      goals: StorageService.getGoals(),
      tasks: StorageService.getTasks(),
      projects: StorageService.getProjects(),
      roadmapProgress: StorageService.getAllRoadmapsProgress(),
      assessmentAttempts: StorageService.getAssessmentAttempts()
    };
  }

  // Onboarding
  async getOnboarding() {
    return StorageService.getProfile();
  }

  async saveOnboarding(data) {
    const current = StorageService.getProfile();
    const updated = {
      ...current,
      ...data,
      onboardingCompleted: true
    };
    StorageService.saveProfile(updated);
    return {
      success: true,
      summary: {
        recommendedCareer: 'Frontend Developer',
        matchScore: 92,
        suggestedRoadmap: 'frontend-developer',
        skillsConfirmed: StorageService.getVerifiedSkills().map((s) => s.category)
      }
    };
  }

  // Dashboard Overview
  async getDashboardOverview() {
    const profile = StorageService.getProfile();
    const goals = StorageService.getGoals();
    const tasks = StorageService.getTasks();
    const projects = StorageService.getProjects();
    const allRoadmaps = StorageService.getAllRoadmapsProgress();
    const attempts = StorageService.getAssessmentAttempts();
    const verified = attempts.filter((a) => a.isVerified);

    // Calculate active roadmaps with completion percentages
    const activeRoadmaps = roadmapsData.map((rm) => {
      const completedIds = allRoadmaps[rm.slug] || [];
      const pct = Math.round((completedIds.length / rm.topics.length) * 100);
      return {
        id: rm.id,
        slug: rm.slug,
        title: rm.title,
        careerTitle: rm.careerTitle,
        totalTopics: rm.topics.length,
        completedTopics: completedIds.length,
        progressPercent: pct
      };
    }).filter((rm) => rm.completedTopics > 0);

    const completedProjectsCount = projects.filter((p) => p.status === 'Completed').length;
    const completedTasksToday = tasks.filter((t) => t.completed).length;

    const summaryCards = {
      skillsAssessed: verified.length,
      activeRoadmaps: Math.max(activeRoadmaps.length, 1),
      learningProgressPercent: activeRoadmaps.length > 0 ? activeRoadmaps[0].progressPercent : 70,
      completedProjects: completedProjectsCount,
      weeklyLearningHours: profile.weeklyAvailabilityHours || 15,
      currentStreakDays: 4
    };

    const todaysTasks = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.completed ? 'COMPLETED' : 'TODO',
      goal: { title: 'Frontend Mastery' },
      priority: t.priority
    }));

    return {
      profile,
      studentGreeting: `Welcome back, ${profile.fullName}!`,
      currentCareerGoal: profile.targetRole || 'Full-Stack Developer',
      summaryCards,
      summary: summaryCards,
      continueLearning: {
        roadmapTitle: 'Frontend Developer Roadmap',
        phaseNumber: 1,
        itemTitle: 'Responsive Design & CSS Grid Layouts',
        itemDescription: 'Deep dive into 12-column responsive layout templates and mobile-first viewports.',
        estimatedHours: 8
      },
      activeRoadmaps,
      todaysTasks,
      todayTasks: todaysTasks,
      recentAssessments: attempts.slice(0, 4),
      recentProjects: projects.slice(0, 3),
      recommendedSkills: [
        { name: 'React Custom Hooks', reason: 'High demand in Frontend & Full-Stack roles' },
        { name: 'SQL Window Functions & Aggregations', reason: 'Essential for data querying and backend optimization' },
        { name: 'TypeScript Interface Patterns', reason: 'Adopted across 80% of modern software teams' }
      ],
      weeklyActivity: [
        { day: 'Mon', hours: 2.5, tasksCompleted: 2 },
        { day: 'Tue', hours: 3.0, tasksCompleted: 3 },
        { day: 'Wed', hours: 1.5, tasksCompleted: 1 },
        { day: 'Thu', hours: 4.0, tasksCompleted: 4 },
        { day: 'Fri', hours: 2.0, tasksCompleted: 2 },
        { day: 'Sat', hours: 3.5, tasksCompleted: 3 },
        { day: 'Sun', hours: 1.0, tasksCompleted: 1 }
      ],
      skillsChartData: [
        { skill: 'JavaScript', proficiency: 85 },
        { skill: 'React', proficiency: 75 },
        { skill: 'CSS/HTML', proficiency: 90 },
        { skill: 'Node.js', proficiency: 70 },
        { skill: 'SQL', proficiency: 65 },
        { skill: 'Python', proficiency: 60 }
      ],
      recentAchievements: [
        { id: 'ach-1', title: 'Speed Coder', description: 'Completed first skill assessment with 80%+ accuracy.' },
        { id: 'ach-2', title: 'Roadmap Milestone', description: 'Reached 70% progress on Frontend Developer track.' },
        { id: 'ach-3', title: 'Shipped Project', description: 'Published SkillPath Showcase on GitHub and Vercel.' }
      ]
    };
  }

  // Skills
  async getSkills() {
    const attempts = StorageService.getAssessmentAttempts();
    const verifiedCategories = attempts.filter((a) => a.isVerified).map((a) => a.category);

    const allSkills = [
      { id: 'sk-1', name: 'JavaScript (ES6+)', category: 'Frontend', level: 'Advanced', verified: verifiedCategories.includes('JavaScript') },
      { id: 'sk-2', name: 'React.js Architecture', category: 'Frontend', level: 'Intermediate', verified: verifiedCategories.includes('React') },
      { id: 'sk-3', name: 'HTML5 & CSS3 Flexbox/Grid', category: 'Frontend', level: 'Advanced', verified: verifiedCategories.includes('HTML and CSS') },
      { id: 'sk-4', name: 'Node.js & Express REST APIs', category: 'Backend', level: 'Intermediate', verified: true },
      { id: 'sk-5', name: 'SQL & Database Modeling', category: 'Database', level: 'Intermediate', verified: verifiedCategories.includes('SQL') },
      { id: 'sk-6', name: 'Python Programming', category: 'Data & AI', level: 'Beginner', verified: verifiedCategories.includes('Python') },
      { id: 'sk-7', name: 'Git, GitHub & Version Control', category: 'Tools', level: 'Intermediate', verified: true },
      { id: 'sk-8', name: 'Tailwind CSS Design Systems', category: 'Frontend', level: 'Advanced', verified: true },
      { id: 'sk-9', name: 'Logical Reasoning & Algorithms', category: 'Computer Science', level: 'Intermediate', verified: verifiedCategories.includes('Logical Reasoning') }
    ];
    return allSkills;
  }

  async getMySkills() {
    return this.getSkills();
  }

  async addOrUpdateUserSkill(data) {
    return { success: true, skill: data };
  }

  async deleteUserSkill() {
    return { success: true };
  }

  // Careers (All 10 Careers)
  async getCareers() {
    const bookmarks = StorageService.getBookmarks();
    return careersData.map((c) => ({
      ...c,
      isBookmarked: bookmarks.includes(c.id)
    }));
  }

  async getCareer(slug) {
    const career = getCareerBySlug(slug);
    if (!career) return null;
    const bookmarks = StorageService.getBookmarks();
    return {
      ...career,
      isBookmarked: bookmarks.includes(career.id)
    };
  }

  async compareCareers(slugsOrIds = []) {
    return careersData.filter((c) => slugsOrIds.includes(c.slug) || slugsOrIds.includes(c.id));
  }

  // Roadmaps (Interactive 10-Milestone Curriculum)
  async getRoadmaps() {
    const allProgress = StorageService.getAllRoadmapsProgress();
    return roadmapsData.map((rm) => {
      const completed = allProgress[rm.slug] || [];
      const progressPercent = Math.round((completed.length / rm.topics.length) * 100);
      return {
        ...rm,
        completedTopicsCount: completed.length,
        progressPercent,
        isEnrolled: true
      };
    });
  }

  async getRoadmap(slug) {
    const roadmap = getRoadmapBySlug(slug);
    const completedTopicIds = StorageService.getRoadmapCompletedTopics(slug);
    const progressPercent = Math.round((completedTopicIds.length / roadmap.topics.length) * 100);

    const enrichedTopics = roadmap.topics.map((t) => ({
      ...t,
      isCompleted: completedTopicIds.includes(t.id),
      completed: completedTopicIds.includes(t.id),
      resourceUrl: t.resourceLink
    }));

    // Group 10 topics into 4 logical phases
    const phases = [
      {
        id: `${roadmap.id}-p1`,
        phaseNumber: 1,
        title: 'Phase 1: Web Fundamentals & Structure',
        description: 'Semantic markup, styling cascades, and responsive viewports.',
        items: enrichedTopics.slice(0, 3)
      },
      {
        id: `${roadmap.id}-p2`,
        phaseNumber: 2,
        title: 'Phase 2: Core Programming & Version Control',
        description: 'Language syntax, asynchronous paradigms, and team Git workflows.',
        items: enrichedTopics.slice(3, 5)
      },
      {
        id: `${roadmap.id}-p3`,
        phaseNumber: 3,
        title: 'Phase 3: Component Systems & State Management',
        description: 'Reactive architecture, custom hooks, and REST API consumption.',
        items: enrichedTopics.slice(5, 7)
      },
      {
        id: `${roadmap.id}-p4`,
        phaseNumber: 4,
        title: 'Phase 4: Testing, Showcase Projects & Deployment',
        description: 'Unit testing, portfolio projects, and continuous cloud deployment.',
        items: enrichedTopics.slice(7, 10)
      }
    ];

    return {
      ...roadmap,
      topics: enrichedTopics,
      phases,
      completedTopicIds,
      progressPercent,
      userRoadmap: {
        id: `user-${roadmap.id}`,
        status: 'ACTIVE',
        progressPercent,
        weeklyHours: 12,
        notes: 'Goal: Complete all phase checkpoint items and build showcase portfolio application.'
      }
    };
  }

  async getMyRoadmaps() {
    return this.getRoadmaps();
  }

  async enrollRoadmap(data) {
    return { success: true, slug: data.roadmapSlug || 'frontend-developer' };
  }

  async updateRoadmapProgress(data) {
    const { roadmapId, roadmapSlug, itemId, topicId } = data;
    const targetSlug = roadmapSlug || (roadmapId ? roadmapId.replace('roadmap-', '') : 'frontend-developer');
    const targetId = topicId || itemId;

    const updatedCompleted = StorageService.toggleRoadmapTopic(targetSlug, targetId);
    const roadmap = getRoadmapBySlug(targetSlug);
    const progressPercent = Math.round((updatedCompleted.length / (roadmap?.topics?.length || 10)) * 100);

    return {
      success: true,
      progressPercent,
      completedTopicIds: updatedCompleted
    };
  }

  async updateRoadmapSettings() {
    return { success: true };
  }

  // Skill Assessments (Curated Question Bank & Grading)
  async getAssessments() {
    const attempts = StorageService.getAssessmentAttempts();
    return assessmentsData.map((a) => {
      const pastAttempt = attempts.find((att) => att.assessmentSlug === a.slug);
      return {
        ...a,
        totalQuestions: a.questions.length,
        hasAttempted: Boolean(pastAttempt),
        lastScore: pastAttempt ? pastAttempt.percentage : null,
        proficiency: pastAttempt ? pastAttempt.proficiency : 'Not Tested'
      };
    });
  }

  async getAssessment(slug) {
    const assessment = getAssessmentBySlug(slug) || assessmentsData.find(a => a.id === slug) || assessmentsData[0];
    if (!assessment) return null;

    const formattedQuestions = assessment.questions.map((q) => ({
      id: q.id,
      text: q.text,
      questionText: q.text,
      options: q.options.map((optText, idx) => ({
        id: `${q.id}-opt-${idx}`,
        optionText: optText,
        text: optText,
        index: idx
      }))
    }));

    return {
      ...assessment,
      totalQuestions: formattedQuestions.length,
      questions: formattedQuestions
    };
  }

  async submitAssessment(data) {
    const slug = data.slug || data.assessmentSlug || (data.assessmentId ? data.assessmentId.replace('assessment-', '') : null);
    let assessment = getAssessmentBySlug(slug) || assessmentsData.find(a => a.id === data.assessmentId) || assessmentsData[0];

    // Normalize responses or answers map
    const userAnswers = {};
    if (Array.isArray(data.responses)) {
      data.responses.forEach(r => {
        // extract option index from id format "qId-opt-X" or string
        const match = typeof r.selectedOptionId === 'string' ? r.selectedOptionId.match(/opt-(\d+)/) : null;
        userAnswers[r.questionId] = match ? parseInt(match[1], 10) : r.selectedOptionId;
      });
    } else if (data.answers) {
      Object.entries(data.answers).forEach(([qId, val]) => {
        const match = typeof val === 'string' ? val.match(/opt-(\d+)/) : null;
        userAnswers[qId] = match ? parseInt(match[1], 10) : val;
      });
    }

    const calculated = calculateAssessmentScore(assessment, userAnswers);

    const questionReview = assessment.questions.map((q, idx) => {
      const selectedIndex = userAnswers[q.id];
      const isCorrect = selectedIndex === q.correctIndex;
      const yourAnswer = selectedIndex !== undefined ? q.options[selectedIndex] : 'Not Answered';
      const correctAnswer = q.options[q.correctIndex];

      return {
        questionId: q.id,
        questionText: q.text,
        isCorrect,
        yourAnswer,
        correctAnswer,
        explanation: q.explanation
      };
    });

    const result = {
      assessmentId: assessment.id,
      assessmentSlug: assessment.slug,
      title: assessment.title,
      category: assessment.category,
      scorePercent: calculated.percentage,
      percentage: calculated.percentage,
      proficiencyResult: calculated.proficiency,
      proficiency: calculated.proficiency,
      correctAnswers: calculated.correctCount,
      correctCount: calculated.correctCount,
      totalQuestions: assessment.questions.length,
      passed: calculated.percentage >= 60,
      isVerified: calculated.isVerified,
      disclaimer: 'Score reflects standardized conceptual and syntax comprehension. Verified credentials remain active in your student profile.',
      strongAreas: calculated.percentage >= 60
        ? ['Core Syntax & Execution Flow', 'Structural Conceptual Principles', 'Standard Library Patterns']
        : ['Basic Syntax Recognition'],
      areasForImprovement: calculated.percentage >= 80
        ? ['Edge-Case Optimization']
        : ['Asynchronous State Lifecycles', 'Algorithmic Complexity Optimization'],
      questionReview,
      review: questionReview
    };

    StorageService.saveAssessmentAttempt(result);
    return result;
  }

  async getAssessmentHistory() {
    return StorageService.getAssessmentAttempts();
  }

  async getAssessmentAttempt(id) {
    const attempts = StorageService.getAssessmentAttempts();
    return attempts.find((a) => a.assessmentId === id || a.assessmentSlug === id) || attempts[0];
  }

  // Learning Hub Resources
  async getResources() {
    const bookmarks = StorageService.getBookmarks();
    return resourcesData.map((r) => ({
      ...r,
      isBookmarked: bookmarks.includes(r.id)
    }));
  }

  async toggleBookmark(itemType, itemId) {
    const updated = StorageService.toggleBookmark(itemId);
    const isBookmarked = updated.includes(itemId);
    return { bookmarked: isBookmarked };
  }

  async getUserBookmarks() {
    const bookmarks = StorageService.getBookmarks();
    return resourcesData.filter((r) => bookmarks.includes(r.id));
  }

  // Project Templates & Workspace
  async getProjectTemplates() {
    return [
      {
        id: 'tmpl-1',
        title: 'Interactive SaaS Analytics Dashboard',
        description: 'Build a multi-page analytics portal using React, Tailwind CSS, and Recharts with light/dark theme toggles.',
        difficulty: 'Intermediate',
        skills: ['React', 'Tailwind CSS', 'Recharts', 'Lucide React']
      },
      {
        id: 'tmpl-2',
        title: 'Kanban Flow Task Board',
        description: 'Create an interactive task workspace with column filters, priority badges, and localStorage persistence.',
        difficulty: 'Beginner',
        skills: ['React', 'State Management', 'CSS Grid']
      },
      {
        id: 'tmpl-3',
        title: 'Full-Stack RESTful API Backend',
        description: 'Express.js server with modular controllers, input validation, and role-based API protection.',
        difficulty: 'Intermediate',
        skills: ['Node.js', 'Express', 'JWT', 'REST API']
      }
    ];
  }

  async getMyProjects() {
    return StorageService.getProjects();
  }

  async createProject(data) {
    const projects = StorageService.saveProject(data);
    return projects[0];
  }

  async updateProject(id, data) {
    const projects = StorageService.saveProject({ ...data, id });
    return projects.find((p) => p.id === id);
  }

  async deleteProject(id) {
    StorageService.deleteProject(id);
    return { success: true };
  }

  async getPublicPortfolio(userId) {
    const profile = StorageService.getProfile();
    const projects = StorageService.getProjects().filter((p) => p.status === 'Completed');
    const verifiedSkills = StorageService.getVerifiedSkills();

    return {
      user: {
        ...profile,
        id: userId || profile.id
      },
      projects,
      verifiedSkills
    };
  }

  // Goals & Tasks
  async getGoals() {
    return StorageService.getGoals();
  }

  async createGoal(data) {
    const goals = StorageService.saveGoal(data);
    return goals[0];
  }

  async updateGoal(id, data) {
    const goals = StorageService.saveGoal({ ...data, id });
    return goals.find((g) => g.id === id);
  }

  async deleteGoal(id) {
    StorageService.deleteGoal(id);
    return { success: true };
  }

  async getTasks() {
    return StorageService.getTasks();
  }

  async createTask(data) {
    const tasks = StorageService.saveTask(data);
    return tasks[0];
  }

  async updateTask(id, data) {
    if (data.completed !== undefined) {
      StorageService.toggleTask(id);
    } else {
      StorageService.saveTask({ ...data, id });
    }
    const tasks = StorageService.getTasks();
    return tasks.find((t) => t.id === id);
  }

  async deleteTask(id) {
    StorageService.deleteTask(id);
    return { success: true };
  }

  // AI Career Assistant (Intelligent Offline Guidance Engine)
  async getAssistantHistory() {
    return [
      {
        id: 'msg-1',
        sender: 'assistant',
        content: "Hello Alex! I am your SkillPath Career & Learning Assistant. Ask me anything about career tracks, recommended roadmaps, project ideas, or skill assessments."
      }
    ];
  }

  async clearAssistantHistory() {
    return { success: true };
  }

  async chatWithAssistant(message) {
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('frontend') || lower.includes('react') || lower.includes('css')) {
      reply = "For Frontend Development, focus on mastering HTML5 semantics, modern CSS Flexbox/Grid, and core JavaScript (ES6+ closures, async/await). In React, ensure you understand state immutability, useEffect dependencies, and custom hooks. Check out the 10-milestone Frontend Roadmap in the Roadmaps tab!";
    } else if (lower.includes('backend') || lower.includes('node') || lower.includes('sql') || lower.includes('database')) {
      reply = "For Backend Engineering, start with the HTTP protocol, RESTful API conventions, and Express.js routing middleware. Relational database design with SQL and Prisma ORM will give you strong data integrity foundations. You can test your SQL knowledge directly in Skill Assessments!";
    } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('data')) {
      reply = "For AI Engineering and Data Science, Python is the industry standard. Focus on Pandas for data manipulation, NumPy for vectorized computation, and Scikit-Learn for classical algorithms. When integrating Generative AI, practice prompt engineering and Retrieval-Augmented Generation (RAG).";
    } else if (lower.includes('project') || lower.includes('portfolio') || lower.includes('resume')) {
      reply = "A strong student portfolio should feature 2 to 3 polished projects rather than 10 half-finished tutorials. Great ideas include: an interactive analytics dashboard with charts, a full-stack REST API with authentication, and a domain-specific productivity app. Use the Projects Workspace tab to track your milestones!";
    } else {
      reply = `Great question regarding "${message}"! On SkillPath, we recommend following structured roadmaps, verifying your knowledge through timed skill assessments, and building practical portfolio projects. You can explore the Career Explorer tab to compare career requirements and recommended beginner prerequisites.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: reply,
      source: 'SkillPath Intelligent Guidance Engine'
    };
  }

  // Admin Tools
  async getAdminOverview() {
    return {
      totalUsers: 142,
      totalCareers: careersData.length,
      totalRoadmaps: roadmapsData.length,
      totalAssessmentsCompleted: 384,
      systemHealth: '100% Operational (Client-Side Storage Active)'
    };
  }

  async getAdminUsers() {
    return [
      { id: 'u-1', fullName: 'Alex Chen', email: 'alex.chen@university.edu', role: 'STUDENT', createdAt: '2026-10-23' },
      { id: 'u-2', fullName: 'Sarah Connor', email: 'sarah.c@tech.edu', role: 'STUDENT', createdAt: '2026-10-22' },
      { id: 'u-3', fullName: 'Instructor Smith', email: 'instructor@university.edu', role: 'ADMIN', createdAt: '2026-10-20' }
    ];
  }
}

export const api = new ApiClient();
export default api;

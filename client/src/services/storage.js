// SkillPath LocalStorage State Management Service
// Provides zero-friction, client-side persistence for assignment demonstration

const STORAGE_KEYS = {
  PROFILE: 'skillpath_student_profile',
  GOALS: 'skillpath_goals',
  TASKS: 'skillpath_tasks',
  PROJECTS: 'skillpath_projects',
  ROADMAP_PROGRESS: 'skillpath_roadmap_progress',
  ASSESSMENT_ATTEMPTS: 'skillpath_assessment_attempts',
  BOOKMARKS: 'skillpath_bookmarks'
};

// Initial Demonstration Data for First-Time College Demo
const initialProfile = {
  id: 'student-alex-chen',
  fullName: 'Alex Chen',
  email: 'alex.chen@university.edu',
  role: 'STUDENT',
  educationLevel: 'Undergraduate Computer Science (3rd Year)',
  primaryInterest: 'Full-Stack Web Development',
  primaryCareerInterest: 'Full-Stack Developer',
  targetRole: 'Full-Stack Developer',
  bio: 'Computer Science student passionate about building accessible, performant web applications with React, Node.js, and modern cloud technologies.',
  weeklyAvailabilityHours: 15,
  githubUrl: 'https://github.com/devbharti07/skillpath',
  linkedinUrl: 'https://linkedin.com/in/alexchen',
  portfolioWebsite: 'https://skillpath-portfolio.dev',
  isPublic: true,
  profile: {
    educationLevel: 'Undergraduate Computer Science (3rd Year)',
    primaryCareerInterest: 'Full-Stack Developer',
    bio: 'Computer Science student passionate about building accessible, performant web applications with React, Node.js, and modern cloud technologies.',
    weeklyAvailabilityHours: 15,
    githubUrl: 'https://github.com/devbharti07/skillpath',
    linkedinUrl: 'https://linkedin.com/in/alexchen',
    portfolioWebsite: 'https://skillpath-portfolio.dev',
    isPublic: true
  }
};

const initialGoals = [
  {
    id: 'goal-1',
    title: 'Complete Frontend & React Mastery',
    category: 'Curriculum',
    deadline: '2026-11-15',
    targetDate: '2026-11-15',
    progress: 70,
    progressPercent: 70,
    status: 'In Progress',
    description: 'Master component architecture, custom hooks, and state management.'
  },
  {
    id: 'goal-2',
    title: 'Publish Full-Stack Capstone Project',
    category: 'Portfolio',
    deadline: '2026-12-01',
    targetDate: '2026-12-01',
    progress: 40,
    progressPercent: 40,
    status: 'In Progress',
    description: 'Develop and deploy an end-to-end interactive application with database integration.'
  },
  {
    id: 'goal-3',
    title: 'Pass JavaScript Core Assessment with Distinction',
    category: 'Certification',
    deadline: '2026-10-30',
    targetDate: '2026-10-30',
    progress: 100,
    progressPercent: 100,
    status: 'Completed',
    description: 'Achieve 80%+ on timed evaluation of ES6+, closures, and asynchronous event loop.'
  }
];

const initialTasks = [
  {
    id: 'task-1',
    title: 'Review React useEffect dependency array best practices',
    goalId: 'goal-1',
    priority: 'HIGH',
    completed: true,
    status: 'COMPLETED',
    dueDate: 'Today'
  },
  {
    id: 'task-2',
    title: 'Implement responsive dark/light mode toggle in showcase app',
    goalId: 'goal-2',
    priority: 'MEDIUM',
    completed: true,
    status: 'COMPLETED',
    dueDate: 'Today'
  },
  {
    id: 'task-3',
    title: 'Complete SQL Relational Joins & Indexing Assessment',
    goalId: 'goal-3',
    priority: 'HIGH',
    completed: false,
    status: 'TODO',
    dueDate: 'Tomorrow'
  },
  {
    id: 'task-4',
    title: 'Deploy frontend client to Vercel and verify deep routing rewrites',
    goalId: 'goal-2',
    priority: 'HIGH',
    completed: true,
    status: 'COMPLETED',
    dueDate: 'Completed'
  },
  {
    id: 'task-5',
    title: 'Read MDN guide on CSS Grid 12-column template areas',
    goalId: 'goal-1',
    priority: 'LOW',
    completed: false,
    status: 'TODO',
    dueDate: 'This Week'
  }
];

const initialProjects = [
  {
    id: 'proj-1',
    title: 'SkillPath Career Engine & Learning Hub',
    description: 'An interactive career exploration portal with roadmaps, skill evaluations, and progress tracking for students.',
    category: 'Frontend',
    techStack: ['React 19', 'Tailwind CSS', 'Vite', 'Lucide Icons'],
    difficulty: 'INTERMEDIATE',
    status: 'COMPLETED',
    repoUrl: 'https://github.com/devbharti07/skillpath',
    githubUrl: 'https://github.com/devbharti07/skillpath',
    demoUrl: 'https://skillpath-rho-lyart.vercel.app',
    liveUrl: 'https://skillpath-rho-lyart.vercel.app'
  },
  {
    id: 'proj-2',
    title: 'Kanban Flow Task Workspace',
    description: 'A responsive drag-and-drop productivity board with local state management and priority labeling.',
    category: 'Frontend',
    techStack: ['React', 'Tailwind CSS', 'HTML5 Drag & Drop'],
    difficulty: 'BEGINNER',
    status: 'IN_PROGRESS',
    repoUrl: 'https://github.com/devbharti07/skillpath',
    githubUrl: 'https://github.com/devbharti07/skillpath',
    demoUrl: 'https://example.com/demo',
    liveUrl: 'https://example.com/demo'
  },
  {
    id: 'proj-3',
    title: 'Full-Stack RESTful API Microservice',
    description: 'Node.js Express backend service with secure JWT cookies, modular routes, and validation middleware.',
    category: 'Backend',
    techStack: ['Node.js', 'Express', 'JWT', 'REST API'],
    difficulty: 'INTERMEDIATE',
    status: 'IN_PROGRESS',
    repoUrl: 'https://github.com/devbharti07/skillpath',
    githubUrl: 'https://github.com/devbharti07/skillpath',
    demoUrl: '',
    liveUrl: ''
  }
];

const initialRoadmapProgress = {
  'frontend-developer': ['fe-t1', 'fe-t2', 'fe-t3', 'fe-t4', 'fe-t5', 'fe-t6', 'fe-t7'], // 7/10 complete
  'backend-developer': ['be-t1', 'be-t2', 'be-t3'] // 3/10 complete
};

const initialAttempts = [
  {
    id: 'att-1',
    assessmentId: 'assessment-js',
    assessmentSlug: 'javascript-core',
    title: 'JavaScript Core & Async Mastery',
    category: 'JavaScript',
    totalQuestions: 5,
    correctCount: 4,
    correctAnswers: 4,
    percentage: 80,
    scorePercent: 80,
    proficiency: 'Advanced',
    proficiencyResult: 'Advanced',
    isVerified: true,
    completedAt: '2026-10-23T12:00:00Z',
    assessment: {
      id: 'assessment-js',
      slug: 'javascript-core',
      title: 'JavaScript Core & Async Mastery',
      category: 'JavaScript'
    }
  }
];

// Helper to safely read from localStorage
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

// Helper to safely write to localStorage
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to write ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Profile
  getProfile() {
    const profile = readStorage(STORAGE_KEYS.PROFILE, initialProfile);
    // Ensure both top-level and nested .profile properties exist for safety
    return {
      ...initialProfile,
      ...profile,
      primaryCareerInterest: profile.primaryCareerInterest || profile.targetRole || profile.primaryInterest || initialProfile.primaryCareerInterest,
      profile: {
        ...initialProfile.profile,
        ...(profile.profile || {}),
        educationLevel: profile.educationLevel || profile.profile?.educationLevel || initialProfile.educationLevel,
        primaryCareerInterest: profile.primaryCareerInterest || profile.profile?.primaryCareerInterest || initialProfile.primaryCareerInterest,
        bio: profile.bio || profile.profile?.bio || initialProfile.bio
      }
    };
  },
  saveProfile(profile) {
    const current = this.getProfile();
    const updated = {
      ...current,
      ...profile,
      primaryCareerInterest: profile.primaryCareerInterest || profile.targetRole || current.primaryCareerInterest,
      profile: {
        ...current.profile,
        ...(profile.profile || {}),
        ...profile
      }
    };
    writeStorage(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // Goals
  getGoals() {
    const rawGoals = readStorage(STORAGE_KEYS.GOALS, initialGoals);
    const tasks = readStorage(STORAGE_KEYS.TASKS, initialTasks);

    return rawGoals.map((g) => {
      const goalTasks = tasks.filter((t) => t.goalId === g.id);
      const totalTasks = goalTasks.length > 0 ? goalTasks.length : (g.totalTasks || 3);
      const completedTasks = goalTasks.length > 0
        ? goalTasks.filter((t) => t.completed || t.status === 'COMPLETED').length
        : (g.completedTasks || Math.round((g.progress || 70) * totalTasks / 100));
      const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (g.progress || 70);

      return {
        ...g,
        progress: g.progress ?? pct,
        progressPercent: pct,
        totalTasks,
        completedTasks
      };
    });
  },
  saveGoal(goal) {
    const goals = this.getGoals();
    const existingIndex = goals.findIndex((g) => g.id === goal.id);
    const progressVal = goal.progressPercent ?? goal.progress ?? 0;
    const newGoal = {
      ...goal,
      id: goal.id || `goal-${Date.now()}`,
      progress: progressVal,
      progressPercent: progressVal,
      status: goal.status || (progressVal >= 100 ? 'Completed' : 'In Progress'),
      targetDate: goal.targetDate || goal.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      goals[existingIndex] = { ...goals[existingIndex], ...newGoal };
    } else {
      goals.unshift(newGoal);
    }
    writeStorage(STORAGE_KEYS.GOALS, goals);
    return goals;
  },
  deleteGoal(id) {
    const goals = this.getGoals().filter((g) => g.id !== id);
    writeStorage(STORAGE_KEYS.GOALS, goals);
    // Also remove associated tasks
    const tasks = this.getTasks().filter((t) => t.goalId !== id);
    writeStorage(STORAGE_KEYS.TASKS, tasks);
    return goals;
  },

  // Tasks
  getTasks() {
    const raw = readStorage(STORAGE_KEYS.TASKS, initialTasks);
    return raw.map((t) => {
      const isCompleted = Boolean(t.completed || t.status === 'COMPLETED');
      return {
        ...t,
        completed: isCompleted,
        status: isCompleted ? 'COMPLETED' : 'TODO',
        priority: (t.priority || 'MEDIUM').toUpperCase()
      };
    });
  },
  saveTask(task) {
    const tasks = this.getTasks();
    const isCompleted = task.completed !== undefined
      ? Boolean(task.completed)
      : task.status === 'COMPLETED';

    const normalizedTask = {
      ...task,
      id: task.id || `task-${Date.now()}`,
      completed: isCompleted,
      status: isCompleted ? 'COMPLETED' : 'TODO',
      priority: (task.priority || 'MEDIUM').toUpperCase(),
      dueDate: task.dueDate || 'Today'
    };

    const existingIndex = tasks.findIndex((t) => t.id === normalizedTask.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = { ...tasks[existingIndex], ...normalizedTask };
    } else {
      tasks.unshift(normalizedTask);
    }
    writeStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks;
  },
  toggleTask(id) {
    const tasks = this.getTasks().map((t) => {
      if (t.id === id) {
        const next = !t.completed;
        return {
          ...t,
          completed: next,
          status: next ? 'COMPLETED' : 'TODO'
        };
      }
      return t;
    });
    writeStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks;
  },
  deleteTask(id) {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    writeStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks;
  },

  // Projects
  getProjects() {
    const raw = readStorage(STORAGE_KEYS.PROJECTS, initialProjects);
    return raw.map((p) => {
      let upperStatus = (p.status || 'IN_PROGRESS').toUpperCase().replace(' ', '_');
      if (upperStatus === 'COMPLETED' || upperStatus === 'IN_PROGRESS' || upperStatus === 'NOT_STARTED') {
        // standard
      } else {
        upperStatus = 'IN_PROGRESS';
      }

      return {
        ...p,
        status: upperStatus,
        repoUrl: p.repoUrl || p.githubUrl || '',
        githubUrl: p.githubUrl || p.repoUrl || '',
        demoUrl: p.demoUrl || p.liveUrl || '',
        liveUrl: p.liveUrl || p.demoUrl || '',
        category: p.category || 'Frontend'
      };
    });
  },
  saveProject(project) {
    const projects = this.getProjects();
    const normalizedStatus = (project.status || 'IN_PROGRESS').toUpperCase().replace(' ', '_');
    const normalized = {
      ...project,
      id: project.id || `proj-${Date.now()}`,
      status: normalizedStatus,
      repoUrl: project.repoUrl || project.githubUrl || '',
      githubUrl: project.githubUrl || project.repoUrl || '',
      demoUrl: project.demoUrl || project.liveUrl || '',
      liveUrl: project.liveUrl || project.demoUrl || '',
      category: project.category || 'Frontend'
    };

    const existingIndex = projects.findIndex((p) => p.id === normalized.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...projects[existingIndex], ...normalized };
    } else {
      projects.unshift(normalized);
    }
    writeStorage(STORAGE_KEYS.PROJECTS, projects);
    return projects;
  },
  deleteProject(id) {
    const projects = this.getProjects().filter((p) => p.id !== id);
    writeStorage(STORAGE_KEYS.PROJECTS, projects);
    return projects;
  },

  // Roadmap Progress
  getRoadmapCompletedTopics(slug) {
    const allProgress = readStorage(STORAGE_KEYS.ROADMAP_PROGRESS, initialRoadmapProgress);
    return allProgress[slug] || [];
  },
  toggleRoadmapTopic(slug, topicId) {
    const allProgress = readStorage(STORAGE_KEYS.ROADMAP_PROGRESS, initialRoadmapProgress);
    const completed = allProgress[slug] || [];
    const isCompleted = completed.includes(topicId);

    const updated = isCompleted
      ? completed.filter((id) => id !== topicId)
      : [...completed, topicId];

    allProgress[slug] = updated;
    writeStorage(STORAGE_KEYS.ROADMAP_PROGRESS, allProgress);
    return updated;
  },
  getAllRoadmapsProgress() {
    return readStorage(STORAGE_KEYS.ROADMAP_PROGRESS, initialRoadmapProgress);
  },

  // Skill Assessment Attempts & Verification
  getAssessmentAttempts() {
    const attempts = readStorage(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, initialAttempts);
    return attempts.map((a, idx) => {
      const score = a.scorePercent ?? a.percentage ?? 80;
      const prof = a.proficiencyResult || a.proficiency || (score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner');

      return {
        ...a,
        id: a.id || a.assessmentId || `att-${idx}`,
        scorePercent: score,
        percentage: score,
        proficiencyResult: prof,
        proficiency: prof,
        correctAnswers: a.correctAnswers ?? a.correctCount ?? 4,
        correctCount: a.correctCount ?? a.correctAnswers ?? 4,
        totalQuestions: a.totalQuestions || 5,
        assessmentTitle: a.assessmentTitle || a.title || 'Skill Assessment',
        assessment: a.assessment || {
          id: a.assessmentId,
          slug: a.assessmentSlug,
          title: a.title,
          category: a.category
        }
      };
    });
  },
  saveAssessmentAttempt(result) {
    const attempts = this.getAssessmentAttempts();
    const normalized = {
      ...result,
      id: result.id || `att-${Date.now()}`,
      scorePercent: result.scorePercent ?? result.percentage ?? 0,
      percentage: result.percentage ?? result.scorePercent ?? 0,
      proficiencyResult: result.proficiencyResult || result.proficiency || 'Intermediate',
      proficiency: result.proficiency || result.proficiencyResult || 'Intermediate',
      correctAnswers: result.correctAnswers ?? result.correctCount ?? 0,
      correctCount: result.correctCount ?? result.correctAnswers ?? 0,
      totalQuestions: result.totalQuestions || 5,
      assessmentTitle: result.title || result.assessmentTitle || 'Skill Assessment',
      completedAt: result.completedAt || new Date().toISOString(),
      assessment: {
        id: result.assessmentId,
        slug: result.assessmentSlug,
        title: result.title,
        category: result.category
      }
    };

    const filtered = attempts.filter((a) => a.assessmentSlug !== normalized.assessmentSlug);
    filtered.unshift(normalized);
    writeStorage(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, filtered);
    return filtered;
  },
  getVerifiedSkills() {
    const attempts = this.getAssessmentAttempts();
    return attempts.filter((a) => a.isVerified);
  },

  // Bookmarks
  getBookmarks() {
    return readStorage(STORAGE_KEYS.BOOKMARKS, ['res-mdn-html', 'res-react-dev']);
  },
  toggleBookmark(resourceId) {
    const bookmarks = this.getBookmarks();
    const updated = bookmarks.includes(resourceId)
      ? bookmarks.filter((id) => id !== resourceId)
      : [...bookmarks, resourceId];
    writeStorage(STORAGE_KEYS.BOOKMARKS, updated);
    return updated;
  },

  // Reset to Demo Defaults
  resetDemoData() {
    writeStorage(STORAGE_KEYS.PROFILE, initialProfile);
    writeStorage(STORAGE_KEYS.GOALS, initialGoals);
    writeStorage(STORAGE_KEYS.TASKS, initialTasks);
    writeStorage(STORAGE_KEYS.PROJECTS, initialProjects);
    writeStorage(STORAGE_KEYS.ROADMAP_PROGRESS, initialRoadmapProgress);
    writeStorage(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, initialAttempts);
  }
};

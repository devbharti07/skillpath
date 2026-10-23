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
  bio: 'Computer Science student passionate about building accessible, performant web applications with React, Node.js, and modern cloud technologies.',
  weeklyAvailabilityHours: 15,
  targetRole: 'Full-Stack Developer'
};

const initialGoals = [
  {
    id: 'goal-1',
    title: 'Complete Frontend & React Mastery',
    category: 'Curriculum',
    deadline: '2026-11-15',
    progress: 70,
    status: 'In Progress',
    description: 'Master component architecture, custom hooks, and state management.'
  },
  {
    id: 'goal-2',
    title: 'Publish Full-Stack Capstone Project',
    category: 'Portfolio',
    deadline: '2026-12-01',
    progress: 40,
    status: 'In Progress',
    description: 'Develop and deploy an end-to-end interactive application with database integration.'
  },
  {
    id: 'goal-3',
    title: 'Pass JavaScript Core Assessment with Distinction',
    category: 'Certification',
    deadline: '2026-10-30',
    progress: 100,
    status: 'Completed',
    description: 'Achieve 80%+ on timed evaluation of ES6+, closures, and asynchronous event loop.'
  }
];

const initialTasks = [
  {
    id: 'task-1',
    title: 'Review React useEffect dependency array best practices',
    goalId: 'goal-1',
    priority: 'High',
    completed: true,
    dueDate: 'Today'
  },
  {
    id: 'task-2',
    title: 'Implement responsive dark/light mode toggle in showcase app',
    goalId: 'goal-2',
    priority: 'Medium',
    completed: true,
    dueDate: 'Today'
  },
  {
    id: 'task-3',
    title: 'Complete SQL Relational Joins & Indexing Assessment',
    goalId: 'goal-3',
    priority: 'High',
    completed: false,
    dueDate: 'Tomorrow'
  },
  {
    id: 'task-4',
    title: 'Deploy frontend client to Vercel and verify deep routing rewrites',
    goalId: 'goal-2',
    priority: 'High',
    completed: true,
    dueDate: 'Completed'
  },
  {
    id: 'task-5',
    title: 'Read MDN guide on CSS Grid 12-column template areas',
    goalId: 'goal-1',
    priority: 'Low',
    completed: false,
    dueDate: 'This Week'
  }
];

const initialProjects = [
  {
    id: 'proj-1',
    title: 'SkillPath Career Engine & Learning Hub',
    description: 'An interactive career exploration portal with roadmaps, skill evaluations, and progress tracking for students.',
    techStack: ['React 19', 'Tailwind CSS', 'Vite', 'Lucide Icons'],
    difficulty: 'Intermediate',
    status: 'Completed',
    githubUrl: 'https://github.com/devbharti07/skillpath',
    liveUrl: 'https://prompt-obsidian-eyifjsp.tmp.now'
  },
  {
    id: 'proj-2',
    title: 'Kanban Flow Task Workspace',
    description: 'A responsive drag-and-drop productivity board with local state management and priority labeling.',
    techStack: ['React', 'Tailwind CSS', 'HTML5 Drag & Drop'],
    difficulty: 'Beginner',
    status: 'In Progress',
    githubUrl: 'https://github.com/example/kanban-flow',
    liveUrl: 'https://example.com/demo'
  },
  {
    id: 'proj-3',
    title: 'Full-Stack RESTful API Microservice',
    description: 'Node.js Express backend service with secure JWT cookies, modular routes, and validation middleware.',
    techStack: ['Node.js', 'Express', 'JWT', 'REST API'],
    difficulty: 'Intermediate',
    status: 'In Progress',
    githubUrl: 'https://github.com/example/node-microservice',
    liveUrl: ''
  }
];

const initialRoadmapProgress = {
  'frontend-developer': ['fe-t1', 'fe-t2', 'fe-t3', 'fe-t4', 'fe-t5', 'fe-t6', 'fe-t7'], // 7/10 complete
  'backend-developer': ['be-t1', 'be-t2', 'be-t3'] // 3/10 complete
};

const initialAttempts = [
  {
    assessmentId: 'assessment-js',
    assessmentSlug: 'javascript-core',
    title: 'JavaScript Core & Async Mastery',
    category: 'JavaScript',
    totalQuestions: 5,
    correctCount: 4,
    percentage: 80,
    proficiency: 'Advanced',
    isVerified: true,
    completedAt: '2026-10-23T12:00:00Z'
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
    return readStorage(STORAGE_KEYS.PROFILE, initialProfile);
  },
  saveProfile(profile) {
    writeStorage(STORAGE_KEYS.PROFILE, profile);
    return profile;
  },

  // Goals
  getGoals() {
    return readStorage(STORAGE_KEYS.GOALS, initialGoals);
  },
  saveGoal(goal) {
    const goals = this.getGoals();
    const existingIndex = goals.findIndex((g) => g.id === goal.id);
    if (existingIndex >= 0) {
      goals[existingIndex] = { ...goals[existingIndex], ...goal };
    } else {
      goals.unshift({ ...goal, id: goal.id || `goal-${Date.now()}` });
    }
    writeStorage(STORAGE_KEYS.GOALS, goals);
    return goals;
  },
  deleteGoal(id) {
    const goals = this.getGoals().filter((g) => g.id !== id);
    writeStorage(STORAGE_KEYS.GOALS, goals);
    return goals;
  },

  // Tasks
  getTasks() {
    return readStorage(STORAGE_KEYS.TASKS, initialTasks);
  },
  saveTask(task) {
    const tasks = this.getTasks();
    const existingIndex = tasks.findIndex((t) => t.id === task.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = { ...tasks[existingIndex], ...task };
    } else {
      tasks.unshift({ ...task, id: task.id || `task-${Date.now()}`, completed: false });
    }
    writeStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks;
  },
  toggleTask(id) {
    const tasks = this.getTasks().map((t) => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
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
    return readStorage(STORAGE_KEYS.PROJECTS, initialProjects);
  },
  saveProject(project) {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...projects[existingIndex], ...project };
    } else {
      projects.unshift({ ...project, id: project.id || `proj-${Date.now()}` });
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
    return readStorage(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, initialAttempts);
  },
  saveAssessmentAttempt(result) {
    const attempts = this.getAssessmentAttempts();
    // remove previous attempt for the same assessment if present, keep best/latest
    const filtered = attempts.filter((a) => a.assessmentSlug !== result.assessmentSlug);
    filtered.unshift(result);
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

// Curated Career Roadmaps with 10 Structured Milestone Topics Each
export const roadmapsData = [
  {
    id: 'roadmap-frontend',
    slug: 'frontend-developer',
    title: 'Frontend Developer Career Roadmap',
    careerTitle: 'Frontend Developer',
    description: 'A structured 10-milestone curriculum taking you from zero to production-ready frontend engineer.',
    totalEstimatedHours: 120,
    topics: [
      {
        id: 'fe-t1',
        number: 1,
        title: 'HTML & Semantic Web',
        description: 'Master semantic tags (<article>, <section>, <main>), accessible forms, document hierarchy, and SEO fundamentals.',
        estimatedHours: 8,
        resourceName: 'MDN Web Docs: HTML Basics',
        resourceLink: 'https://developer.mozilla.org/en-US/docs/Learn/HTML'
      },
      {
        id: 'fe-t2',
        number: 2,
        title: 'CSS & Modern Styling',
        description: 'Understand the CSS box model, specificities, cascade rules, typography, custom variables, and Tailwind CSS utility tokens.',
        estimatedHours: 12,
        resourceName: 'web.dev: Learn CSS',
        resourceLink: 'https://web.dev/learn/css'
      },
      {
        id: 'fe-t3',
        number: 3,
        title: 'Responsive Design & Layouts',
        description: 'Deep dive into CSS Flexbox, 12-column CSS Grid, media queries, mobile-first design, and fluid typography.',
        estimatedHours: 10,
        resourceName: 'CSS-Tricks: A Complete Guide to Flexbox & Grid',
        resourceLink: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/'
      },
      {
        id: 'fe-t4',
        number: 4,
        title: 'JavaScript Core & ES6+',
        description: 'Variables (let/const), arrow functions, destructuring, modules, DOM manipulation, closures, and event listeners.',
        estimatedHours: 20,
        resourceName: 'javascript.info: The Modern JavaScript Tutorial',
        resourceLink: 'https://javascript.info/'
      },
      {
        id: 'fe-t5',
        number: 5,
        title: 'Git & Version Control',
        description: 'Branching strategies, pull requests, resolving merge conflicts, git rebase, GitHub collaboration, and commit conventions.',
        estimatedHours: 6,
        resourceName: 'GitHub Skills: Introduction to GitHub',
        resourceLink: 'https://skills.github.com/'
      },
      {
        id: 'fe-t6',
        number: 6,
        title: 'React.js Component Architecture',
        description: 'Functional components, JSX syntax, props, useState, useEffect hooks, conditional rendering, and component lifecycle.',
        estimatedHours: 24,
        resourceName: 'React.dev: Quick Start & Interactive Docs',
        resourceLink: 'https://react.dev/learn'
      },
      {
        id: 'fe-t7',
        number: 7,
        title: 'API Integration & Asynchronous State',
        description: 'Fetch API, async/await error handling, RESTful JSON consumption, query caching, loading skeletons, and error boundaries.',
        estimatedHours: 14,
        resourceName: 'MDN: How to use Promises & Fetch',
        resourceLink: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises'
      },
      {
        id: 'fe-t8',
        number: 8,
        title: 'Testing & Web Accessibility (WCAG)',
        description: 'Unit testing with Vitest/Jest, React Testing Library, keyboard navigation testing, aria-labels, and color contrast auditing.',
        estimatedHours: 10,
        resourceName: 'Testing Library Documentation',
        resourceLink: 'https://testing-library.com/'
      },
      {
        id: 'fe-t9',
        number: 9,
        title: 'Portfolio Projects & Code Quality',
        description: 'Architect and polish original showcase projects, write clean README documentation, and adhere to clean code principles.',
        estimatedHours: 12,
        resourceName: 'SkillPath Showcase Projects Guide',
        resourceLink: 'https://github.com'
      },
      {
        id: 'fe-t10',
        number: 10,
        title: 'Production Build & Vercel Deployment',
        description: 'Vite bundling, code-splitting, environment variables, Single Page Application routing, and continuous Vercel deployment.',
        estimatedHours: 4,
        resourceName: 'Vercel Deployment Guide for Vite & React',
        resourceLink: 'https://vercel.com/docs/frameworks/vite'
      }
    ]
  },
  {
    id: 'roadmap-backend',
    slug: 'backend-developer',
    title: 'Backend Developer Career Roadmap',
    careerTitle: 'Backend Developer',
    description: 'Learn server architecture, relational databases, secure authentication, API design, and cloud deployments.',
    totalEstimatedHours: 130,
    topics: [
      {
        id: 'be-t1',
        number: 1,
        title: 'Internet & HTTP Fundamentals',
        description: 'TCP/IP, DNS, HTTP verbs, status codes, request headers, CORS policies, and client-server communication.',
        estimatedHours: 8,
        resourceName: 'MDN: An overview of HTTP',
        resourceLink: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'
      },
      {
        id: 'be-t2',
        number: 2,
        title: 'Node.js & Asynchronous Runtime',
        description: 'Event loop, buffer & stream I/O, CommonJS vs ES Modules, npm packages, and process management.',
        estimatedHours: 15,
        resourceName: 'Node.js Official Documentation',
        resourceLink: 'https://nodejs.org/en/learn'
      },
      {
        id: 'be-t3',
        number: 3,
        title: 'Express.js & RESTful API Architecture',
        description: 'Middleware pipelines, route parameters, controllers, centralized error handling, and request validation.',
        estimatedHours: 18,
        resourceName: 'Express.js Routing Guide',
        resourceLink: 'https://expressjs.com/en/guide/routing.html'
      },
      {
        id: 'be-t4',
        number: 4,
        title: 'Relational Databases & SQL',
        description: 'PostgreSQL/SQLite, table relationships (1:1, 1:N, N:M), foreign keys, indexes, and complex joins.',
        estimatedHours: 20,
        resourceName: 'PostgreSQL Tutorial',
        resourceLink: 'https://www.postgresqltutorial.com/'
      },
      {
        id: 'be-t5',
        number: 5,
        title: 'ORM & Data Modeling (Prisma)',
        description: 'Schema modeling, migrations, seeding, transactions, relations, and type-safe database queries.',
        estimatedHours: 14,
        resourceName: 'Prisma Getting Started Guide',
        resourceLink: 'https://www.prisma.io/docs/getting-started'
      },
      {
        id: 'be-t6',
        number: 6,
        title: 'Authentication & Security Best Practices',
        description: 'Bcrypt password hashing, JSON Web Tokens (JWT), HttpOnly cookies, session management, and rate limiting.',
        estimatedHours: 16,
        resourceName: 'OWASP Top 10 Web Application Security',
        resourceLink: 'https://owasp.org/www-project-top-ten/'
      },
      {
        id: 'be-t7',
        number: 7,
        title: 'API Testing & Documentation (OpenAPI)',
        description: 'Supertest automated API integration tests, status code assertions, and Swagger/OpenAPI specifications.',
        estimatedHours: 10,
        resourceName: 'Supertest GitHub Documentation',
        resourceLink: 'https://github.com/ladjs/supertest'
      },
      {
        id: 'be-t8',
        number: 8,
        title: 'Caching & Background Queues',
        description: 'In-memory caching with Redis, job queues, scheduled tasks, and database query optimization.',
        estimatedHours: 12,
        resourceName: 'Redis University & Quickstart',
        resourceLink: 'https://redis.io/docs/latest/'
      },
      {
        id: 'be-t9',
        number: 9,
        title: 'Docker & Containerization',
        description: 'Writing Dockerfiles, multi-stage container builds, docker-compose for local database development.',
        estimatedHours: 10,
        resourceName: 'Docker Get Started Guide',
        resourceLink: 'https://docs.docker.com/get-started/'
      },
      {
        id: 'be-t10',
        number: 10,
        title: 'Cloud Deployment & Monitoring',
        description: 'Deploying APIs to Render/Railway/Fly.io, environment variable management, log monitoring, and health checks.',
        estimatedHours: 7,
        resourceName: 'Render Node.js Deployment Docs',
        resourceLink: 'https://render.com/docs/node-express-app'
      }
    ]
  },
  {
    id: 'roadmap-fullstack',
    slug: 'fullstack-developer',
    title: 'Full-Stack Developer Roadmap',
    careerTitle: 'Full-Stack Developer',
    description: 'Connect modern frontend experiences with scalable backend APIs and cloud databases.',
    totalEstimatedHours: 160,
    topics: [
      { id: 'fs-t1', number: 1, title: 'Web Architecture & Modern Protocols', description: 'Client-server model, REST APIs, HTTP/HTTPS headers, and CORS.', estimatedHours: 10, resourceName: 'MDN Web Architecture', resourceLink: 'https://developer.mozilla.org/' },
      { id: 'fs-t2', number: 2, title: 'Advanced JavaScript & TypeScript', description: 'Asynchronous event loop, types, interfaces, generics, and strict validation.', estimatedHours: 20, resourceName: 'TypeScript Handbook', resourceLink: 'https://www.typescriptlang.org/docs/' },
      { id: 'fs-t3', number: 3, title: 'Modern React & Design Systems', description: 'State management, custom hooks, reusable design tokens with Tailwind CSS.', estimatedHours: 25, resourceName: 'React Docs', resourceLink: 'https://react.dev/' },
      { id: 'fs-t4', number: 4, title: 'Node.js & Express REST APIs', description: 'Controller-service-route pattern, validation, middleware, error handling.', estimatedHours: 25, resourceName: 'Express Guides', resourceLink: 'https://expressjs.com/' },
      { id: 'fs-t5', number: 5, title: 'Relational Database Schema Design', description: 'PostgreSQL schema modeling, relations, indexing, and migration workflows.', estimatedHours: 20, resourceName: 'Prisma ORM Guides', resourceLink: 'https://www.prisma.io/' },
      { id: 'fs-t6', number: 6, title: 'Full-Stack Auth & Authorization', description: 'Secure JWT tokens, role-based guards, bcrypt hashing, and cookie sessions.', estimatedHours: 15, resourceName: 'Auth Best Practices', resourceLink: 'https://jwt.io/' },
      { id: 'fs-t7', number: 7, title: 'Client & Server State Synchronization', description: 'TanStack Query / SWR, optimistic updates, cache invalidation.', estimatedHours: 12, resourceName: 'TanStack Query Docs', resourceLink: 'https://tanstack.com/query' },
      { id: 'fs-t8', number: 8, title: 'Automated Testing (E2E & Integration)', description: 'Vitest unit tests, Supertest API tests, and Playwright browser tests.', estimatedHours: 15, resourceName: 'Vitest Guide', resourceLink: 'https://vitest.dev/' },
      { id: 'fs-t9', number: 9, title: 'Full-Stack Capstone Project', description: 'Build an end-to-end production web application from scratch.', estimatedHours: 15, resourceName: 'SkillPath Project Templates', resourceLink: 'https://github.com' },
      { id: 'fs-t10', number: 10, title: 'CI/CD & Cloud Infrastructure', description: 'Automated GitHub Actions pipelines, Vercel frontend, and managed cloud backend.', estimatedHours: 8, resourceName: 'GitHub Actions Docs', resourceLink: 'https://docs.github.com/en/actions' }
    ]
  },
  {
    id: 'roadmap-ai-engineer',
    slug: 'ai-engineer',
    title: 'AI & Data Science Roadmap',
    careerTitle: 'AI Engineer',
    description: 'Master Python, data analysis, machine learning algorithms, and generative AI integrations.',
    totalEstimatedHours: 140,
    topics: [
      { id: 'ai-t1', number: 1, title: 'Python Fundamentals & Scripting', description: 'Syntax, data structures, list comprehensions, file handling, and OOP.', estimatedHours: 15, resourceName: 'Python.org Official Tutorial', resourceLink: 'https://docs.python.org/3/tutorial/' },
      { id: 'ai-t2', number: 2, title: 'NumPy & Vectorized Math', description: 'Multi-dimensional arrays, matrix operations, indexing, and linear algebra.', estimatedHours: 12, resourceName: 'NumPy User Guide', resourceLink: 'https://numpy.org/doc/stable/' },
      { id: 'ai-t3', number: 3, title: 'Pandas & Data Wrangling', description: 'DataFrames, cleaning missing values, grouping, aggregations, and merging.', estimatedHours: 18, resourceName: 'Pandas 10-Minute Guide', resourceLink: 'https://pandas.pydata.org/docs/' },
      { id: 'ai-t4', number: 4, title: 'Data Visualization & Storytelling', description: 'Matplotlib, Seaborn, interactive charting with Recharts and dashboards.', estimatedHours: 10, resourceName: 'Seaborn Tutorial', resourceLink: 'https://seaborn.pydata.org/' },
      { id: 'ai-t5', number: 5, title: 'Exploratory Data Analysis (EDA)', description: 'Statistical distributions, hypothesis testing, correlation, and feature scaling.', estimatedHours: 14, resourceName: 'Kaggle Learn: Data Cleaning', resourceLink: 'https://www.kaggle.com/learn' },
      { id: 'ai-t6', number: 6, title: 'Classical Machine Learning', description: 'Supervised vs unsupervised learning, regression, decision trees, random forests.', estimatedHours: 20, resourceName: 'Scikit-Learn Documentation', resourceLink: 'https://scikit-learn.org/' },
      { id: 'ai-t7', number: 7, title: 'Model Evaluation & Tuning', description: 'Cross-validation, precision/recall, ROC-AUC curves, hyperparameter search.', estimatedHours: 12, resourceName: 'Google Machine Learning Crash Course', resourceLink: 'https://developers.google.com/machine-learning/crash-course' },
      { id: 'ai-t8', number: 8, title: 'Deep Learning & Neural Networks', description: 'Perceptrons, backpropagation, PyTorch tensors, computer vision and NLP.', estimatedHours: 18, resourceName: 'PyTorch Deep Learning Tutorials', resourceLink: 'https://pytorch.org/tutorials/' },
      { id: 'ai-t9', number: 9, title: 'LLM APIs & Prompt Engineering', description: 'Integrating Gemini/OpenAI APIs, structured JSON outputs, system prompts.', estimatedHours: 12, resourceName: 'Google AI Studio & Gemini Docs', resourceLink: 'https://ai.google.dev/' },
      { id: 'ai-t10', number: 10, title: 'RAG & Vector Search Deployment', description: 'Vector embeddings, semantic search, FastAPI deployment, and monitoring.', estimatedHours: 9, resourceName: 'ChromaDB & LangChain Guide', resourceLink: 'https://docs.trychroma.com/' }
    ]
  }
];

export const getRoadmapBySlug = (slug) => {
  return roadmapsData.find((r) => r.slug === slug) || roadmapsData[0];
};

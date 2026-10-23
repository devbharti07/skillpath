import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillPath database seed...');

  // Clean existing seed tables if needed
  await prisma.aIConversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.task.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.userProject.deleteMany();
  await prisma.project.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.userRoadmapProgress.deleteMany();
  await prisma.userRoadmap.deleteMany();
  await prisma.roadmapItem.deleteMany();
  await prisma.roadmapPhase.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.assessmentResponse.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.careerSkill.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.career.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Skills
  const skillsData = [
    { name: 'JavaScript', slug: 'javascript', category: 'Frontend', description: 'Core programming language of the web, enabling interactive interfaces and modern async workflows.', icon: 'Code', isCore: true },
    { name: 'HTML & CSS', slug: 'html-css', category: 'Frontend', description: 'Semantic markup and responsive styling fundamentals including Flexbox, Grid, and accessibility.', icon: 'Layout', isCore: true },
    { name: 'React', slug: 'react', category: 'Frontend', description: 'Component-based UI development with hooks, virtual DOM, state management, and modern patterns.', icon: 'Component', isCore: true },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend', description: 'JavaScript runtime for building scalable server-side applications, REST APIs, and event-driven microservices.', icon: 'Server', isCore: true },
    { name: 'Python', slug: 'python', category: 'Data', description: 'Versatile language for backend development, data engineering, machine learning, and automation scripting.', icon: 'Terminal', isCore: true },
    { name: 'SQL', slug: 'sql', category: 'Data', description: 'Relational database querying, normalization, aggregation, indexing, and complex data extraction.', icon: 'Database', isCore: true },
    { name: 'Git & GitHub', slug: 'git-github', category: 'Core', description: 'Distributed version control, branching workflows, pull requests, code reviews, and collaboration.', icon: 'GitBranch', isCore: true },
    { name: 'Docker', slug: 'docker', category: 'Cloud', description: 'Containerization, microservices isolation, Dockerfile writing, and local environment reproducibility.', icon: 'Box', isCore: false },
    { name: 'Data Structures & Algorithms', slug: 'dsa', category: 'Core', description: 'Arrays, trees, graphs, sorting, searching, time/space complexity analysis (Big-O).', icon: 'Cpu', isCore: true },
    { name: 'UI/UX Design', slug: 'ui-ux-design', category: 'Design', description: 'User-centered design principles, wireframing, high-fidelity prototyping, typography, and usability testing.', icon: 'Palette', isCore: true },
    { name: 'Machine Learning', slug: 'machine-learning', category: 'AI', description: 'Supervised and unsupervised learning, model evaluation, regression, classification, and neural basics.', icon: 'Brain', isCore: false },
    { name: 'Data Analysis', slug: 'data-analysis', category: 'Data', description: 'Exploratory data analysis, statistical metrics, trend analysis, visualization, and actionable reporting.', icon: 'BarChart2', isCore: true },
    { name: 'Communication', slug: 'communication', category: 'Core', description: 'Technical documentation, cross-functional stakeholder updates, presentations, and peer feedback.', icon: 'MessageSquare', isCore: true },
    { name: 'Problem Solving', slug: 'problem-solving', category: 'Core', description: 'Root cause analysis, debugging strategies, algorithmic thinking, and methodical decomposition.', icon: 'Lightbulb', isCore: true },
    { name: 'REST APIs', slug: 'rest-apis', category: 'Backend', description: 'Designing clean, stateless, idempotent HTTP endpoints with JSON serialization and proper status codes.', icon: 'Network', isCore: true }
  ];

  const createdSkills = {};
  for (const skill of skillsData) {
    const s = await prisma.skill.create({ data: skill });
    createdSkills[skill.slug] = s;
  }
  console.log(`✓ Seeded ${skillsData.length} skills`);

  // 2. Seed Careers
  const careersData = [
    {
      slug: 'frontend-developer',
      title: 'Frontend Developer',
      category: 'Engineering',
      description: 'Build user-facing web applications with modern responsive design, state-driven interfaces, and accessibility standards.',
      responsibilities: JSON.stringify([
        'Translate UI/UX wireframes and mockups into responsive, accessible web applications',
        'Implement dynamic state management, API data fetching, and micro-interactions',
        'Optimize client-side performance, core web vitals, and bundle size',
        'Write unit and integration tests for interface components',
        'Collaborate with backend engineers, UX designers, and product managers'
      ]),
      technicalSkills: JSON.stringify(['JavaScript', 'HTML & CSS', 'React', 'Git & GitHub', 'REST APIs']),
      softSkills: JSON.stringify(['Attention to Detail', 'Problem Solving', 'Communication', 'Empathy for Users']),
      prerequisites: JSON.stringify(['Basic computer literacy', 'Curiosity for design & interactivity', 'Familiarity with web browsers']),
      difficulty: 'Beginner to Intermediate',
      estimatedLearningWeeks: 24,
      exampleProjects: JSON.stringify([
        'Interactive Developer Portfolio',
        'Real-time Task & Project Tracker',
        'API-Driven Weather & Analytics Dashboard'
      ]),
      salaryNote: 'Educational market context: US entry-level average approx $75,000–$95,000 / Global remote varies widely. Sourced from Industry Benchmark Reports 2025.',
      marketOutlook: 'High demand for developers skilled in modern component frameworks and performance optimization.',
      sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm'
    },
    {
      slug: 'backend-developer',
      title: 'Backend Developer',
      category: 'Engineering',
      description: 'Architect reliable server-side systems, business logic, secure database schemas, and robust API ecosystems.',
      responsibilities: JSON.stringify([
        'Design, implement, and document scalable RESTful and GraphQL APIs',
        'Model normalized database schemas, write efficient queries, and configure migrations',
        'Implement authentication, authorization, session management, and rate limiting',
        'Monitor server performance, error logging, and latency bottlenecks',
        'Integrate third-party services, payment processors, and webhooks'
      ]),
      technicalSkills: JSON.stringify(['Node.js', 'SQL', 'REST APIs', 'Git & GitHub', 'Docker']),
      softSkills: JSON.stringify(['Logical Reasoning', 'Systems Thinking', 'Methodical Debugging', 'Collaboration']),
      prerequisites: JSON.stringify(['Basic programming logic', 'Understanding of client-server concept', 'Command line basics']),
      difficulty: 'Intermediate',
      estimatedLearningWeeks: 26,
      exampleProjects: JSON.stringify([
        'Multi-tenant Authentication & Authorization Service',
        'E-commerce Inventory & Checkout API',
        'Real-time Chat Engine with WebSockets'
      ]),
      salaryNote: 'Educational market context: US entry-level approx $80,000–$100,000. Data verified via standard tech compensation surveys 2025.',
      marketOutlook: 'Steady long-term growth across financial, SaaS, and cloud enterprise software.',
      sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm'
    },
    {
      slug: 'fullstack-developer',
      title: 'Full-Stack Developer',
      category: 'Engineering',
      description: 'Bridge user experience and server architecture by delivering complete end-to-end web applications.',
      responsibilities: JSON.stringify([
        'Develop end-to-end features spanning frontend UI and backend endpoints',
        'Manage relational and document databases with automated migration pipelines',
        'Enforce security best practices from client inputs to database sanitization',
        'Deploy applications using modern cloud hosting and CI/CD pipelines',
        'Prototype new product capabilities rapidly from concept to release'
      ]),
      technicalSkills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'SQL', 'Git & GitHub', 'REST APIs']),
      softSkills: JSON.stringify(['Adaptability', 'Time Management', 'Broad Technical Curiosity', 'Communication']),
      prerequisites: JSON.stringify(['Web fundamentals', 'Basic JavaScript or Python knowledge']),
      difficulty: 'Intermediate to Advanced',
      estimatedLearningWeeks: 32,
      exampleProjects: JSON.stringify([
        'Full-Stack Collaborative Workspace Platform',
        'Subscription-based Content Management System',
        'Interactive Skill Assessment & Grading Platform'
      ]),
      salaryNote: 'Educational market context: US entry-level approx $85,000–$110,000 according to industry salary data 2025.',
      marketOutlook: 'Exceptionally popular across startups and growth-stage technology firms.',
      sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm'
    },
    {
      slug: 'data-analyst',
      title: 'Data Analyst',
      category: 'Data',
      description: 'Transform raw data into meaningful business insights, executive dashboards, and evidence-based decisions.',
      responsibilities: JSON.stringify([
        'Extract, clean, and validate datasets using SQL and Python',
        'Build automated dashboards and visualizations to track Key Performance Indicators (KPIs)',
        'Identify behavioral trends, anomalies, and operational optimization opportunities',
        'Communicate data-backed recommendations to non-technical stakeholders',
        'Ensure data hygiene, consistency, and compliance with data governance standards'
      ]),
      technicalSkills: JSON.stringify(['SQL', 'Python', 'Data Analysis', 'Problem Solving']),
      softSkills: JSON.stringify(['Data Storytelling', 'Critical Thinking', 'Business Acumen', 'Curiosity']),
      prerequisites: JSON.stringify(['Familiarity with spreadsheets', 'Basic arithmetic & statistical concepts']),
      difficulty: 'Beginner to Intermediate',
      estimatedLearningWeeks: 20,
      exampleProjects: JSON.stringify([
        'Customer Churn and Retention Cohort Analysis',
        'E-Commerce Sales Performance & Forecasting Dashboard',
        'Operational Bottleneck & Productivity Deep-dive'
      ]),
      salaryNote: 'Educational market context: US entry-level approx $65,000–$85,000 based on standard labor analytics 2025.',
      marketOutlook: 'Strong cross-industry demand across healthcare, finance, retail, and tech.',
      sourceUrl: 'https://www.bls.gov/ooh/math/operations-research-analysts.htm'
    },
    {
      slug: 'ai-machine-learning-engineer',
      title: 'AI & Machine Learning Engineer',
      category: 'AI',
      description: 'Design, train, and deploy intelligent models, NLP algorithms, and automated inference pipelines.',
      responsibilities: JSON.stringify([
        'Preprocess, clean, and augment complex datasets for machine learning training',
        'Train, evaluate, and tune baseline models for classification, regression, and clustering',
        'Integrate foundational LLMs and embedding vectors into production applications',
        'Build scalable model inference endpoints with low latency',
        'Monitor model drift, fairness, accuracy, and computational efficiency'
      ]),
      technicalSkills: JSON.stringify(['Python', 'Machine Learning', 'Data Structures & Algorithms', 'SQL']),
      softSkills: JSON.stringify(['Mathematical Rigor', 'Experimentation Mindset', 'Ethics in AI', 'Communication']),
      prerequisites: JSON.stringify(['Intermediate Python', 'Linear algebra & calculus basics', 'Probability fundamentals']),
      difficulty: 'Advanced',
      estimatedLearningWeeks: 36,
      exampleProjects: JSON.stringify([
        'Intelligent Career Recommendation Engine with Embeddings',
        'Predictive Student Retention Classification Model',
        'Domain-Specific RAG Knowledge Retrieval System'
      ]),
      salaryNote: 'Educational market context: US entry-level approx $95,000–$125,000 based on modern tech benchmarks 2025.',
      marketOutlook: 'Explosive expansion driven by enterprise generative AI adoption and automation.',
      sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/computer-and-information-research-scientists.htm'
    },
    {
      slug: 'ui-ux-designer',
      title: 'UI/UX Designer',
      category: 'Design',
      description: 'Craft intuitive, aesthetically captivating, user-centric software experiences and design systems.',
      responsibilities: JSON.stringify([
        'Conduct qualitative user interviews, usability tests, and persona research',
        'Create information architecture maps, user journey flows, and low-fidelity wireframes',
        'Design high-fidelity component libraries and coherent design token systems',
        'Prototype interactive transitions, animations, and micro-interactions',
        'Inspect frontend implementation to preserve design integrity and accessibility'
      ]),
      technicalSkills: JSON.stringify(['UI/UX Design', 'HTML & CSS', 'Communication']),
      softSkills: JSON.stringify(['Empathy', 'Visual Taste', 'Constructive Feedback', 'Presentation Skills']),
      prerequisites: JSON.stringify(['Visual curiosity', 'Interest in human behavior and software interfaces']),
      difficulty: 'Beginner to Intermediate',
      estimatedLearningWeeks: 20,
      exampleProjects: JSON.stringify([
        'Comprehensive Multi-Device SaaS Design System',
        'Mobile Healthcare App Redesign with Usability Studies',
        'Student Career Discovery Interactive Web App Prototype'
      ]),
      salaryNote: 'Educational market context: US entry-level approx $70,000–$90,000 based on standard design compensation reports 2025.',
      marketOutlook: 'Continuous demand for designers who understand design systems and product logic.',
      sourceUrl: 'https://www.bls.gov/ooh/arts-and-design/special-effects-artists-and-animators.htm'
    }
  ];

  const createdCareers = {};
  for (const career of careersData) {
    const c = await prisma.career.create({ data: career });
    createdCareers[career.slug] = c;
  }
  console.log(`✓ Seeded ${careersData.length} careers`);

  // Link career skills
  const careerSkillLinks = [
    { careerSlug: 'frontend-developer', skillSlugs: ['javascript', 'html-css', 'react', 'git-github', 'rest-apis'] },
    { careerSlug: 'backend-developer', skillSlugs: ['nodejs', 'sql', 'rest-apis', 'git-github', 'docker'] },
    { careerSlug: 'fullstack-developer', skillSlugs: ['javascript', 'react', 'nodejs', 'sql', 'git-github', 'rest-apis'] },
    { careerSlug: 'data-analyst', skillSlugs: ['sql', 'python', 'data-analysis', 'problem-solving'] },
    { careerSlug: 'ai-machine-learning-engineer', skillSlugs: ['python', 'machine-learning', 'dsa', 'sql'] },
    { careerSlug: 'ui-ux-designer', skillSlugs: ['ui-ux-design', 'html-css', 'communication'] }
  ];

  for (const link of careerSkillLinks) {
    const c = createdCareers[link.careerSlug];
    if (c) {
      for (const skillSlug of link.skillSlugs) {
        const s = createdSkills[skillSlug];
        if (s) {
          await prisma.careerSkill.create({
            data: {
              careerId: c.id,
              skillId: s.id,
              isRequired: true,
              importanceLevel: 'HIGH'
            }
          });
        }
      }
    }
  }

  // 3. Seed Assessments & Questions
  const assessmentsData = [
    {
      slug: 'javascript-fundamentals',
      title: 'JavaScript Core Fundamentals',
      category: 'Frontend',
      difficulty: 'BEGINNER',
      durationMinutes: 15,
      passingScorePercent: 60,
      description: 'Evaluate core JavaScript competence including scope, closures, arrays, promises, and ES6+ features.',
      instructions: 'Answer all 6 multiple-choice questions. Take your time to review each code snippet carefully before selecting.',
      questions: [
        {
          questionText: 'What is the output of typeof null in JavaScript?',
          explanation: 'In JavaScript, typeof null returns "object" due to a historical legacy implementation detail in the initial JavaScript engine.',
          orderIndex: 1,
          options: [
            { optionText: '"null"', isCorrect: false },
            { optionText: '"object"', isCorrect: true },
            { optionText: '"undefined"', isCorrect: false },
            { optionText: '"boolean"', isCorrect: false }
          ]
        },
        {
          questionText: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
          explanation: 'const creates a block-scoped binding whose identifier cannot be reassigned to a new memory reference.',
          orderIndex: 2,
          options: [
            { optionText: 'var', isCorrect: false },
            { optionText: 'let', isCorrect: false },
            { optionText: 'const', isCorrect: true },
            { optionText: 'static', isCorrect: false }
          ]
        },
        {
          questionText: 'What method returns a new array with elements that pass a provided test condition?',
          explanation: 'Array.prototype.filter() creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test function.',
          orderIndex: 3,
          options: [
            { optionText: 'forEach()', isCorrect: false },
            { optionText: 'map()', isCorrect: false },
            { optionText: 'filter()', isCorrect: true },
            { optionText: 'reduce()', isCorrect: false }
          ]
        },
        {
          questionText: 'How does JavaScript handle asynchronous operations under the hood?',
          explanation: 'JavaScript uses a single-threaded Event Loop with a Call Stack, Web APIs, and Task/Microtask Queues to handle asynchronous execution without blocking.',
          orderIndex: 4,
          options: [
            { optionText: 'By spawning multiple OS threads for each function', isCorrect: false },
            { optionText: 'Through the single-threaded Event Loop and task queues', isCorrect: true },
            { optionText: 'By pausing the browser until data arrives', isCorrect: false },
            { optionText: 'Through hardware-accelerated memory locks', isCorrect: false }
          ]
        },
        {
          questionText: 'What will Promise.all() do if any one of the input promises rejects?',
          explanation: 'Promise.all() rejects immediately upon any input promise rejecting (fail-fast behavior), returning that rejection reason.',
          orderIndex: 5,
          options: [
            { optionText: 'It waits for all others and returns only resolved ones', isCorrect: false },
            { optionText: 'It immediately rejects with the reason of the first rejected promise', isCorrect: true },
            { optionText: 'It converts the rejected promise into undefined', isCorrect: false },
            { optionText: 'It retries the failed promise three times', isCorrect: false }
          ]
        },
        {
          questionText: 'What is a closure in JavaScript?',
          explanation: 'A closure is the combination of a function bundled together with references to its lexical environment, allowing it to remember variables from outer scopes.',
          orderIndex: 6,
          options: [
            { optionText: 'A method to safely close open network sockets', isCorrect: false },
            { optionText: 'A function that retains access to its outer lexical scope even when executed outside that scope', isCorrect: true },
            { optionText: 'An anonymous function passed directly into addEventListener', isCorrect: false },
            { optionText: 'A built-in JSON parser function', isCorrect: false }
          ]
        }
      ]
    },
    {
      slug: 'react-fundamentals',
      title: 'React & Component Architecture',
      category: 'Frontend',
      difficulty: 'INTERMEDIATE',
      durationMinutes: 15,
      passingScorePercent: 65,
      description: 'Test your understanding of React component lifecycle, useState/useEffect, hooks rules, and performance patterns.',
      instructions: 'Read each scenario carefully. Each question tests practical React patterns used in modern web engineering.',
      questions: [
        {
          questionText: 'Why should you never call hooks inside loops, conditions, or nested functions?',
          explanation: 'React relies on the call order of hooks across multiple renders to correctly match state variables with their values.',
          orderIndex: 1,
          options: [
            { optionText: 'To keep bundle size under 50KB', isCorrect: false },
            { optionText: 'Because React tracks hook state based on predictable, consistent execution order', isCorrect: true },
            { optionText: 'Because JSX does not support conditionals', isCorrect: false },
            { optionText: 'To prevent JavaScript from throwing a syntax error', isCorrect: false }
          ]
        },
        {
          questionText: 'What is the purpose of the key prop when rendering lists in React?',
          explanation: 'The key prop helps React identify which items have changed, been added, or removed during Virtual DOM reconciliation.',
          orderIndex: 2,
          options: [
            { optionText: 'To style the HTML element directly with CSS', isCorrect: false },
            { optionText: 'To uniquely identify elements for efficient DOM reconciliation', isCorrect: true },
            { optionText: 'To encrypt sensitive student information', isCorrect: false },
            { optionText: 'To enable auto-scroll in long tables', isCorrect: false }
          ]
        },
        {
          questionText: 'When does a useEffect cleanup function run?',
          explanation: 'The cleanup function runs before the component unmounts and before the effect re-runs on subsequent state or prop changes.',
          orderIndex: 3,
          options: [
            { optionText: 'Only once when the browser window closes', isCorrect: false },
            { optionText: 'Before the effect executes again, and when the component unmounts', isCorrect: true },
            { optionText: 'Immediately upon page refresh', isCorrect: false },
            { optionText: 'Only if an unhandled JavaScript error is caught', isCorrect: false }
          ]
        },
        {
          questionText: 'What is the advantage of using useMemo or useCallback?',
          explanation: 'They memoize expensive computations or function references to prevent unnecessary recalculations and child re-renders.',
          orderIndex: 4,
          options: [
            { optionText: 'They automatically send crash reports to the server', isCorrect: false },
            { optionText: 'They memoize values and function references between re-renders to prevent redundant execution', isCorrect: true },
            { optionText: 'They replace the need for CSS animations', isCorrect: false },
            { optionText: 'They make asynchronous network calls synchronous', isCorrect: false }
          ]
        },
        {
          questionText: 'In React, what constitutes "one-way data flow"?',
          explanation: 'Data flows down from parent components to child components via props, and children communicate changes back through callback functions.',
          orderIndex: 5,
          options: [
            { optionText: 'Data can only flow from the database to the browser', isCorrect: false },
            { optionText: 'State is passed downwards via props, and events/callbacks flow upwards', isCorrect: true },
            { optionText: 'Only one user can submit a form at a time', isCorrect: false },
            { optionText: 'Data travels solely via WebSocket channels', isCorrect: false }
          ]
        }
      ]
    },
    {
      slug: 'sql-database-fundamentals',
      title: 'SQL & Database Architecture',
      category: 'Data',
      difficulty: 'BEGINNER',
      durationMinutes: 12,
      passingScorePercent: 60,
      description: 'Assess relational database querying, joins, aggregate functions, and normalization principles.',
      instructions: 'Select the most correct query or conceptual explanation for each question.',
      questions: [
        {
          questionText: 'Which SQL clause is used to filter records resulting from an aggregate function like COUNT() or AVG()?',
          explanation: 'HAVING filters aggregated groups created by GROUP BY, whereas WHERE filters individual rows before aggregation.',
          orderIndex: 1,
          options: [
            { optionText: 'WHERE', isCorrect: false },
            { optionText: 'HAVING', isCorrect: true },
            { optionText: 'ORDER BY', isCorrect: false },
            { optionText: 'LIMIT', isCorrect: false }
          ]
        },
        {
          questionText: 'What does a LEFT JOIN return?',
          explanation: 'A LEFT JOIN returns all rows from the left table, along with matched records from the right table, or NULL if there is no match.',
          orderIndex: 2,
          options: [
            { optionText: 'Only rows that have matches in both tables', isCorrect: false },
            { optionText: 'All rows from the left table and matching rows from the right table', isCorrect: true },
            { optionText: 'Only rows that do not exist in the right table', isCorrect: false },
            { optionText: 'A Cartesian product of all rows', isCorrect: false }
          ]
        },
        {
          questionText: 'What is the primary benefit of creating an index on a frequently queried column?',
          explanation: 'Database indexes speed up data retrieval (SELECTs) by using B-tree or hash lookups instead of scanning the full table.',
          orderIndex: 3,
          options: [
            { optionText: 'It compresses the column data to save hard disk space', isCorrect: false },
            { optionText: 'It accelerates search and lookup queries at the cost of slightly slower writes', isCorrect: true },
            { optionText: 'It prevents SQL injection vulnerabilities automatically', isCorrect: false },
            { optionText: 'It converts varchar fields to integers', isCorrect: false }
          ]
        },
        {
          questionText: 'What property in ACID guarantees that all parts of a transaction succeed or none take effect?',
          explanation: 'Atomicity ensures that all statements within a transaction are treated as a single indivisible unit: either all commit or all rollback.',
          orderIndex: 4,
          options: [
            { optionText: 'Atomicity', isCorrect: true },
            { optionText: 'Consistency', isCorrect: false },
            { optionText: 'Isolation', isCorrect: false },
            { optionText: 'Durability', isCorrect: false }
          ]
        }
      ]
    },
    {
      slug: 'python-foundations',
      title: 'Python Programming Foundations',
      category: 'Data',
      difficulty: 'BEGINNER',
      durationMinutes: 12,
      passingScorePercent: 60,
      description: 'Evaluate essential Python syntax, data types, list comprehensions, and error handling.',
      instructions: 'Select the correct answer based on standard Python 3 execution semantics.',
      questions: [
        {
          questionText: 'What is the result of [x**2 for x in range(4)] in Python?',
          explanation: 'range(4) produces 0, 1, 2, 3. Squaring each yields [0, 1, 4, 9].',
          orderIndex: 1,
          options: [
            { optionText: '[1, 4, 9, 16]', isCorrect: false },
            { optionText: '[0, 1, 4, 9]', isCorrect: true },
            { optionText: '[0, 2, 4, 6]', isCorrect: false },
            { optionText: '[0, 1, 2, 3]', isCorrect: false }
          ]
        },
        {
          questionText: 'Which Python data structure is mutable and stores ordered elements?',
          explanation: 'Lists in Python are ordered and mutable, unlike tuples which are immutable.',
          orderIndex: 2,
          options: [
            { optionText: 'Tuple', isCorrect: false },
            { optionText: 'List', isCorrect: true },
            { optionText: 'Frozenset', isCorrect: false },
            { optionText: 'String', isCorrect: false }
          ]
        },
        {
          questionText: 'What keyword is used to handle exceptions caught during runtime execution?',
          explanation: 'The try-except block is Python standard mechanism to catch and gracefully handle runtime exceptions.',
          orderIndex: 3,
          options: [
            { optionText: 'catch', isCorrect: false },
            { optionText: 'except', isCorrect: true },
            { optionText: 'handle', isCorrect: false },
            { optionText: 'rescue', isCorrect: false }
          ]
        }
      ]
    }
  ];

  for (const aData of assessmentsData) {
    const { questions, ...assessmentFields } = aData;
    const createdAssessment = await prisma.assessment.create({
      data: assessmentFields
    });

    for (const q of questions) {
      const { options, ...qFields } = q;
      const createdQ = await prisma.question.create({
        data: {
          ...qFields,
          assessmentId: createdAssessment.id
        }
      });

      for (let oIdx = 0; oIdx < options.length; oIdx++) {
        await prisma.answerOption.create({
          data: {
            questionId: createdQ.id,
            optionText: options[oIdx].optionText,
            isCorrect: options[oIdx].isCorrect,
            orderIndex: oIdx + 1
          }
        });
      }
    }
  }
  console.log(`✓ Seeded ${assessmentsData.length} assessments with questions and answer options`);

  // 4. Seed Structured Roadmaps (including exact 6 Phases for Frontend as specified in Section 10)
  const feCareer = createdCareers['frontend-developer'];
  const frontendRoadmap = await prisma.roadmap.create({
    data: {
      slug: 'frontend-developer-roadmap',
      title: 'Frontend Developer Career Roadmap',
      careerId: feCareer ? feCareer.id : null,
      description: 'A structured, progressive roadmap from web fundamentals to professional portfolio readiness.',
      durationWeeks: 24,
      level: 'BEGINNER',
      isPublished: true
    }
  });

  const fePhases = [
    {
      phaseNumber: 1,
      title: 'Web Fundamentals',
      description: 'Master internet mechanics, semantic markup, modern CSS layouts, and mobile responsiveness.',
      items: [
        { title: 'Internet Basics & HTTP/HTTPS', description: 'Understand DNS lookups, client-server communication, request/response cycles, and status codes.', estimatedHours: 6, learningResources: JSON.stringify(['https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics']) },
        { title: 'How Websites Work & Browser Rendering', description: 'DOM tree construction, CSSOM, Render tree, reflow, and paint pipeline.', estimatedHours: 8, learningResources: JSON.stringify(['https://web.dev/critical-rendering-path/']) },
        { title: 'HTML5 Semantic Elements & Accessibility', description: 'Header, nav, main, article, section, footer, and basic ARIA roles for screen readers.', estimatedHours: 10, learningResources: JSON.stringify(['https://developer.mozilla.org/en-US/docs/Learn/HTML']) },
        { title: 'Modern CSS, Flexbox & CSS Grid', description: 'Box model, cascading hierarchy, specificity, Flexbox axis alignment, and responsive Grid layouts.', estimatedHours: 14, learningResources: JSON.stringify(['https://css-tricks.com/snippets/css/a-guide-to-flexbox/']) },
        { title: 'Responsive Design & Mobile-First Media Queries', description: 'Viewport meta tag, fluid units (rem, %, vh), and breakpoint architecture.', estimatedHours: 8, learningResources: JSON.stringify(['https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design']) }
      ]
    },
    {
      phaseNumber: 2,
      title: 'JavaScript Fundamentals & Async',
      description: 'Deep dive into JavaScript programming, DOM manipulation, event-driven programming, and APIs.',
      items: [
        { title: 'Variables, Data Types & Scope', description: 'Primitive vs reference types, let/const, block scoping, and hoisting.', estimatedHours: 8, learningResources: JSON.stringify(['https://javascript.info/first-steps']) },
        { title: 'Functions, Arrow Functions & Closures', description: 'Higher-order functions, parameters, return values, lexical scoping, and closures in practice.', estimatedHours: 10, learningResources: JSON.stringify(['https://javascript.info/closure']) },
        { title: 'Arrays, Objects & Functional Methods', description: 'Map, filter, reduce, find, object destructuring, and spread operator.', estimatedHours: 10, learningResources: JSON.stringify(['https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array']) },
        { title: 'DOM Manipulation & Event Listeners', description: 'Query selectors, event bubbling, event delegation, and dynamic element creation.', estimatedHours: 10, learningResources: JSON.stringify(['https://javascript.info/events']) },
        { title: 'Asynchronous JavaScript & Fetch API', description: 'Promises, async/await syntax, try/catch, error handling, and making REST API calls.', estimatedHours: 12, learningResources: JSON.stringify(['https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous']) }
      ]
    },
    {
      phaseNumber: 3,
      title: 'React & Modern Frontend Architecture',
      description: 'Build modular, state-driven interfaces with component hierarchies and custom hooks.',
      items: [
        { title: 'React Components & JSX Syntax', description: 'Writing declarative UI components, nesting, and conditional rendering.', estimatedHours: 8, learningResources: JSON.stringify(['https://react.dev/learn']) },
        { title: 'Props & State Management with useState', description: 'Passing immutable props down, managing local reactive state, and controlled form inputs.', estimatedHours: 10, learningResources: JSON.stringify(['https://react.dev/learn/state-a-components-memory']) },
        { title: 'Side Effects & Lifecycle with useEffect', description: 'Data fetching, subscription cleanup, dependency arrays, and race conditions.', estimatedHours: 12, learningResources: JSON.stringify(['https://react.dev/learn/synchronizing-with-effects']) },
        { title: 'Client-Side Routing with React Router', description: 'Dynamic routes, nested layouts, query parameters, and protected route wrappers.', estimatedHours: 8, learningResources: JSON.stringify(['https://reactrouter.com/en/main']) },
        { title: 'API Integration & Centralized Services', description: 'Abstracting HTTP calls, loading skeletons, error states, and optimistic UI updates.', estimatedHours: 12, learningResources: JSON.stringify(['https://react.dev/learn/reusing-logic-with-custom-hooks']) }
      ]
    },
    {
      phaseNumber: 4,
      title: 'Professional Development Standards',
      description: 'Master collaboration tooling, version control, accessibility compliance, and build systems.',
      items: [
        { title: 'Git & GitHub Branching Strategies', description: 'Commits, feature branches, pull requests, merge conflict resolution, and collaborative reviews.', estimatedHours: 8, learningResources: JSON.stringify(['https://git-scm.com/doc']) },
        { title: 'Web Accessibility (WCAG 2.1)', description: 'Keyboard navigation, color contrast ratios, focus outlines, and screen reader testing.', estimatedHours: 6, learningResources: JSON.stringify(['https://www.w3.org/WAI/fundamentals/accessibility-intro/']) },
        { title: 'Frontend Testing with Vitest & RTL', description: 'Writing unit tests for pure utilities and integration tests for user component interactions.', estimatedHours: 10, learningResources: JSON.stringify(['https://testing-library.com/docs/react-testing-library/intro/']) },
        { title: 'Performance Optimization & Core Web Vitals', description: 'Code splitting, lazy loading, image optimization, and bundle analyzer diagnostics.', estimatedHours: 8, learningResources: JSON.stringify(['https://web.dev/vitals/']) },
        { title: 'Production Deployment & CI/CD Pipelines', description: 'Configuring automated builds, environment variables, and CDN hosting on Vercel/Netlify.', estimatedHours: 6, learningResources: JSON.stringify(['https://docs.github.com/en/actions']) }
      ]
    },
    {
      phaseNumber: 5,
      title: 'Portfolio Projects & Proof of Work',
      description: 'Ship distinct, polished applications that demonstrate real engineering problem-solving.',
      items: [
        { title: 'Responsive Personal Portfolio Site', description: 'Highlight your bio, verified skills, and interactive live demo links.', estimatedHours: 16, learningResources: JSON.stringify(['https://github.com']) },
        { title: 'Full-Featured Task Management Application', description: 'State management, drag-and-drop or status toggles, persistent storage, and filters.', estimatedHours: 20, learningResources: JSON.stringify(['https://react.dev']) },
        { title: 'API-Powered Real-Time Data Explorer', description: 'Multi-parameter search, pagination, dynamic chart visualizations, and responsive tables.', estimatedHours: 24, learningResources: JSON.stringify(['https://recharts.org']) },
        { title: 'Original Capstone Project', description: 'End-to-end design and build of a unique application addressing a real user challenge.', estimatedHours: 30, learningResources: JSON.stringify(['https://skillpath.dev']) }
      ]
    },
    {
      phaseNumber: 6,
      title: 'Career Preparation & Interview Readiness',
      description: 'Translate engineering skills into career opportunities with strong artifacts and interview practice.',
      items: [
        { title: 'Software Engineer Resume Optimization', description: 'Action-oriented bullet points with measurable impact metrics and clean formatting.', estimatedHours: 6, learningResources: JSON.stringify(['https://skillpath.dev']) },
        { title: 'GitHub Portfolio & Code Presentation', description: 'Writing clear READMEs, architecture summaries, installation instructions, and live demo links.', estimatedHours: 8, learningResources: JSON.stringify(['https://docs.github.com/en/repositories']) },
        { title: 'Technical Interview Preparation & DSA Basics', description: 'Arrays, hash maps, two-pointer techniques, and methodical whiteboard communication.', estimatedHours: 16, learningResources: JSON.stringify(['https://leetcode.com']) },
        { title: 'Behavioral Interviews & Application Strategy', description: 'STAR method answers, company research, asking thoughtful engineering questions, and follow-ups.', estimatedHours: 8, learningResources: JSON.stringify(['https://skillpath.dev']) }
      ]
    }
  ];

  for (const phase of fePhases) {
    const { items, ...pFields } = phase;
    const createdPhase = await prisma.roadmapPhase.create({
      data: {
        ...pFields,
        roadmapId: frontendRoadmap.id
      }
    });

    for (let i = 0; i < items.length; i++) {
      await prisma.roadmapItem.create({
        data: {
          phaseId: createdPhase.id,
          title: items[i].title,
          description: items[i].description,
          estimatedHours: items[i].estimatedHours,
          orderIndex: i + 1,
          learningResources: items[i].learningResources,
          completionCriteria: 'Complete study material, build practice code, and verify understanding.'
        }
      });
    }
  }

  // Also seed Backend & Data Analyst Roadmaps
  const beCareer = createdCareers['backend-developer'];
  const backendRoadmap = await prisma.roadmap.create({
    data: {
      slug: 'backend-developer-roadmap',
      title: 'Backend Developer Career Roadmap',
      careerId: beCareer ? beCareer.id : null,
      description: 'From Node.js foundations and REST API design to database scaling, security, and cloud deployment.',
      durationWeeks: 24,
      level: 'INTERMEDIATE',
      isPublished: true
    }
  });

  const bePhases = [
    {
      phaseNumber: 1,
      title: 'Server Fundamentals & Node.js Runtime',
      description: 'Core event-loop mechanisms, file system operations, and asynchronous architecture.',
      items: [
        { title: 'Node.js Architecture & Event Loop', description: 'Single-threaded event loop, libuv, process object, and buffers.', estimatedHours: 8 },
        { title: 'Modular Code with ES Modules & CommonJS', description: 'Import/export syntax, package.json management, and semantic versioning.', estimatedHours: 6 },
        { title: 'Express.js Framework Basics', description: 'Routing, middleware chains, req/res lifecycle, and error handlers.', estimatedHours: 10 }
      ]
    },
    {
      phaseNumber: 2,
      title: 'Database Architecture & ORMs',
      description: 'Relational data modeling, migrations, SQL optimization, and Prisma integration.',
      items: [
        { title: 'Relational Schema Design & Normalization', description: 'Primary keys, foreign keys, 1:1, 1:N, and N:M relationships with indexing.', estimatedHours: 12 },
        { title: 'Prisma ORM & Migrations', description: 'Schema declaration, queries, relations, cascade deletes, and automated seeding.', estimatedHours: 12 },
        { title: 'ACID Transactions & Concurrency Handling', description: 'Atomic updates, race condition prevention, and rollbacks.', estimatedHours: 8 }
      ]
    },
    {
      phaseNumber: 3,
      title: 'API Security, Authentication & Deployment',
      description: 'Hardened REST endpoints, token-based authentication, and cloud infrastructure.',
      items: [
        { title: 'Secure Authentication with JWT & Bcrypt', description: 'Password salting, HttpOnly secure cookies, token validation middleware.', estimatedHours: 12 },
        { title: 'Security Hardening: CORS, Helmet & Rate Limiting', description: 'Preventing brute-force attacks, XSS, and unauthorized cross-origin requests.', estimatedHours: 8 },
        { title: 'Docker Containerization & Cloud Hosting', description: 'Writing multi-stage Dockerfiles and running containers on cloud platforms.', estimatedHours: 10 }
      ]
    }
  ];

  for (const phase of bePhases) {
    const { items, ...pFields } = phase;
    const createdPhase = await prisma.roadmapPhase.create({
      data: {
        ...pFields,
        roadmapId: backendRoadmap.id
      }
    });

    for (let i = 0; i < items.length; i++) {
      await prisma.roadmapItem.create({
        data: {
          phaseId: createdPhase.id,
          title: items[i].title,
          description: items[i].description,
          estimatedHours: items[i].estimatedHours,
          orderIndex: i + 1,
          completionCriteria: 'Pass unit tests and implement backend endpoint with documentation.'
        }
      });
    }
  }

  console.log(`✓ Seeded roadmaps with detailed phases and progressive curriculum items`);

  // 5. Seed Curated Learning Resources
  const resourcesData = [
    {
      title: 'MDN Web Docs: JavaScript Guide',
      description: 'The definitive, authoritative reference for JavaScript language syntax, standard objects, and modern browser APIs.',
      category: 'Web',
      type: 'DOCS',
      difficulty: 'BEGINNER',
      durationMinutes: 45,
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
    },
    {
      title: 'React Official Documentation (react.dev)',
      description: 'Official interactive React documentation featuring deep dives on hooks, state synchronization, and component lifecycles.',
      category: 'Web',
      type: 'TUTORIAL',
      difficulty: 'BEGINNER',
      durationMinutes: 60,
      url: 'https://react.dev/learn'
    },
    {
      title: 'PostgreSQL Official Documentation',
      description: 'Comprehensive guide covering relational database architecture, SQL syntax, indexes, transactions, and performance tuning.',
      category: 'Data',
      type: 'DOCS',
      difficulty: 'INTERMEDIATE',
      durationMinutes: 50,
      url: 'https://www.postgresql.org/docs/'
    },
    {
      title: 'Python for Beginners (Python.org)',
      description: 'Structured official introduction to Python syntax, standard library modules, data types, and scripting best practices.',
      category: 'Data',
      type: 'TUTORIAL',
      difficulty: 'BEGINNER',
      durationMinutes: 40,
      url: 'https://www.python.org/about/gettingstarted/'
    },
    {
      title: 'Google UX Design Guidelines & Material Design 3',
      description: 'Industry-standard guidelines on accessibility, design token hierarchy, elevation, micro-interactions, and mobile UX.',
      category: 'Design',
      type: 'ARTICLE',
      difficulty: 'BEGINNER',
      durationMinutes: 30,
      url: 'https://m3.material.io/'
    },
    {
      title: 'CS50: Introduction to Computer Science (Harvard)',
      description: 'World-renowned foundational computer science curriculum covering algorithmic thinking, data structures, and software principles.',
      category: 'Foundations',
      type: 'VIDEO',
      difficulty: 'BEGINNER',
      durationMinutes: 90,
      url: 'https://cs50.harvard.edu/x/'
    },
    {
      title: 'OWASP Top 10 Web Application Security Risks',
      description: 'Essential security checklist covering broken access control, cryptographic failures, injection vulnerabilities, and mitigation techniques.',
      category: 'Web',
      type: 'ARTICLE',
      difficulty: 'INTERMEDIATE',
      durationMinutes: 35,
      url: 'https://owasp.org/www-project-top-ten/'
    },
    {
      title: 'Docker Getting Started Guide',
      description: 'Step-by-step introduction to containerizing applications, writing Dockerfiles, and managing volumes and network bridges.',
      category: 'Cloud',
      type: 'TUTORIAL',
      difficulty: 'INTERMEDIATE',
      durationMinutes: 45,
      url: 'https://docs.docker.com/get-started/'
    }
  ];

  for (const r of resourcesData) {
    await prisma.learningResource.create({ data: r });
  }
  console.log(`✓ Seeded ${resourcesData.length} learning resources`);

  // 6. Seed Project Templates
  const projectTemplates = [
    {
      title: 'Developer Portfolio & Technical Showcase',
      slug: 'developer-portfolio',
      description: 'Design and deploy an accessible, responsive personal website presenting your skills, roadmap milestones, and deployed demo projects.',
      category: 'Frontend',
      difficulty: 'BEGINNER',
      learningObjectives: JSON.stringify([
        'Master responsive mobile-first CSS styling',
        'Demonstrate component reusability and clean layout hierarchy',
        'Implement dark/light theme persistence',
        'Configure automated continuous deployment via Git'
      ]),
      milestones: JSON.stringify([
        { id: 1, title: 'Draft wireframe & information architecture', completed: false },
        { id: 2, title: 'Build hero section with clear call-to-action', completed: false },
        { id: 3, title: 'Implement project gallery with interactive modal previews', completed: false },
        { id: 4, title: 'Add working contact form with client-side validation', completed: false },
        { id: 5, title: 'Audit accessibility with Lighthouse and deploy live', completed: false }
      ]),
      suggestedTech: JSON.stringify(['React', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'Vercel'])
    },
    {
      title: 'Full-Stack Task & Goal Management System',
      slug: 'task-goal-management',
      description: 'Build a production-quality task tracking web application with authenticated users, priority flags, deadline filters, and persistent database storage.',
      category: 'Full-Stack',
      difficulty: 'INTERMEDIATE',
      learningObjectives: JSON.stringify([
        'Implement secure user registration, password hashing, and JWT cookies',
        'Build relational database models with foreign key constraints',
        'Create REST endpoints supporting full CRUD operations',
        'Implement dynamic UI status changes with responsive feedback'
      ]),
      milestones: JSON.stringify([
        { id: 1, title: 'Set up Express server and Prisma database schema', completed: false },
        { id: 2, title: 'Build authentication endpoints (register, login, me)', completed: false },
        { id: 3, title: 'Develop task management UI with status filters', completed: false },
        { id: 4, title: 'Add priority badges, due date pickers, and delete confirmations', completed: false },
        { id: 5, title: 'Write integration tests and verify authorization guards', completed: false }
      ]),
      suggestedTech: JSON.stringify(['React', 'Node.js', 'Express', 'Prisma', 'PostgreSQL/SQLite', 'Tailwind CSS'])
    },
    {
      title: 'Interactive Real-Time Analytics Dashboard',
      slug: 'interactive-analytics-dashboard',
      description: 'Create a rich business intelligence dashboard featuring KPI cards, trend charts, category breakdowns, and exportable data summaries.',
      category: 'Data & Frontend',
      difficulty: 'INTERMEDIATE',
      learningObjectives: JSON.stringify([
        'Render dynamic data visualizations using Recharts',
        'Implement multi-attribute filtering and timeframe toggles',
        'Design clean summary metrics and empty/loading states',
        'Ensure responsiveness across mobile, tablet, and desktop'
      ]),
      milestones: JSON.stringify([
        { id: 1, title: 'Structure dashboard grid layout and KPI metrics cards', completed: false },
        { id: 2, title: 'Integrate Recharts line charts, bar charts, and radar charts', completed: false },
        { id: 3, title: 'Add date range and category filter controls', completed: false },
        { id: 4, title: 'Build export feature for CSV/JSON reports', completed: false }
      ]),
      suggestedTech: JSON.stringify(['React', 'Recharts', 'Tailwind CSS', 'Lucide React'])
    }
  ];

  for (const p of projectTemplates) {
    await prisma.project.create({ data: p });
  }
  console.log(`✓ Seeded ${projectTemplates.length} project templates`);

  // 7. Seed Admin and Demo Student Accounts
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@skillpath.dev',
      passwordHash: adminPasswordHash,
      fullName: 'SkillPath Admin',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      profile: {
        create: {
          educationLevel: 'Bachelor of Computer Science',
          primaryCareerInterest: 'Full-Stack Development',
          bio: 'Platform administrator overseeing curriculum roadmaps, assessment standards, and platform health.',
          onboardingCompleted: true
        }
      }
    }
  });

  const studentPasswordHash = await bcrypt.hash('StudentPass123!', 10);
  const demoStudent = await prisma.user.create({
    data: {
      email: 'student@skillpath.dev',
      passwordHash: studentPasswordHash,
      fullName: 'Alex Morgan',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      profile: {
        create: {
          educationLevel: 'Undergraduate (Year 3)',
          primaryCareerInterest: 'Frontend Developer',
          bio: 'Passionate computer science student aiming to become a professional frontend and full-stack engineer.',
          technicalSkills: JSON.stringify(['JavaScript', 'HTML & CSS', 'React']),
          topicsEnjoyed: JSON.stringify(['Web Development', 'UI/UX Design', 'Cloud Computing']),
          preferredCareers: JSON.stringify(['Frontend Developer', 'Full-Stack Developer']),
          proficiencyLevel: 'INTERMEDIATE',
          weeklyAvailabilityHours: 15,
          shortTermGoals: 'Master React state management and complete three portfolio-grade projects.',
          longTermGoals: 'Secure a junior full-stack software engineering role at a modern tech product company.',
          githubUrl: 'https://github.com/alexmorgan-dev',
          portfolioWebsite: 'https://alexmorgan.dev',
          onboardingCompleted: true
        }
      }
    }
  });

  // Assign demo student an active roadmap with initial progress
  const userRoadmap = await prisma.userRoadmap.create({
    data: {
      userId: demoStudent.id,
      roadmapId: frontendRoadmap.id,
      status: 'ACTIVE',
      weeklyHours: 15,
      progressPercent: 20,
      notes: 'Focusing on mastering CSS Flexbox & Grid layouts this week.',
      targetCompletionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    }
  });

  // Mark first 3 items in phase 1 as completed for demo student
  const p1Items = await prisma.roadmapItem.findMany({
    where: { phase: { roadmapId: frontendRoadmap.id, phaseNumber: 1 } },
    take: 3
  });
  for (const item of p1Items) {
    await prisma.userRoadmapProgress.create({
      data: {
        userRoadmapId: userRoadmap.id,
        itemId: item.id,
        completed: true,
        completedAt: new Date()
      }
    });
  }

  // Create demo goals & tasks
  const demoGoal = await prisma.goal.create({
    data: {
      userId: demoStudent.id,
      title: 'Complete Web Fundamentals & First React App',
      description: 'Finish all Phase 1 items and build an interactive task application.',
      category: 'CAREER',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.task.createMany({
    data: [
      {
        userId: demoStudent.id,
        goalId: demoGoal.id,
        userRoadmapId: userRoadmap.id,
        title: 'Review CSS Grid responsive template layouts',
        priority: 'HIGH',
        status: 'COMPLETED',
        dueDate: new Date(),
        completedAt: new Date()
      },
      {
        userId: demoStudent.id,
        goalId: demoGoal.id,
        userRoadmapId: userRoadmap.id,
        title: 'Take the JavaScript Core Fundamentals Assessment',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: demoStudent.id,
        goalId: demoGoal.id,
        title: 'Draft layout for Developer Portfolio project',
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ]
  });

  // Add demo achievements
  await prisma.achievement.createMany({
    data: [
      {
        userId: demoStudent.id,
        title: 'First Step Forward',
        description: 'Successfully enrolled in your first career roadmap.',
        badgeIcon: 'Award',
        category: 'ROADMAP'
      },
      {
        userId: demoStudent.id,
        title: 'Curious Explorer',
        description: 'Completed student onboarding and set career targets.',
        badgeIcon: 'Compass',
        category: 'SPECIAL'
      }
    ]
  });

  // Add demo notification
  await prisma.notification.create({
    data: {
      userId: demoStudent.id,
      title: 'Welcome to SkillPath!',
      message: 'Your personalized roadmap is ready. Start by checking your today’s learning tasks.',
      type: 'SYSTEM'
    }
  });

  console.log(`✓ Seeded Admin account: admin@skillpath.dev / AdminPass123!`);
  console.log(`✓ Seeded Demo student account: student@skillpath.dev / StudentPass123!`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

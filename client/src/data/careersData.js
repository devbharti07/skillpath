// Curated Local Data for SkillPath Career Explorer
export const careersData = [
  {
    id: 'career-frontend-dev',
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Engineering',
    level: 'Beginner Friendly',
    description: 'Build responsive, accessible, interactive web interfaces that users interact with directly across desktop and mobile devices.',
    salaryRange: '$75,000 - $135,000',
    marketDemand: 'Very High',
    requiredSkills: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'React.js', 'Tailwind CSS', 'Git & GitHub', 'RESTful APIs'],
    softSkills: ['Visual Attention to Detail', 'User Empathy', 'Cross-functional Collaboration', 'Problem Solving'],
    prerequisites: ['Basic computer literacy', 'Familiarity with web browsers and dev tools', 'Logical thinking'],
    responsibilities: [
      'Translate UI/UX wireframes into clean, performant, and semantic code',
      'Optimize web pages for maximum speed, accessibility (WCAG), and scalability',
      'Integrate client-side applications with backend REST and GraphQL APIs',
      'Ensure cross-browser compatibility and responsive viewport handling'
    ],
    recommendedProjects: [
      {
        title: 'Interactive SaaS Dashboard',
        description: 'Build a responsive analytics portal using React, Tailwind CSS, and Recharts with dark mode support.',
        difficulty: 'Intermediate',
        tech: ['React', 'Tailwind CSS', 'Recharts']
      },
      {
        title: 'Kanban Task Management App',
        description: 'Create an intuitive drag-and-drop workflow board with localStorage persistence and filtering.',
        difficulty: 'Beginner',
        tech: ['JavaScript', 'HTML5', 'CSS Grid']
      },
      {
        title: 'E-Commerce Product Catalog',
        description: 'Develop a filterable product browser with cart state management, checkout validation, and search.',
        difficulty: 'Intermediate',
        tech: ['React', 'Context API', 'Lucide React']
      }
    ],
    roadmapSlug: 'frontend-developer',
    assessmentSlug: 'javascript-core'
  },
  {
    id: 'career-backend-dev',
    slug: 'backend-developer',
    title: 'Backend Developer',
    category: 'Engineering',
    level: 'Intermediate',
    description: 'Architect scalable server-side systems, data storage solutions, secure authentication protocols, and business logic APIs.',
    salaryRange: '$85,000 - $145,000',
    marketDemand: 'Very High',
    requiredSkills: ['Node.js & Express', 'SQL & Relational Databases', 'RESTful API Design', 'Data Modeling', 'Authentication & JWT', 'Server Security'],
    softSkills: ['Systems Architecture Thinking', 'Defensive Programming', 'Analytical Problem Solving', 'Documentation'],
    prerequisites: ['Proficiency with at least one programming language', 'Basic understanding of HTTP and client-server model'],
    responsibilities: [
      'Design and implement secure, high-throughput RESTful and GraphQL APIs',
      'Optimize database queries, indexing, transactions, and relational schema migrations',
      'Implement enterprise-grade authentication, authorization, and rate-limiting security',
      'Build asynchronous processing queues and background job workers'
    ],
    recommendedProjects: [
      {
        title: 'Modular E-Commerce REST API',
        description: 'Build a production-style REST API with JWT authentication, order processing, and role-based permissions.',
        difficulty: 'Intermediate',
        tech: ['Node.js', 'Express', 'SQL', 'JWT']
      },
      {
        title: 'Real-Time Notification Engine',
        description: 'Develop a microservice that streams system alerts and updates via WebSockets with Redis caching.',
        difficulty: 'Advanced',
        tech: ['Node.js', 'WebSockets', 'Redis']
      }
    ],
    roadmapSlug: 'backend-developer',
    assessmentSlug: 'sql-relational'
  },
  {
    id: 'career-fullstack-dev',
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer',
    category: 'Engineering',
    level: 'Comprehensive',
    description: 'Master both client-side interfaces and server-side infrastructure to deliver end-to-end digital products from scratch.',
    salaryRange: '$90,000 - $155,000',
    marketDemand: 'Extremely High',
    requiredSkills: ['React.js', 'Node.js & Express', 'SQL & NoSQL', 'TypeScript/JavaScript', 'REST & GraphQL', 'Cloud Deployment & CI/CD'],
    softSkills: ['End-to-End Ownership', 'Rapid Prototyping', 'Trade-off Evaluation', 'Communication'],
    prerequisites: ['Basic web fundamentals (HTML/CSS/JS)', 'Basic relational database concepts'],
    responsibilities: [
      'Deliver complete web features spanning frontend UI, backend controllers, and database models',
      'Maintain continuous integration, automated testing, and zero-downtime deployment pipelines',
      'Monitor application health, server performance, and client-side error telemetry'
    ],
    recommendedProjects: [
      {
        title: 'Full-Stack Learning & Career Platform',
        description: 'Develop an integrated learning workspace with progress tracking, assessments, and public portfolios.',
        difficulty: 'Advanced',
        tech: ['React', 'Node.js', 'Express', 'SQL']
      }
    ],
    roadmapSlug: 'fullstack-developer',
    assessmentSlug: 'react-fundamentals'
  },
  {
    id: 'career-ai-engineer',
    slug: 'ai-engineer',
    title: 'AI Engineer',
    category: 'Data & AI',
    level: 'Advanced',
    description: 'Bridge software engineering and artificial intelligence by integrating large language models, neural networks, and ML pipelines.',
    salaryRange: '$110,000 - $185,000',
    marketDemand: 'Surging',
    requiredSkills: ['Python', 'LLM APIs & Prompt Engineering', 'LangChain/LlamaIndex', 'Vector Databases & RAG', 'PyTorch/TensorFlow', 'REST APIs'],
    softSkills: ['Research Curiosity', 'Ethical AI Principles', 'Experimental Methodology', 'Critical Analysis'],
    prerequisites: ['Strong programming skills (Python preferred)', 'Linear algebra & probability fundamentals', 'API integration experience'],
    responsibilities: [
      'Integrate generative AI foundation models into customer-facing applications',
      'Implement Retrieval-Augmented Generation (RAG) pipelines over proprietary knowledge bases',
      'Fine-tune open-weights models and optimize inference latency and cost',
      'Evaluate model hallucinations, safety constraints, and output validation guardrails'
    ],
    recommendedProjects: [
      {
        title: 'RAG Knowledge Assistant',
        description: 'Create an intelligent document analysis assistant using vector embeddings and semantic search.',
        difficulty: 'Advanced',
        tech: ['Python', 'OpenAI/Gemini API', 'ChromaDB', 'FastAPI']
      }
    ],
    roadmapSlug: 'ai-engineer',
    assessmentSlug: 'python-programming'
  },
  {
    id: 'career-data-analyst',
    slug: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & AI',
    level: 'Beginner Friendly',
    description: 'Transform raw datasets into actionable executive insights, interactive dashboards, and statistical trend reports.',
    salaryRange: '$65,000 - $110,000',
    marketDemand: 'High',
    requiredSkills: ['SQL (Aggregations, Window Functions)', 'Data Visualization (Power BI/Tableau)', 'Excel Modeling', 'Python (Pandas, Seaborn)', 'Statistical Analysis'],
    softSkills: ['Business Storytelling', 'Curiosity', 'Executive Communication', 'Attention to Detail'],
    prerequisites: ['Basic math & statistics', 'Comfort working with tabular data'],
    responsibilities: [
      'Query relational data warehouses to isolate key operational performance indicators (KPIs)',
      'Design automated dashboards that empower leadership to make data-driven decisions',
      'Conduct exploratory data analysis (EDA) to uncover trends, anomalies, and correlations'
    ],
    recommendedProjects: [
      {
        title: 'Executive Sales & Cohort Retention Dashboard',
        description: 'Clean raw transaction logs and visualize monthly recurring revenue and churn rates.',
        difficulty: 'Beginner',
        tech: ['SQL', 'Python (Pandas)', 'Power BI / Recharts']
      }
    ],
    roadmapSlug: 'data-analyst',
    assessmentSlug: 'sql-relational'
  },
  {
    id: 'career-data-scientist',
    slug: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data & AI',
    level: 'Intermediate to Advanced',
    description: 'Apply advanced statistical modeling, machine learning algorithms, and predictive analytics to solve complex business challenges.',
    salaryRange: '$95,000 - $160,000',
    marketDemand: 'High',
    requiredSkills: ['Python & R', 'Scikit-Learn & ML Algorithms', 'Advanced Statistics', 'SQL', 'Feature Engineering', 'Data Cleaning & Preprocessing'],
    softSkills: ['Scientific Rigor', 'Hypothesis Testing', 'Clear Communication of Complex Math'],
    prerequisites: ['Calculus, linear algebra, and probability', 'Proficiency in Python programming'],
    responsibilities: [
      'Develop supervised and unsupervised machine learning algorithms for forecasting and segmentation',
      'Design and evaluate A/B experiments to measure product intervention effects',
      'Perform rigorous statistical feature engineering and cross-validation'
    ],
    recommendedProjects: [
      {
        title: 'Customer Churn Predictor',
        description: 'Train classification models to forecast churn likelihood with hyperparameter tuning and ROC-AUC evaluation.',
        difficulty: 'Intermediate',
        tech: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib']
      }
    ],
    roadmapSlug: 'data-scientist',
    assessmentSlug: 'python-programming'
  },
  {
    id: 'career-cybersecurity-analyst',
    slug: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    level: 'Intermediate',
    description: 'Protect networks, cloud infrastructure, and sensitive user data from cyber threats, vulnerabilities, and digital attacks.',
    salaryRange: '$80,000 - $135,000',
    marketDemand: 'Extremely High',
    requiredSkills: ['Network Protocols (TCP/IP, DNS, TLS)', 'SIEM & Threat Monitoring', 'Vulnerability Assessment', 'Linux Administration', 'Security Compliance & OWASP'],
    softSkills: ['Vigilance', 'Incident Response Under Pressure', 'Methodical Investigation', 'Integrity'],
    prerequisites: ['Basic understanding of operating systems (Linux/Windows)', 'Networking fundamentals'],
    responsibilities: [
      'Monitor intrusion detection systems (IDS) and investigate anomalies',
      'Perform regular vulnerability scans and coordinate patch management',
      'Enforce zero-trust security policies and educate teams on social engineering prevention'
    ],
    recommendedProjects: [
      {
        title: 'Automated Network Port & Vulnerability Scanner',
        description: 'Build a security script that audits open network ports and cross-references common CVE vulnerabilities.',
        difficulty: 'Intermediate',
        tech: ['Python', 'Nmap', 'Linux Shell']
      }
    ],
    roadmapSlug: 'cybersecurity-analyst',
    assessmentSlug: 'logical-reasoning'
  },
  {
    id: 'career-ui-ux-designer',
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    level: 'Beginner Friendly',
    description: 'Design beautiful, intuitive, and human-centered digital experiences through user research, wireframing, and interactive prototypes.',
    salaryRange: '$70,000 - $125,000',
    marketDemand: 'High',
    requiredSkills: ['Figma & Prototyping', 'Design Systems & Component Libraries', 'User Research & Personas', 'Usability Testing', 'Information Architecture', 'Accessibility (WCAG)'],
    softSkills: ['Empathy', 'Visual Storytelling', 'Active Listening', 'Iterative Mindset'],
    prerequisites: ['Keen eye for aesthetics and layout', 'Interest in human behavior and psychology'],
    responsibilities: [
      'Conduct user interviews, surveys, and usability testing sessions',
      'Create low-fidelity wireframes and interactive high-fidelity Figma design systems',
      'Collaborate directly with developers to guarantee faithful pixel-perfect implementation'
    ],
    recommendedProjects: [
      {
        title: 'Modern Mobile Banking & Budgeting App UI',
        description: 'Design an end-to-end fintech design system with interactive micro-interactions and dark mode tokens.',
        difficulty: 'Beginner to Intermediate',
        tech: ['Figma', 'Prototyping', 'Design Systems']
      }
    ],
    roadmapSlug: 'ui-ux-designer',
    assessmentSlug: 'html-css'
  },
  {
    id: 'career-cloud-engineer',
    slug: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Infrastructure',
    level: 'Intermediate to Advanced',
    description: 'Deploy, automate, and manage scalable cloud infrastructure across AWS, Google Cloud, and Azure environments.',
    salaryRange: '$95,000 - $160,000',
    marketDemand: 'Very High',
    requiredSkills: ['Cloud Platforms (AWS/GCP/Azure)', 'Docker & Containerization', 'Infrastructure as Code (Terraform)', 'Linux & Bash Scripting', 'CI/CD Pipelines (GitHub Actions)'],
    softSkills: ['Reliability Mindset', 'Automation Instinct', 'Systems Thinking', 'Incident Management'],
    prerequisites: ['Linux fundamentals', 'Basic networking and compute concepts'],
    responsibilities: [
      'Provision and orchestrate cloud resources declaratively with Terraform and Kubernetes',
      'Build robust CI/CD deployment pipelines that automate testing and rollouts',
      'Monitor cloud spend, implement autoscaling, and optimize high-availability architectures'
    ],
    recommendedProjects: [
      {
        title: 'Automated CI/CD Container Deployment',
        description: 'Set up an automated pipeline that builds Docker images and deploys them to cloud servers on git push.',
        difficulty: 'Intermediate',
        tech: ['Docker', 'GitHub Actions', 'AWS/GCP', 'Linux']
      }
    ],
    roadmapSlug: 'cloud-engineer',
    assessmentSlug: 'logical-reasoning'
  },
  {
    id: 'career-mobile-developer',
    slug: 'mobile-app-developer',
    title: 'Mobile App Developer',
    category: 'Engineering',
    level: 'Intermediate',
    description: 'Build native and cross-platform mobile applications for iOS and Android devices that deliver smooth native performance.',
    salaryRange: '$80,000 - $140,000',
    marketDemand: 'High',
    requiredSkills: ['React Native or Flutter', 'JavaScript/TypeScript or Dart', 'Mobile UI Components', 'State Management', 'Offline Storage & SQLite', 'App Store & Play Store Deployment'],
    softSkills: ['Device Optimization', 'Mobile UX Sensibility', 'Performance Profiling'],
    prerequisites: ['Core programming logic (JavaScript/Dart)', 'Basic understanding of mobile operating systems'],
    responsibilities: [
      'Develop smooth 60fps mobile interfaces that adapt to various phone and tablet screen dimensions',
      'Integrate device hardware features (camera, geolocation, push notifications, biometrics)',
      'Manage app store submission guidelines, code signing, and release staging'
    ],
    recommendedProjects: [
      {
        title: 'Fitness & Habit Tracking Mobile App',
        description: 'Build a cross-platform mobile application with offline persistence, streak reminders, and progress charts.',
        difficulty: 'Intermediate',
        tech: ['React Native', 'Expo', 'AsyncStorage', 'Lucide']
      }
    ],
    roadmapSlug: 'mobile-developer',
    assessmentSlug: 'react-fundamentals'
  }
];

export const getCareerBySlug = (slug) => {
  return careersData.find((c) => c.slug === slug) || null;
};

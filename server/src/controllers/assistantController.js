import prisma from '../config/prisma.js';

export const getAssistantHistory = async (req, res, next) => {
  try {
    const messages = await prisma.aIConversation.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'asc' },
      take: 40
    });
    return res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const clearAssistantHistory = async (req, res, next) => {
  try {
    await prisma.aIConversation.deleteMany({
      where: { userId: req.user.id }
    });
    return res.json({ message: 'Conversation history cleared.' });
  } catch (error) {
    next(error);
  }
};

export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter a valid question or career prompt.' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message is too long. Please limit questions to 1000 characters.' });
    }

    const trimmedMessage = message.trim();

    // Fetch user context for personalized assistance (without exposing secrets or PII)
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: req.user.id }
    });
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: req.user.id },
      include: { skill: true }
    });
    const userRoadmaps = await prisma.userRoadmap.findMany({
      where: { userId: req.user.id, status: 'ACTIVE' },
      include: { roadmap: true }
    });

    const studentContext = {
      careerInterest: userProfile?.primaryCareerInterest || 'Software Engineering',
      educationLevel: userProfile?.educationLevel || 'College Student',
      verifiedSkills: userSkills.filter(s => s.isVerified).map(s => s.skill.name),
      provisionalSkills: userSkills.filter(s => !s.isVerified).map(s => s.skill.name),
      activeRoadmaps: userRoadmaps.map(r => r.roadmap.title),
      weeklyHours: userProfile?.weeklyAvailabilityHours || 10
    };

    // Save user message to DB
    await prisma.aIConversation.create({
      data: {
        userId: req.user.id,
        role: 'USER',
        content: trimmedMessage
      }
    });

    let assistantResponse = '';
    let responseSource = 'SkillPath Intelligent Guidance Engine (Rule-based Fallback)';

    const apiKey = process.env.AI_API_KEY;

    if (apiKey) {
      try {
        // External LLM provider API call if configured
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are the SkillPath AI Career Assistant. Guide college students and beginners in exploring career paths, learning roadmaps, skills, and projects.
Student Context:
- Target Career: ${studentContext.careerInterest}
- Education: ${studentContext.educationLevel}
- Verified Skills: ${studentContext.verifiedSkills.join(', ') || 'None yet'}
- Unverified Skills: ${studentContext.provisionalSkills.join(', ') || 'None yet'}
- Active Roadmaps: ${studentContext.activeRoadmaps.join(', ') || 'None'}
- Weekly Availability: ${studentContext.weeklyHours} hours/week

Always be constructive, practical, and structured. Remind the student that career guidance is educational and does not guarantee job placement.
Question: ${trimmedMessage}`
                  }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            assistantResponse = candidateText;
            responseSource = 'SkillPath AI Engine (Connected via Gemini API)';
          }
        }
      } catch (err) {
        console.warn('AI API call failed, falling back to rule-based engine:', err.message);
      }
    }

    // If no API key or external call didn't produce text, use intelligent rule-based engine
    if (!assistantResponse) {
      const lower = trimmedMessage.toLowerCase();

      if (lower.includes('compare') || (lower.includes('frontend') && lower.includes('backend'))) {
        assistantResponse = `### Comparing Frontend vs. Backend Development

**Frontend Developer:**
* **Primary Focus:** User interfaces, responsiveness, accessibility, and client-side state.
* **Core Skills:** HTML5, CSS Grid/Flexbox, JavaScript (ES6+), React/Vue, REST APIs.
* **Best If You Enjoy:** Visual feedback, immediate user interaction, design execution.

**Backend Developer:**
* **Primary Focus:** Server architecture, database schema design, authentication, and API scalability.
* **Core Skills:** Node.js, Python, SQL, REST/GraphQL, Docker, Security fundamentals.
* **Best If You Enjoy:** Data modeling, logic decomposition, performance tuning, and system design.

**Recommendation for You:**
Based on your interest in **${studentContext.careerInterest}**, I recommend starting with the **Frontend Developer Roadmap** to build interactive projects, then progressing to full-stack API integration.`;
      } else if (lower.includes('project') || lower.includes('portfolio') || lower.includes('idea')) {
        assistantResponse = `### Recommended Portfolio Projects for ${studentContext.careerInterest}

To demonstrate real engineering competence to recruiters without relying on boilerplate clones, build:

1. **Interactive SaaS Dashboard:**
   * Implement authentication, dark/light mode, and dynamic data analytics with Recharts.
   * *Demonstrates:* Component architecture, state synchronization, and clean design systems.
2. **RESTful Workflow Management Tool:**
   * Build an Express + Prisma backend with relational tables (User, Project, Task) and role guards.
   * *Demonstrates:* Database normalization, CRUD operations, and error handling.
3. **Domain-Specific Resource or Search Tool:**
   * Create an application that parses or filters complex datasets with debounced search and pagination.
   * *Demonstrates:* Performance optimization, URL state synchronization, and edge-case handling.

*Pro tip:* Check the **Projects** section in SkillPath to track your milestones step-by-step!`;
      } else if (lower.includes('next') || lower.includes('step') || lower.includes('recommend') || lower.includes('start')) {
        assistantResponse = `### Your Recommended Next Step

Based on your profile:
* **Active Goal:** Progressing toward **${studentContext.careerInterest}**
* **Learning Time:** ${studentContext.weeklyHours} hours per week

**Action Plan:**
1. **Take an Assessment:** If you haven't taken the **JavaScript Core Fundamentals** or **HTML & CSS** assessments, complete one today. It takes ~15 minutes and will verify your core skills.
2. **Continue Your Roadmap:** Open **My Roadmaps** and tackle the next topic in Phase 1 (Web Fundamentals).
3. **Log a Daily Task:** Create a task in **Goals & Tasks** with today's target (e.g., "Build a responsive CSS Grid card layout").`;
      } else if (lower.includes('prerequisite') || lower.includes('prereq') || lower.includes('require')) {
        assistantResponse = `### Key Prerequisites for ${studentContext.careerInterest}

Before diving into advanced frameworks or cloud deployments, make sure you have solid grounding in:

1. **Foundational Syntax:** Variables, control flow, functions, arrays, and objects.
2. **Debugging Tools:** Using browser DevTools (Console, Network, Elements tabs) and reading stack traces.
3. **Version Control:** Git basics (init, commit, branch, merge, pull requests) and hosting code on GitHub.
4. **Relational Logic:** How tables connect with foreign keys and how client requests communicate with servers.

You can verify each of these in the **Skill Assessments** module on your dashboard!`;
      } else {
        assistantResponse = `Hello! I am your SkillPath Career Assistant. I am here to help you navigate your journey toward becoming a professional **${studentContext.careerInterest}**.

Here are some ways we can collaborate:
* **"Compare Frontend and Backend paths"** — Understand responsibilities, tools, and job profiles.
* **"Recommend my next learning step"** — Get guidance based on your active roadmaps and verified skills.
* **"Suggest project ideas for my portfolio"** — Get unique, production-grade project specifications.
* **"What are the prerequisites for AI/ML or Cloud?"** — Identify foundational concepts you need first.

How can I assist your career exploration today?`;
      }
    }

    // Save assistant response to DB
    const savedAssistantMsg = await prisma.aIConversation.create({
      data: {
        userId: req.user.id,
        role: 'ASSISTANT',
        content: assistantResponse
      }
    });

    return res.json({
      message: assistantResponse,
      source: responseSource,
      isAiGenerated: responseSource.includes('Gemini'),
      timestamp: savedAssistantMsg.createdAt,
      disclaimer: 'Career recommendations are educational estimates and do not constitute an employment guarantee.'
    });
  } catch (error) {
    next(error);
  }
};
